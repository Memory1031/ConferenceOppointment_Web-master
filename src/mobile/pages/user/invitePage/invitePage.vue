<template>
  <div>
    <div class="header-invitePage" v-if="checkInfo">
      <div class="background-img">
      </div>
      <div class="header-avaInfo-card">
        <div class="conference-info-mobile-first">
          <span>{{this.checkInfo.building}}</span>
          <span class="conference-list-mobile-first-name">{{this.checkInfo.conferenceName}}</span>
        </div>
        <div class="conference-info-mobile-second">
          <span style="display: inline-block; padding-bottom: 0.5vh">
            <Icon type="ios-home" />&nbsp&nbsp
            {{this.checkInfo.applicantName.departmentName}}
          </span><br/>
          <span style="display: inline-block; padding-bottom: 0.5vh">
            <Icon type="ios-man" />&nbsp&nbsp
            {{this.checkInfo.applicantName.name + ' ' + this.checkInfo.applicantName.userId}}
          </span><br/>
<!--          <span style="display: inline-block; padding-bottom: 0.5vh">-->
<!--            <Icon type="md-calendar" />&nbsp&nbsp-->
<!--            {{this.checkInfo.needdate + ' ' + this.checkInfo.begintime + '-' + this.checkInfo.endtime}}-->
<!--          </span><br/>-->
          <span>
            <Icon type="ios-call-outline" />&nbsp&nbsp
            {{this.checkInfo.phone}}
          </span>
        </div>
      </div>
      <div class="chosentime-part">
        <div>
          <div class="title-chosentime-part1">
            <span>会议时间：</span>
          </div>
          <div class="changedate-chosentime-part1">
            <span style="display: inline-block;margin-left: 5vw; font-weight: 500;margin-top: 0.4vh">{{this.checkInfo.needdate + ' ' + this.checkInfo.begintime + '-' + this.checkInfo.endtime}}</span>
          </div>
          <div class="title-chosentime-part2">
            <span>申请理由：</span>
          </div>
          <div class="changedate-chosentime-part2">
            <span style="display: inline-block;margin-left: 5vw; font-weight: 500;margin-top: 0.4vh">{{this.checkInfo.requestreason}}</span>
          </div>
        </div>
      </div>
      <hr style="margin-top: 2vh;margin-bottom: 1vh" color="#F8F8F8">
      <div style="color: #676767;font-size: 115%; margin-left: 5vw;
          font-weight: 550;">
        参会成员(第一位默认为申请人)：
      </div>
      <div class="invitemembers">
        <van-list
          v-model="loading"   :finished="finished"
          finished-text="没有更多了"
          :error.sync="error" @load="finished=true"
          error-text="当前申请没有参与者"
        >
          <van-cell
            v-for="(item, index) in members"
            :key="item.userId"
          >
            <div class="check-list-mobile-first">
              <span>{{item.name}}</span>
            </div>
            <div class="check-list-mobile-second">
              <span>
                <span style="color: #BFBFBF">学/工号：</span>
                <span style="color: #1B55A1">{{item.userId}}</span><br/>
                <span style="color: #BFBFBF">部门：</span>
                <span style="color: #1B55A1">{{item.departmentName}}</span><br/>
              </span>
            </div>
          </van-cell>
        </van-list>
      </div>
    </div>
    <div style="bottom: 0; width: 100vw; position: fixed" v-if="checkInfo.progress=='未审核'">
      <van-row>
        <van-col span="24">
          <van-button style="width: 100vw;background-color: #245BA4;" :loading="attend"
                      @click="attendTheConference"><span style="color:white">参与会议</span></van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
    export default {
        name: "invitePage",
        data(){
            return{
                id: '',
                checkInfo: '',
                members: [],
                loading: false,
                finished: false,
                error: false,
                attend_pop: false,
                attend: false
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            init(){
                this.members = [];
                this.loading = true;
                //btoa("190")
                this.id = this.$route.params.id
                axios({
                    url: apiRoot + '/user/appointmentDetail?id=' + atob(this.id),
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        this.checkInfo = {
                            campus: res.data.data.campus,
                            building: res.data.data.building,
                            departmentName: res.data.data.departmentName,
                            conferenceName: res.data.data.conferenceName,
                            needdate: res.data.data.needdate,
                            isweekend: res.data.data.isweekend,
                            begintime: res.data.data.begintime,
                            endtime: res.data.data.endtime,
                            requestreason: res.data.data.requestreason,
                            phone: res.data.data.phone,
                            handler: res.data.data.handler,
                            refusereason: res.data.data.refusereason,
                            progress: res.data.data.progress,
                        }
                        this.checkInfo = res.data.data
                        this.members.push({
                            userId: res.data.data.applicantName.userId,
                            name: res.data.data.applicantName.name,
                            departmentName: res.data.data.applicantName.departmentName,
                        });
                        res.data.data.participants.forEach(item => {
                            this.members.push(item)
                        })
                        this.loading = false;
                    }else{
                        this.$Message.error(res.data.message)
                        this.loading = false;
                    }
                    // console.log(this.checkInfo)
                }).catch(err => {
                    this.$Message.error("请检查网络连接！")
                })
            },
            attendTheConference(){
                this.attend = true;
                axios({
                    url: apiRoot + '/user/invitation?id=' + this.id,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        this.$router.push("/mobile/userMobile/myHistoryMobile")
                        this.$Message.success("成功参与该会议！")
                        this.attend = false
                    }else{
                        this.$Message.error(res.data.message)
                        this.attend = false
                    }
                }).catch(err=> {
                    this.$Message.error("请检查网络连接！")
                    this.attend = false
                })
            }
        }
    }
</script>

<style scoped lang="scss">
  @import "invitePage";
</style>
