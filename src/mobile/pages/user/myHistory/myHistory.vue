<template>
    <div>
      <div class="header-myHistory-user">
        <div style="color: white;padding-top: 2.5vh; padding-left:5vw;font-size:120%">我的预约
          <span style="color: white;float: right;padding-right: 2vw;" @click="initHistory">
            <Icon type="md-refresh" />
          </span>
        </div>
      </div>
      <div>
        <van-tabs v-model="active" animated="true" color="#054AA0" sticky="true">
          <van-tab title="预约中">内容 1</van-tab>
          <van-tab title="已批准">内容 2</van-tab>
          <van-tab title="已驳回">内容 3</van-tab>
          <van-tab title="全部申请">内容 4</van-tab>
        </van-tabs>
      </div>
    </div>
</template>

<script>
  import axios from 'axios'
    export default {
        name: "myHistory",
        data(){
            return{
                active: 2,
                ing: [],
                pass: [],
                reject: [],
                all: []
            }
        },
        mounted(){

        },
        methods: {
            initHistory(){
                axios({
                    url: apiRoot + '/user/myAppointment',
                    method: 'get'
                }).then(res => {
                    console.log(res.data.data)
                    if(res.data.code == 200){
                        res.data.data.forEach(item => {

                        })
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
  @import "myHistory";
</style>
