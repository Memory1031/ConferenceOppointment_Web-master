<template>
  <div>
    <div class="header-checkHistory-manager">
      <div style="color: white;padding-top: 2.5vh; padding-left:5vw;font-size:120%">预约历史
        <span style="color: white;float: right;padding-right: 2vw;" @click="initHistory">
          <Icon type="md-refresh"/>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
      name: 'checkHistoryMobile',
      data(){
          return{
              historyList : []
          }
      },
      mounted(){

      },
      methods:{
          initHistory(){
              this.historyList = []
              axios({
                  url: apiRoot + '/manager/departmentHistory',
                  method: 'get'
              }).then(res => {
                  if(res.data.code === 200){
                      res.data.data.forEach(item => {
                          this.historyList.push(item)
                      })
                  }else{
                      this.$Message.error(res.data.message)
                  }
              }).catch(err => {
                  this.$Message.error("请检查网络连接！")
              })
          }
      }
  }
</script>

<style scoped lang="scss">
  @import 'checkHistoryMobile';
</style>
