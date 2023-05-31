let BASE_URL = ''


if (process.env.NODE_ENV == 'development') {
    BASE_URL = 'http://127.0.0.1:30008/share-life' // 本地环境
    //BASE_URL = 'http://101.43.131.189:30008/share-life' // 开发环境
} else {
	BASE_URL = 'http://101.43.131.189:30008/share-life' // 现在生产环境也用这个
}

let staticDomainURL = BASE_URL + '/sys/common';
// http://101.43.131.189:30008/share-life/sys/common/static/1_1673882232390.jpg 图片拼接示例
const configService = {
	apiUrl: BASE_URL,
	staticDomainURL: staticDomainURL
};

export default configService
