<template>
  <div>
    <div class="header-checkHistory-manager">
      <div style="color: white;padding-top: 2.5vh; padding-left:5vw;font-size:120%">预约历史
        <span style="color: white;float: right;padding-right: 2vw;" @click="initHistory">
          <Icon type="md-refresh"/>
        </span>
      </div>
    </div>
    <div class="card-checkHistory-manager">
      <van-list
        v-model="loading"   :finished="finished"
        finished-text="没有更多了"
        :error.sync="error" @load="finished=true"
        error-text="当前没有会议室历史预约记录"
      >
        <van-cell
          v-for="(item, index) in historyList"
          :key="item.id"
        >
          <div class="check-list-mobile-first">
            <span>{{item.building}}</span>
            <span class="check-list-mobile-first-name">{{item.conferenceName}}</span>
          </div>
          <div class="check-list-mobile-second">
            <span class="check-list-mobile-second-push" @click="toCheckInfo(index)">
              <van-icon name="arrow" />
            </span>
            <span>
              <span style="color: #BFBFBF">申请人：</span>
              <span style="color: #1B55A1">{{item.applicantName}}</span><br/>
              <span style="color: #BFBFBF">身份：</span>
              <span style="color: #1B55A1">{{item.identity}}</span><br/>
              <span style="color: #BFBFBF">预约时间：</span>
              <span style="color: #1B55A1">{{item.needdate + '    ' + item.begintime + '-' + item.endtime}}</span><br/>
              <span style="color: #BFBFBF">当前状态：</span>
              <span style="color: red" v-if="item.progress=='被驳回'">{{item.progress}}</span>
              <span style="color: #990000" v-else-if="item.progress=='预约过期'">{{item.progress}}</span>
              <span style="color: blue" v-else-if="item.progress=='已评价'">{{item.progress}}</span>
              <span style="color: green" v-else-if="item.progress=='通过审核'">已批准</span>
              <span style="color: grey" v-else>用户取消</span>
              <br/>
            </span>
          </div>
          <!--          <div class="check-list-mobile-third" style="margin-left: 30vw;margin-top: 0vh;position: relative">-->
          <!--            <span class="check-list-mobile-third-check">-->
          <!--              <van-button class="check-button-one" style="margin-right: 2vw" @click="agree_pop=true,approvalNum(index)">同意</van-button>-->
          <!--              <van-button class="check-button-two" @click="cancel_pop=true,cancelId=offerInfo[index].id">驳回</van-button>-->
          <!--            </span>-->
          <!--          </div>-->
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
      name: 'checkHistoryMobile',
      data(){
          return{
              historyList : [],
              loading: false,
              finished: false,
              error: false,
          }
      },
      mounted(){
          this.initHistory();
      },
      methods:{
          initHistory(){
              this.loading = true;
              this.finished = false;
              this.historyList = []
              axios({
                  url: apiRoot + '/manager/departmentHistory',
                  method: 'get'
              }).then(res => {
                  if(res.data.code === 200){
                      res.data.data.forEach(item => {
                          this.historyList.push(item)
                      })
                      this.loading = false;
                  }else{
                      this.$Message.error(res.data.message)
                      this.loading = false;
                  }
              }).catch(err => {
                  this.$Message.error("请检查网络连接！")
                  this.loading = false;
              })
          },
          toCheckInfo(index){
              // console.log(index)
              this.$router.push({
                  name: 'checkInfo',
                  params: {
                      id: this.historyList[index].id,
                      departmentName: this.historyList[index].departmentName,
                      fromManager: true,
                  }
              });
          }
      }
  }
</script>

<style scoped lang="scss">
  @import 'checkHistoryMobile';
</style>
