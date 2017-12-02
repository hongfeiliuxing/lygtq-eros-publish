const fs = require('fs')
const Path = require('path')
module.exports = {
    BaseUploadPath: Path.join(__dirname, '../../../uploads'),
    /**
     * 同步创建文件目录
     * @param  {string} dirname 目录绝对地址
     * @return {boolean}        创建目录结果
     */
    mkdirsSync(dirname) {
        if (fs.existsSync(dirname)) {
            return true
        }
        if (this.mkdirsSync(Path.dirname(dirname))) {
            fs.mkdirSync(dirname)
            return true
        }
    },
    /**
     * 获取上传文件的后缀名
     * @param  {string} fileName 获取上传文件的后缀名
     * @return {string}          文件后缀名
     */
    getSuffixName(fileName) {
        const nameList = fileName.split('.')
        return nameList[nameList.length - 1]
    }
}