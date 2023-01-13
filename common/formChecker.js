/**
  数据验证（表单验证）
  校验不同的checkType 验证不通过设置对应的错误提示
*/
export default {
	error: '',
	check: function(data, rule) {
		for (var i = 0; i < rule.length; i++) {
			if (!rule[i].checkType) {return true;}
			if (!rule[i].name) {return true;}
			if (!rule[i].errorMsg) {return true;}
			if (!data[rule[i].name]) {this.error = rule[i].errorMsg; return false;}
			switch (rule[i].checkType) {
        case 'required':
          if (!data[rule[i].name]) {
            this.error = rule[i].errorMsg; return false;
          }
          break;
				case 'string':
					var reg = new RegExp('^.{' + rule[i].checkRule + '}$');
					if (!reg.test(data[rule[i].name])) {this.error = rule[i].errorMsg; return false;}
				break;
				case 'phone':
					var reg = /^1[0-9]{10,10}$/;
					if (!reg.test(data[rule[i].name])) { this.error = rule[i].errorMsg; return false; }
				break;
			}
		}
		return true;
	}
};