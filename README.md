# egg-docx
## 安装

```bash
$ npm i egg-docx --save
# or
$ yarn add egg-docx
```

## 依赖说明

### 依赖的 egg 版本

egg 2.x | egg 1.x
--- | ---
😁 | ❌

### 依赖的插件

[docxtemplater](https://github.com/open-xml-templating/docxtemplater)

[docxtemplater-image-module-free](https://github.com/evilc0des/docxtemplater-image-module-free)

[pizzip](https://github.com/open-xml-templating/pizzip)

## 开启插件

```js
// {app_root}/config/plugin.js
exports.docx = {
  enable: true,
  package: 'egg-docx',
};
```

## 配置

```js
// {app_root}/config/config.default.js
config.docx = {

};
```
## License

[MIT](LICENSE)