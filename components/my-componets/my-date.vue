<template>
	<view class="cu-form-group" @click="timeChange">
		<view class="title"><text class="text-red" v-if="required">*</text>{{label}}</view>
		<input
		:placeholder="placeholder"
		name="input"
		v-model="selected"
		disabled="true"
		/>
		<w-picker :visible.sync="visible"
			ref="picker" mode="date"
			:value="value" :fields="fields"
      @confirm="onConfirm($event,'date')"></w-picker>
	</view>
</template>

<script>
export default {
	name: 'AppSecelt',
	props: {
    placeholder: {
      type: String,
      default: '请选择',
      required: false
    },
  label: {
    type: String,
    default: '',
    required: false
   },
	fields: {
    type: String,
    default: 'second',
    required: false
	},
  value: {
    type: String,
    required: false
  },
	required: {
    type: Boolean,
    default: false,
    required: false
  }
  },
  data() {
     return {
         visible: false,
         selected: ''
     };
  },
  watch: {
    value: {
        immediate: true,
        handler(val) {
          this.selected = !val ? '' : val;
      }
    }
  },
  methods: {
		timeChange() {
			this.$refs.picker.show();
		},
    onConfirm(e) {
			const backString = e.value;
			this.selected = e.value;
      this.$emit('input', backString);
    }
  },
  model: {
   prop: 'value',
   event: 'input'
  }
};
</script>

<style scoped>
input{
  text-align: right;
}
</style>
