<template>
    <view>
        <home cur="home" :key="commponent1Key"></home>
        <!--		<information :cur="PageCur" v-if="PageCur == 'information'" :key="commponent3Key"></information>-->
        <!-- <member v-if="PageCur == 'member'" :key="commponent4Key"></member>
        <publish v-if="PageCur == 'publish'" :key="commponent4Key"></publish>
        <message v-if="PageCur == 'message'" :key="commponent4Key"></message> -->
        <bottomTab PageCur="home"></bottomTab>
    </view>
</template>

<script>

    import bottomTab from '../component/bottomTab.vue';
    export default {
      name: 'index', // 主页
        data() {
            return {
                commponent1Key: 0,
                commponent2Key: 0,
                commponent3Key: 0,
                commponent4Key: 0
            };
        },
        components: {
            bottomTab
        },
        onLoad: function() {
            ++this.commponent1Key;
            ++this.commponent2Key;
            ++this.commponent3Key;
            ++this.commponent4Key;
        }
    };
</script>

<style scoped>

</style>
