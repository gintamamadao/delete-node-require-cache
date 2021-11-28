import { resolve, dirname, extname } from 'path'
import fsUtil from 'ginlibs-file-util'
import validateNpm from 'validate-npm-package-name'
import parser from '@babel/parser'

export const delRequireCache = async (rootFile: string) => {
  const getAllDependJS = (file: string) => {
    const jsFile =
      extname(file) === '.js' || extname(file) === '.jsx' ? file : `${file}.js`
    const result = [jsFile]
    const jsCont = fsUtil.read(jsFile)
    const jsAst = parser.parse(jsCont)
    console.log(jsAst, 'jsAst89078')
    return result
  }
  getAllDependJS(rootFile)
  // const allDepJS = getAllDependJS(rootFile)

  // for (const itJS of allDepJS) {
  //   delete require.cache[require.resolve(itJS)]
  // }
}
