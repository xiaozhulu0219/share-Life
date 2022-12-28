let BASE_URL = ''


if (process.env.NODE_ENV == 'development') {
<<<<<<< HEAD
    //BASE_URL = 'http://127.0.0.1:7070/share-life' // 本地环境
    BASE_URL = 'http://43.142.29.190:8080/share-life' // 开发环境
} else {
	BASE_URL = 'http://43.142.29.190:8080/share-life' // 现在生产环境也用这个
=======
	BASE_URL = 'http://43.142.29.190:6060/share-life' // 开发环境
} else {
	BASE_URL = 'http://43.142.29.190:6060/share-life' // 现在生产环境也用这个
>>>>>>> bf684b0 (修改性别等)
}
// } else {
// 	BASE_URL = 'http://boot.jeecg.org:9090/jeecg-boot' // 生产环境
// }
let staticDomainURL = BASE_URL + '/sys/common/static';

const configService = {
	apiUrl: BASE_URL,
	staticDomainURL: staticDomainURL
};

export default configService
