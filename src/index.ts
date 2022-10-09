import { resolve, dirname, extname } from 'path'
import validateNpm from 'validate-npm-package-name'
import { existsSync, readFileSync } from 'fs-extra'
import crequire from 'crequire'

export const JSFileContentCacheMap: Record<string, any> = {}

const getJSFullPath = (filePath: string) => {
  const ext = extname(filePath)
  const jsFile = ext === '.js' ? filePath : `${filePath}.js`
  return jsFile
}

const getJSDepPath = (filePath: string) => {
  const ext = extname(filePath)
  return ext === '.js'
    ? filePath.slice(0, filePath.length - ext.length)
    : filePath
}

export const delRequireCache = (rootFile: string) => {
  const getAllDependJS = (filePath: string) => {
    if (!existsSync(filePath)) {
      return []
    }
    const jsFile = getJSFullPath(filePath)
    const jsCont = readFileSync(jsFile) + ''
    const result = [jsFile]

    const cacheInfo = JSFileContentCacheMap[jsFile] || {}

    if (cacheInfo.content === jsCont && Array.isArray(cacheInfo.depends)) {
      cacheInfo.depends.forEach((depIt) => {
        Array.prototype.push.apply(result, getAllDependJS(depIt) || [])
      })
      return result
    }

    const depends = crequire(jsCont)
    const dependFilePaths: string[] = []

    depends.forEach((it) => {
      const { path } = it || {}
      if (validateNpm(path)?.validForNewPackages || !path) {
        return
      }
      const itFile = getJSFullPath(resolve(dirname(jsFile), path))
      dependFilePaths.push(itFile)
      if (result.includes(itFile)) {
        return
      }
      Array.prototype.push.apply(result, getAllDependJS(itFile) || [])
    })

    const fileInfo = {
      content: jsCont,
      depends: dependFilePaths,
      deepDepends: result,
    }

    JSFileContentCacheMap[jsFile] = fileInfo
    return result
  }
  const allDepJS = getAllDependJS(rootFile)

  const delJSFiles: string[] = []
  for (const itJS of allDepJS) {
    const itJSDepPath = getJSDepPath(itJS)
    delete require.cache[require.resolve(itJSDepPath)]
    delJSFiles.push(itJSDepPath)
  }
  return delJSFiles
}
