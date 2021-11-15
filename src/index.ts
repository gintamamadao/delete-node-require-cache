import { resolve, dirname, extname } from 'path'
import fsUtil from 'ginlibs-file-util'
import validateNpm from 'validate-npm-package-name'
import recast from 'recast'

export const delRequireCache = async (rootFile: string) => {
  const getAllDependJS = (file: string) => {
    const jsFile =
      extname(file) === '.js' || extname(file) === '.jsx' ? file : `${file}.js`
    const result = [jsFile]
    const jsCont = fsUtil.read(jsFile)
    const jsAst = recast.parse(jsCont)
    recast.types.visit(jsAst, {
      visitCallExpression(path: any) {
        const calleeName = path?.value.callee?.name
        if (calleeName !== 'require') {
          return false
        }
        const arg = path.value?.arguments?.[0]?.value
        if (validateNpm(arg)?.validForNewPackages) {
          return false
        }
        const itJsFile = resolve(dirname(file), arg)

        Array.prototype.push.apply(result, getAllDependJS(itJsFile) || [])
        return false
      },
    })
    return result
  }

  const allDepJS = getAllDependJS(rootFile)

  for (const itJS of allDepJS) {
    delete require.cache[require.resolve(itJS)]
  }
}
