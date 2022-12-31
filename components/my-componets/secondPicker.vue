<template>
  <view class="cu-form-group">
    <view class="title">{{label}}</view>
    <picker mode="multiSelector" @change="PickerChange" @columnchange="pickerColumnChange"
      :value="multiIndex" :range="multiArray">
      <view class="picker">
        {{ multiIndex[0] > -1 ? multiArray[1][multiIndex[1]] : '请选择' }}
      </view>
    </picker>
  </view>
</template>

<script>
export default {
  name: 'secondPicker',
  props:{
    value: String,
		label: String,
  },
  watch:{
    // 职业id
    value: {
      handler(val){
        this.getJobIdByDictionary();
      },
      immediate: true
    }
  },
  data() {
    return {
      multiArray: [[],[]], // 职业级联选择器数组
      multiObject: [],      // 职业数组
      multiIndex: [-1,-1]
    }
  },
  methods: {
    // 根据二级id获取一级二级职业id, 设置选择器选中状态
    getFirstByChildId(){
      this.$http.get('/sys/category/queryByChildId',{params: {id:"1609113068629487618" }}).then(res => {
        if(res.data.success){
          const [firstId, secondId] = res.data.result;
          const firstIdx = this.multiObject.findIndex(item => item.id === firstId);
          const firstJobDetail = this.multiObject[firstIdx].children || [];
          let secondIdx = -1
          firstJobDetail.forEach((item,index) => {
            if(item.id === secondId){
              secondIdx = index;
            }
          });
          this.multiIndex[0] = firstIdx;
          this.multiIndex[1] = secondIdx;
          const detailArr = this.multiObject[secondIdx].children.map(item => item.name);
          this.multiArray.splice(this.multiArray.length - 1, 1, detailArr);
        }
      });
    },
    // 完成选择器选择事件
    PickerChange(e) {
      this.multiIndex = e.detail.value;
      // this.editJobInfo();
    },
    // 选择器列改变事件
    pickerColumnChange(e){
      this.multiIndex[e.detail.column] = e.detail.value;
      // 修改第0列，选择更详细的职业
      if(!e.detail.column){
        // 获取对应的二级职业
        const detailArr = this.multiObject[e.detail.value].children.map(item => item.name);
        this.multiArray.splice(this.multiArray.length - 1, 1, detailArr);
      }
    },
    // 发送请求修改职业信息
    editJobInfo(){
      this.$http.get('',{params: {}}).then(res => {

      });
    },
    // 根据id获取职业列表
    getJobListById(pid){
      this.$http.get('/sys/category/childList',{params: {pid}}).then(res => {
        if(res.data.success){
          // 设置职业选择器一级数组
          this.multiObject = res.data.result;
          const firstCategoryNames = res.data.result.map(item => item.name);
          this.multiArray.splice(0, 1, firstCategoryNames);
          this.multiObject.forEach((item, index) => this.getSecondJobById(item.id, index));
          // 职业回显
          this.getFirstByChildId(this.value);
        }
      });
    },
    //获取二级职业信息，将二级详细职业添加到对应一级职业children 属性
    getSecondJobById(pid, index){
      this.$http.get('/sys/category/childList',{params: { pid }}).then(res => {
        if(res.data.success){
          this.multiObject[index].children = res.data.result;
        }
      });
    },
    // 根据字典获取职业分类id
    getJobIdByDictionary(){
      this.$http.get('/sys/category/rootList').then(res => {
        if(res.data.success){
          const jobObj = res.data.result.records && res.data.result.records.find(item => item.name === '职业');
          const jobId = jobObj.id;
          this.getJobListById(jobId, true);
        }
      });
    }
  }
}
</script>

<style scoped>
uni-picker{
  text-align: right;
}
</style>
