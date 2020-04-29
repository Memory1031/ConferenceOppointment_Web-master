<template>
  <div>
    <div class="header-avaInfo"  v-if="checkInfo">
      <div class="background-img">
        <span style="float:left; color: #D0DCEC; font-size: 180%; padding-top: 3vh" @click="goback">
          <van-icon name="arrow-left" />
        </span>
      </div>
      <div class="header-avaInfo-card">
        <div class="conference-info-mobile-first">
          <span>{{this.checkInfo.building}}</span>
          <span class="conference-list-mobile-first-name">{{this.checkInfo.conferenceName}}</span>
        </div>
        <div class="conference-info-mobile-second">
          <span style="display: inline-block; padding-bottom: 0.5vh">
            <Icon type="ios-home" />&nbsp&nbsp
            {{this.params.departmentName}}
          </span><br/>
          <span style="display: inline-block; padding-bottom: 0.5vh">
            <Icon type="ios-man" />&nbsp&nbsp
            {{this.checkInfo.applicantName.name + ' ' + this.checkInfo.applicantName.userId}}
          </span><br/>
          <span style="display: inline-block; padding-bottom: 0.5vh">
            <Icon type="md-calendar" />&nbsp&nbsp
            {{this.checkInfo.needdate + ' ' + this.checkInfo.begintime + '-' + this.checkInfo.endtime}}
          </span><br/>
          <span>
            <Icon type="ios-call-outline" />&nbsp&nbsp
            {{this.checkInfo.phone}}
          </span>
        </div>
      </div>
      <div class="chosentime-part">
        <div>
          <div class="title-chosentime-part">
            <span>申请理由</span>
          </div>
          <div class="changedate-chosentime-part">
            <span style="display: inline-block;margin-left: 5vw; font-weight: 500;margin-top: 0.4vh">{{this.checkInfo.requestreason}}</span>
          </div>
        </div>
        <div v-if="checkInfo.refusereason!=''">
          <div class="title-chosentime-part" style="margin-top: 2vh !important;">
            <span>驳回理由</span>
          </div>
          <div class="changedate-chosentime-part">
            <span style="display: inline-block;margin-left: 5vw; font-weight: 500;margin-top: 0.4vh">{{this.checkInfo.refusereason}}</span>
          </div>
        </div>
      </div>
      <hr style="margin-top: 2vh;margin-bottom: 1vh" color="#F8F8F8">
      <div style="color: #676767;font-size: 115%; margin-left: 5vw;
          font-weight: 550;">
        会议成员(第一位默认为申请人)
      </div>
      <div class="checkmembers">
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
                <span style="color: #BFBFBF">标签：</span>
                <span style="color: #1B55A1"  v-if="tagExist[index]">
                  <span style="display: inline-block; margin-left: 1vw; margin-right: 1vw; "
                        v-for=" tag in tags[index]" :key="tag.id">
                    <van-tag mark size="medium">
                      {{tag.tag}}
                    </van-tag>
                  </span>
                </span>
                <span v-else style="color: #1B55A1">暂无标签</span>
              </span>
            </div>
          </van-cell>
        </van-list>
      </div>
    </div>
    <div style="bottom: 0; width: 100vw; position: fixed" v-if="checkInfo.progress=='未审核'">
      <div v-if="fromManage">
        <van-row>
          <van-col span="12">
            <van-button style="width: 50vw;background-color: #FFC197"
                        @click="cancel_pop=true"><span style="color:white">驳回</span></van-button>
          </van-col>
          <van-col span="12">
            <van-button style="width: 50vw;background-color: #245BA4;"
                        @click="agree_pop=true,approvalNum()"><span style="color:white">同意</span></van-button>
          </van-col>
        </van-row>
      </div>
      <div v-else-if="!fromManage && isMe">
        <van-row>
          <van-col span="12">
            <van-button style="width: 50vw;background-color: grey"
                  @click="cancel_pop_user=true"><span style="color:white">取消</span></van-button>
          </van-col>
          <van-col span="12">
            <van-button style="width: 50vw;background-color: #245BA4;" @click="invite_pop=true"
                        ><span style="color:white">邀请</span></van-button>
          </van-col>
        </van-row>
      </div>
      <div v-else-if="!fromManage && !isMe">
        <van-row>
          <van-col span="24">
            <van-button style="width: 100vw;background-color: #245BA4;" @click="invite_pop=true"
            ><span style="color:white">邀请</span></van-button>
          </van-col>
        </van-row>
      </div>
    </div>
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
      <van-popup v-model="cancel_pop" style="width: 90vw;height: 300px;text-align:center;border-radius: 10px">
        <div style="font-size:130%;margin-top: 4vh;">驳回理由</div>
        <van-field v-model="refusereason" placeholder="请输入驳回理由（可不填写）" type="textarea" rows='4' style="width: 90%;margin-left: 5vw;background-color: #F2F2F2"/>
        <br/>
        <div class="footer">
          <van-button @click="cancel_pop=false" style="border-radius: 5px;margin-right: 4vw">取消</van-button>
          <van-button style="border-radius: 5px" type="danger" :loading="loading_cancel" @click="cancel">驳回</van-button>
        </div>
      </van-popup>
      <van-popup v-model="cancel_pop_user" style="width: 90vw;height: 300px;text-align:center;border-radius: 10px">
        <img src="../../../../assets/img/error.png" style='margin-top: 2vh;' width="100">
        <div style="font-size:150%;margin-top: 1vh;">友情提醒</div><br/>
        <div style="margin-left: 4vw; margin-right: 4vw">您确定要取消该预约申请么？</div>
        <br/>
        <div class="footer">
          <van-button style="border-radius: 5px" type="danger" :loading="loading_cancel_user" @click="cancel_user">确定取消</van-button>
        </div>
      </van-popup>
      <van-popup v-model="invite_pop" style="width: 90vw;height: 380px;text-align:center;border-radius: 10px"  v-if="config.href != ''">
        <div style="margin-top: 2vh">
<!--          <vue-qr :text="config.href" :logoSrc="config.imgSrc" :size="220"></vue-qr>-->
          <vue-qr :text="config.href" :size="220"></vue-qr>
        </div>
        <van-divider
          :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
        >
          {{this.checkInfo.conferenceName}}
        </van-divider>
        <div style="font-size: 130%;font-family: 宋体;margin-top: 3vh;color: black">
          <span v-if="checkInfo">{{this.checkInfo.applicantName.name}}邀请您加入会议</span>
        </div>
        <br/>
<!--        <div class="footer">-->
<!--          <van-button style="border-radius: 5px" type="danger" :loading="loading_invite" @click="cancel_user">确定取消</van-button>-->
<!--        </div>-->
      </van-popup>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    import vueQr from 'vue-qr'
    export default {
        name: 'checkInfo',
        components: {
            vueQr
        },
        data(){
            return{
                params: this.$route.params,
                loading: false,
                finished: false,
                error: false,
                checkInfo: '',
                members: [],
                tags: [[]],
                tagExist: [],
                agree_pop: false,
                cancel_pop: false,
                cancel_pop_user: false,
                invite_pop: false,
                loading_submit: false,
                loading_cancel: false,
                loading_cancel_user: false,
                refusereason: '',
                fromManage: this.$route.params.fromManager,
                isMe: true,
                hrefexist: false,
                config: {
                    href: '',
                    imgSrc: require("./../../../../assets/img/shu_logo.jpg")
                }
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            init() {
                this.loading = true;
                this.members = [];
                this.params = this.$route.params
                let href = document.location.protocol + "//" + document.location.host + "/mobile/invite/" + btoa(this.params.id)
                this.config.href = href
                if (this.params.id == undefined) {
                    this.$router.go(-1)
                    return
                }
                this.finished = false;
                axios({
                    url: apiRoot + '/user/appointmentDetail?id=' + this.params.id,
                    method: 'get'
                }).then((res) => {
                    if (res.data.code == 200) {
                        this.checkInfo = {
                            id: res.data.data.id,
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
                        if(res.data.data.applicantName.userId == localStorage.getItem("userid")) this.isMe = true
                        else this.isMe = false;
                        this.checkInfo = res.data.data
                        this.members.push({
                            userId: res.data.data.applicantName.userId,
                            name: res.data.data.applicantName.name,
                            departmentName: res.data.data.applicantName.departmentName,
                        });
                        this.getUserTag(0);
                        if (res.data.data.participants.length != 0) {
                            res.data.data.participants.forEach((item, index) => {
                                this.members.push({
                                    userId: item.userId,
                                    name: item.name,
                                    departmentName: item.departmentName
                                })
                                this.getUserTag(index + 1)
                            })
                        }
                        this.loading = false;
                    } else {
                        this.$Message.error(res.data.message)
                        this.loading = false;
                    }
                }).catch((err) => {
                    this.$Message.error("请检查网络连接！")
                    this.loading = false;
                })
            },
            getUserTag(index) {
                this.tags[index] = []
                axios({
                    url: apiRoot + '/user/usersTag?id=' + this.members[index].userId,
                    method: 'get'
                }).then((res) => {
                    if (res.data.code == 200) {
                        res.data.data.forEach((item, index2) => {
                            if(index2 < 3){
                                this.tags[index].push(item)
                            }
                        })
                        this.$set(this.tagExist, index, true)
                    } else {
                        this.$set(this.tagExist, index, false)
                    }
                }).catch(err => {
                    this.$Message.error("请检查网络连接！")
                    this.$set(this.tagExist, index, false)
                })
            },
            goback() {
                // console.log(this.tags)
                this.$router.go(-1)
            },
            approvalNum() {
                axios({
                    url: apiRoot + '/manager/approvalNum?id=' + this.params.id,
                    method: 'get'
                }).then(res => {
                    if (res.data.code == 200) {
                        this.$nextTick(() => {
                            document.querySelector('.approval-num').innerHTML = res.data.data.num
                        })
                    } else {
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
            submit() {
                this.loading_submit = true;
                axios({
                    url: apiRoot + '/manager/approval',
                    method: 'post',
                    data: {
                        id: this.params.id,
                        isPass: true,
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.loading_submit = false;
                        this.agree_pop = false;
                        this.$router.push('/mobile/managerMobile/checkAvaMobile');
                        this.$Message.success("批准成功！")
                    } else {
                        this.$Message.error(res.data.message)
                        this.loading_submit = false;
                    }
                }).catch(err => {
                    this.$Message.error("请检查网络连接！")
                    this.loading_submit = false;
                })
            },
            cancel() {
                this.loading_cancel = true;
                axios({
                    url: apiRoot + '/manager/approval',
                    method: 'post',
                    data: {
                        id: this.params.id,
                        isPass: false,
                        refusereason: this.refusereason
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.loading_cancel = false;
                        this.cancel_pop = false;
                        this.$router.push('/mobile/managerMobile/checkAvaMobile');
                        this.$Message.success("驳回成功！")

                    } else {
                        this.$Message.error(res.data.message)
                        this.loading_cancel = false;
                    }
                }).catch(err => {
                    this.$Message.error("请检查网络连接！")
                    this.loading_cancel = false;
                })
            },
            cancel_user(){
                this.loading_cancel_user = true;
                axios({
                    url: apiRoot + '/user/cancelAppointment?id=' + this.params.id,
                    method: 'get'
                }).then(res => {
                    if (res.data.code == 200) {
                        this.loading_cancel_user = false;
                        this.cancel_pop_user = false;
                        // this.$router.push('/mobile/managerMobile/checkAvaMobile');
                        this.$Message.success("成功取消该预约！")
                        this.init();
                    } else {
                        this.$Message.error(res.data.message)
                        this.loading_cancel_user = false;
                    }
                }).catch(err => {
                    this.$Message.error("请检查网络连接！")
                    this.loading_cancel_user = false;
                })
            },
        }
    }
</script>

<style scoped lang="scss">
  @import "checkInfo";
</style>
