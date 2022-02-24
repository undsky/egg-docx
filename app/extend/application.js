/*
 * @Author: 姜彦汐
 * @Date: 2021-08-23 15:45:52
 * @LastEditors: 姜彦汐
 * @LastEditTime: 2021-12-17 09:26:08
 * @Description: docx/pptx 模板生成
 * @占位符:
 * 
 * 图片 {%image} https://github.com/evilc0des/docxtemplater-image-module-free#usage
 * 文本 {tag} https://docxtemplater.com/demo/#simple
 * 条件 {#users.length > 3}...{/} https://docxtemplater.com/demo/#conditions
 * xml {@complexXml} https://docxtemplater.com/demo/#xml-insertion
 * 循环 {#users}...{/users} https://docxtemplater.com/demo/#loops
 * 在表格中循环 {#clients}...{/clients} https://docxtemplater.com/demo/#loop-table
 * 循环列表 {-w:p os}...{/os} https://docxtemplater.com/demo/#loop-list
 * 
 * @Site: https://www.undsky.com
 */
const fs = require('fs')
const Docxtemplater = require('docxtemplater')
const DocxtemplaterImageModule = require('docxtemplater-image-module-free')
const PizZip = require('pizzip')
const path = require('path')


const DOCX = Symbol('office#docx')

module.exports = {
    get docx() {
        if (!this[DOCX]) {
            /**
             * 获取文本内容
             *
             * @param {*} docxFile 文档文件
             * @returns
             */
            function getText(docxFile) {
                const doc = _init(docxFile)
                return doc.getFullText()
            }

            /**
             * 模板
             * 
             * @param {*} docxFile 文档文件
             * @param {*} data 数据，图片放在 data.images 属性下，path：图片路径；size：图片尺寸，如不指定取原图尺寸
             * @param {*} output 输出地址
             * @param {*} type 文档类型，默认 docx
             */
            async function template(docxFile, data, output, type) {
                let options = {
                    modules: []
                }

                if (data.images) {
                    for (const [k, v] of _.entries(data.images)) {
                        data[k] = v.path
                    }
                    let imgOptions = {}
                    imgOptions.centered = false;
                    imgOptions.fileType = type || "docx";
                    imgOptions.getImage = function (tagValue, tagName) {
                        return fs.readFileSync(tagValue);
                    }
                    imgOptions.getSize = function (image, tagValue, tagName) {
                        let size = data.images[tagName].size
                        if (!size) {
                            return new Promise((resolve, reject) => {
                                img.metadata(image)
                                    .then(metadata => resolve([metadata.width, metadata.height]))
                                    .catch(error => reject(error))
                            })
                        }
                        return size
                    }
                    let imageModule = new DocxtemplaterImageModule(imgOptions);
                    options.modules.push(imageModule)
                }
                var doc = _init(docxFile, options).compile()
                await doc.resolveData(data)
                doc.render()
                const buf = doc.getZip()
                    .generate({
                        type: 'nodebuffer'
                    })
                fs.writeFileSync(output, buf)
            }

            this[DOCX] = {
                getText,
                template
            }
        }
        return this[DOCX]
    }
}

function _init(docxFile, options) {
    if (_isDocx(docxFile) || _isPptx(docxFile)) {
        const content = fs.readFileSync(docxFile, 'binary')
        const zip = new PizZip(content)
        return new Docxtemplater(zip, options)
    }
    throw new Error('only support docx or pptx file')
}

function _isDocx(docxFile) {
    return '.docx' == path.extname(docxFile)
}

function _isPptx(pptxFile) {
    return '.pptx' == path.extname(pptxFile)
}