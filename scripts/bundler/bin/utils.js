import stripComments from 'strip-comments';
export const windowsSlash = (path)=>{
    const isExtendedLengthPath = /^\\\\\?\\/.test(path);
    const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
    if (isExtendedLengthPath || hasNonAscii) {
        return path;
    }
    return path.replace(/\\/g, '/');
};
export function matchDynamicImportValue(importStatement) {
    const matched = stripComments(importStatement).match(/^\s*('([^']+)'|"([^"]+)")\s*$/m);
    return matched?.[2] || matched?.[3] || null;
}
export function isPathImport(spec) {
    return spec[0] === '.' || spec[0] === '/';
}
export const getImportSpecifierJsFile = (parsed)=>parsed.filter((imp)=>{
        if (!imp.n) {
            return false;
        }
        return isPathImport(imp.n) && /\.js$/.test(imp.n);
    });
