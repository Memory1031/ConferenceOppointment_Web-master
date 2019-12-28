<template>
  <div>
    <div class="header-check-manager">
      <div style="color: white;padding-top: 2.5vh; padding-left:5vw;font-size:120%">预约审批
        <span style="color: white;float: right;padding-right: 2vw;" @click="initOffer">
        <Icon type="md-refresh" />
      </span></div>
    </div>
    <div class="card-check-manager">
      <van-list
        v-model="loading"   :finished="finished"
        finished-text="没有更多了"
        :error.sync="error" @load="finished=true"
        error-text="当前没有会议室预约申请"
      >
        <van-cell
          v-for="(item, index) in offerInfo"
          :key="item.id"
        >
          <div class="check-list-mobile-first">
            <span>{{item.building}}</span>
            <span class="check-list-mobile-first-name">{{item.conferenceName}}</span>
          </div>
          <div class="check-list-mobile-second">
            <span>
              <span style="color: #BFBFBF">申请人：</span>
              <span style="color: #1B55A1">{{item.applicantName}}</span><br/>
              <span style="color: #BFBFBF">会议人数：</span>
              <span style="color: #1B55A1">{{item.participateNum}}</span><br/>
              <span style="color: #BFBFBF">预约时间：</span>
              <span style="color: #1B55A1">{{item.needdate + '    ' + item.begintime + '-' + item.endtime}}</span><br/>
              <span style="color: #BFBFBF">申请理由：</span>
              <span style="color: #1B55A1">{{item.requestreason}}</span>
            </span>
          </div>
          <div class="check-list-mobile-third" style="margin-left: 30vw">
            <span class="check-list-mobile-third-check">
              <span class="check-button-one" style="margin-right: 2vw" @click="agree_pop=true,approvalNum(index)">同意</span>
              <span class="check-button-two" @click="cancel_pop=true,cancelId=offerInfo[index].id">驳回</span>
            </span>
          </div>
        </van-cell>
      </van-list>
      <div class="check-manager-modal">
        <van-popup v-model="agree_pop" style="width: 90vw;height: 300px;text-align:center;border-radius: 10px">
          <img src="../../../../assets/img/error.png" style='margin-top: 2vh;' width="100">
          <div style="font-size:150%;margin-top: 1vh;">友情提醒</div><br/>
          <div style="margin-left: 4vw; margin-right: 4vw">有&nbsp<span class="approval-num"></span>&nbsp人同时申请，批准该申请将自动驳回其他请求</div>
          <br/>
          <div class="footer">
            <van-button @click="agree_pop=false" style="border-radius: 5px;margin-right: 4vw">取消</van-button>
            <van-button style="border-radius: 5px" type="primary" :loading="loading_submit" @click="submit">批准</van-button>
          </div>
        </van-popup>
        <van-popup v-model="cancel_pop" style="width: 90vw;height: 500px;text-align:center;border-radius: 10px">
          <div style="font-size:130%;margin-top: 4vh;">驳回理由</div>
          <van-field v-model="refusereason" placeholder="请输入驳回理由（可不填写）" type="textarea" rows='8' style="width: 90%;margin-left: 5vw;"/>
          <br/>
          <div class="footer">
            <van-button @click="cancel_pop=false" style="border-radius: 5px;margin-right: 4vw">取消</van-button>
            <van-button style="border-radius: 5px" type="danger" :loading="loading_cancel" @click="cancel">驳回</van-button>
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
      name: 'checkAvaMobile',
      data(){
          return{
              loading: false,
              loading_submit: false,
              loading_cancel: false,
              error: false,
              finished: false,
              offerInfo: [],
              agree_pop: false,
              cancel_pop: false,
              agreeId: 0,
              cancelId: 0,
              refusereason: ''
          }
      },
      mounted(){
          this.initOffer();
      },
      methods:{
          initOffer(){
              this.loading = true;
              this.finished = false;
              this.offerInfo = [];
              axios({
                  url: apiRoot + '/manager/appointmentList',
                  method: 'get'
              }).then((res) => {
                  if(res.data.code == 200){
                      res.data.data.forEach((item) => {
                          this.offerInfo.push(item);
                      })
                      this.loading = false;
                  }else{
                      this.$Message.error(res.data.message)
                      this.loading =false;
                  }
              }).catch(err => {
                  this.$Message.error("请检查网络连接！")
                  this.loading = false
              })
          },
          approvalNum(index){  //冲突计数
              this.agreeId = this.offerInfo[index].id
              axios({
                  url: apiRoot + '/manager/approvalNum?id=' + this.offerInfo[index].id,
                  method: 'get'
              }).then(res => {
                  if(res.data.code == 200){
                      this.$nextTick(() => {
                          document.querySelector('.approval-num').innerHTML = res.data.data.num
                      })
                  }else{
                      this.$Message.error(res.data.message)
                      this.$nextTick(() => {
                          document.querySelector('.approval-num').innerHTML = 0
                      })
                  }
              }).catch(err => {
                  this.$Message.error("请检查网络连接！");
                  this.$nextTick(() => {
                      document.querySelector('.approval-num').innerHTML = 0
                  })
              })
          },
          submit(){
              this.loading_submit = true;
              axios({
                  url: apiRoot + '/manager/approval',
                  method: 'post',
                  data: {
                      id: this.agreeId,
                      isPass: true,
                  }
              }).then(res => {
                  if(res.data.code == 200){
                      this.$Message.success("批准成功！")
                      this.initOffer();
                      this.loading_submit = false;
                      this.agree_pop  = false;
                  }else{
                      this.$Message.error(res.data.message)
                      this.loading_submit = false;
                  }
              }).catch(err => {
                  this.$Message.error("请检查网络连接！")
                  this.loading_submit = false;
              })
          },
          cancel(){
              this.loading_cancel = true;
              axios({
                  url: apiRoot + '/manager/approval',
                  method: 'post',
                  data: {
                      id: this.cancelId,
                      isPass: false,
                      refusereason: this.refusereason
                  }
              }).then(res => {
                  if(res.data.code == 200){
                      this.$Message.success("驳回成功！")
                      this.initOffer();
                      this.loading_cancel = false;
                      this.cancel_pop  = false;
                  }else{
                      this.$Message.error(res.data.message)
                      this.loading_cancel = false;
                  }
              }).catch(err => {
                  this.$Message.error("请检查网络连接！")
                  this.loading_cancel = false;
              })
          }
      }
  }
</script>

<style scoped lang="scss">
  @import 'checkAvaMobile';
</style>
