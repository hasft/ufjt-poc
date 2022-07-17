const fs = require('fs');
const path = require('path');

const dirPath = path.join(process.cwd(), '.changeset')
const changesets = fs.readdirSync(dirPath, 'utf-8');
console.log(changesets, 'changesets');
const mdFiles = changesets.filter(file => /^(?!README).*\.md$/.test(file));

console.log(mdFiles, '.md files');

Promise.all(mdFiles.map(file => {
  const loc = path.join(dirPath, file);
  return {
    str: fs.readFileSync(loc, 'utf-8'),
    loc
  }
})).then(res => {
  res.forEach(f => {
    const result = f.str.replace(/^"@ufjt-poc\/bot".*\n?/gm, '');

    if (/---\n---/.test(result)) {
      console.log(`FIX single changeset -> Removing ${f.loc}`);
      fs.unlinkSync(f.loc);
    } else {
      console.log(`FIX Updating ${f.loc}`);
      fs.writeFileSync(f.loc, result, { encoding: 'utf-8' })
    }
  })
}).catch(err => {
  console.error('error')
})