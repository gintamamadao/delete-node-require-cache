English | [简体中文](./README.zh-CN.md)

# delete-node-require-cache

[![NPM version](https://badgen.net/npm/v/delete-node-require-cache)](https://www.npmjs.com/package/delete-node-require-cache)
[![NPM Weekly Downloads](https://badgen.net/npm/dw/delete-node-require-cache)](https://www.npmjs.com/package/delete-node-require-cache)
[![License](https://badgen.net/npm/license/delete-node-require-cache)](https://www.npmjs.com/package/delete-node-require-cache)

> NodeJs loads js scripts file with a cache for performance reasons, but sometimes cache can be a problem when we need NodeJs to load new changes of the js file in real time, and this package will remove the cache of the specified js file, and also will parse the content of the file into the ast syntax tree, analyse the dependent js file inside and remove the relevant cache

```js
import { delRequireCache } from 'delete-node-require-cache'

delRequireCache(jsFilePath)
```
