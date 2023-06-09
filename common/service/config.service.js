let BASE_URL = ''


if (process.env.NODE_ENV == 'development') {
    BASE_URL = 'http://127.0.0.1:30008/share-life' // 本地环境
    //BASE_URL = 'http://101.43.131.189:30008/share-life' // 开发环境
} else {
	BASE_URL = 'http://101.43.131.189:30008/share-life' // 现在生产环境也用这个
}

let staticDomainURL = BASE_URL + '/sys/common';
let fileUploadURL = BASE_URL + '/sys/common/upload';
let fileSaveURL = BASE_URL + '/sys/common/static/';

//访问 http://127.0.0.1:30008/share-life/sys/common/static/1_1673881728257.jpg
//访问 http://101.43.131.189:30008/share-life/sys/common/static/12_1685687068019.jpg
// yml中的 path：upload的 /opt/upFiles  是文件实际存放的目录
//前端调用的是 http://101.43.131.189:30008/share-life/sys/common/upload  接口
// 将图片上传后 图片存在 /opt/upFiles目录下，返回给前端的信息是 message:"1_1673881728257.jpg"
// 不论是前端访问还是直接访问图片都是在文件名前加 http://127.0.0.1:30008/share-life/sys/common/static/
//但是因为 BASE_URL 一般已经包含了  "/share-life"这一级，所以文件目录再加 "/sys/common/static/" 即可

// http://101.43.131.189:30008/share-life/sys/common/static/1_1673882232390.jpg 图片拼接示例

const configService = {
	apiUrl: BASE_URL,
	staticDomainURL: staticDomainURL,
	fileUploadURL: fileUploadURL,
	fileSaveURL: fileSaveURL
};

export default configService
