export default {
	data(){
		return{
			aaa:'hhh'
		}
	},
	methods:{
		showTextTip(type){
			uni.showToast({
				title:`${type}内容出现了违规词语,请重新输入!`,
				icon:'none'
			})
		}
	}
}