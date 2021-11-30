import { resolve, dirname, extname } from 'path'
import fsUtil from 'ginlibs-file-util'
import validateNpm from 'validate-npm-package-name'
import parser from '@babel/parser'
import traverse from '@babel/traverse'

export const delRequireCache = async (rootFile: string) => {
  const getAllDependJS = (filePath: string) => {
    const jsCont = fsUtil.read(filePath)
    const result = [
      filePath.slice(0, filePath.length - extname(filePath).length),
    ]
    const jsAst = parser.parse(jsCont, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    })
    traverse(jsAst, {
      ImportDeclaration(path) {
        const sourceVal = path?.node?.source?.value
        const itFile = resolve(dirname(filePath), sourceVal)
        if (validateNpm(sourceVal)?.validForNewPackages || !sourceVal) {
          return
        }
        Array.prototype.push.apply(result, getAllDependJS(itFile) || [])
      },
      VariableDeclarator(path: any) {
        traverse(
          path.node,
          {
            CallExpression(cPath: any) {
              const name = cPath?.node?.callee?.name
              if (name !== 'require') {
                return
              }
              traverse(
                cPath.node,
                {
                  StringLiteral(csPath: any) {
                    const csValue = csPath?.node?.value
                    const itFile = resolve(dirname(filePath), csValue)
                    if (csValue) {
                    }
                    if (validateNpm(csValue)?.validForNewPackages || !csValue) {
                      return
                    }
                    Array.prototype.push.apply(
                      result,
                      getAllDependJS(`${itFile}.js`) || []
                    )
                  },
                },
                cPath.scope,
                cPath.state,
                cPath.parentPath
              )
            },
          },
          path.scope,
          path.state,
          path.parentPath
        )
      },
    })
    return result
  }
  const allDepJS = getAllDependJS(rootFile)
  for (const itJS of allDepJS) {
    if (fsUtil.exist(`${itJS}.js`)) {
      // console.log(itJS, `del ${itJS} cache`)

      delete require.cache[require.resolve(itJS)]
    }
  }
}
