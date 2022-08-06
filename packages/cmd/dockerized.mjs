import { dirname, join, relative, basename, resolve } from "path";
import { parsePackageSelector, readProjects } from "@pnpm/filter-workspace-packages";
import findWorkspaceDir from "@pnpm/find-workspace-dir";
import { readFileSync, promises as fs } from "fs";
import { globby } from "globby";
import os from "os";
import { c as createTar } from 'tar';
import { pipeline } from "stream/promises";

const BASE_META_FILES = ['package.json', 'pnpm-lock.yaml', 'turbo.json', 'pnpm-workspace.yaml', '.npmrc'];

const dockerized = async (target, options) => {
  const { exclude, onlyList } = options;
  const cwd = await findWorkspaceDir.default(process.cwd());
  const projectDir = dirname(target);
  const pkgJson = JSON.parse(readFileSync(join(cwd, projectDir, 'package.json'), 'utf-8'));
  const { name: pkgName } = pkgJson;

  const metaPaths = await getPNPMFilterPaths(`${pkgName}...`, cwd);
  const depPaths = await getPNPMFilterPaths(`${pkgName}^...`, cwd);
  const patterns = metaPaths.map(p => `${p}/**/package.json`).concat([]);
  const pkgJsonPaths = await globby(patterns, { cwd, dot: true, gitignore: true });
  const rootMetaFiles = await globby(
    BASE_META_FILES,
    { cwd, dot: true, gitignore: true }
  );
  const metaFiles = [...pkgJsonPaths, ...rootMetaFiles];
  const packageFiles = await getAppFiles(projectDir, cwd, exclude);
  const dependencyFiles = (await Promise.all(depPaths.map(async (dPath) => await getAppFiles(dPath, cwd, exclude)))).flat();

  await withTmpDir(async (tmpdir) => {
    await Promise.all([
      fs.copyFile('Dockerfile', join(tmpdir, 'Dockerfile')),
      copyFiles(metaFiles, join(tmpdir, 'meta'), cwd),
      copyFiles(dependencyFiles, join(tmpdir, 'dep'), cwd),
      copyFiles(packageFiles, join(tmpdir, 'pkg'), cwd)
    ]);

    const files = await getFiles(tmpdir);

    if (!!onlyList) {
      for await (const path of files) console.log(path)
    } else {
      await pipeline(createTar({ gzip: true, cwd: tmpdir }, files), process.stdout) ;
    }
  });
}

async function getFiles (dir) {
  async function * yieldFiles (dirPath) {
    const paths = await fs.readdir(dirPath, { withFileTypes: true })
    for (const path of paths) {
      const res = resolve(dirPath, path.name)
      if (path.isDirectory()) {
        yield * yieldFiles(res)
      } else {
        yield res
      }
    }
  }

  const files = []
  for await (const f of yieldFiles(dir)) {
    files.push(relative(dir, f))
  }
  return files
}

const getPNPMFilterPaths = async (selector, cwd) => {
  const projects = await readProjects(cwd, [parsePackageSelector(selector, cwd)]);
  return await Promise.all(Object.keys(projects.selectedProjectsGraph).map(async (key) => {
    const filePath = relative(cwd, key).replaceAll('\\', '/');
    return Promise.resolve(filePath)
  }));
}

const getAppFiles = async (projectDir, cwd, exclude = []) => {
  const pattern = [`${projectDir}/**`].concat(exclude.length ? exclude.map(item => `!**/${item}`) : []);
  return await globby(
    pattern,
    { cwd, dot: true, gitignore: true }
  );
}

const withTmpDir = async (callable) => {
  let result;
  const tmpdirPath = await fs.mkdtemp(join(os.tmpdir(), basename(process.argv[1])));

  try {
    result = await callable(tmpdirPath)
  } catch (err) {
    console.log(err.message);
  } finally {
    await fs.rm(tmpdirPath, { recursive: true })
  }
  return result;
}

const copyFiles = async (files, destDir, cwd) => {
  return Promise.all(files.map(async (file) => {
    const dst = join(destDir, file);
    return fs.mkdir(dirname(dst), { recursive: true })
      .then(() => {
        fs.copyFile(join(cwd, file), dst)
      });
  }))
}

export default dockerized