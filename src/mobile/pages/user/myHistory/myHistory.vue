<template>
    <div>
      <div class="header-myHistory-user">
        <div style="color: white;padding-top: 4vh; padding-left:5vw;font-size:120%">我的预约
          <span style="color: white;float: right;padding-right: 2vw;" @click="initHistory">
            <Icon type="md-refresh" />
          </span>
        </div>
      </div>
      <div>
        <van-tabs v-model="active" color="#054AA0" :sticky="true">
          <van-tab title="申请中">
            <div class="card-myHistory-user">
              <div style="text-align: center;color: #245BA4; font-size: 90%; font-weight: 550;">
                <span>
                  共有
                  <span class="history-all-number">{{this.ing.length}}</span>
                  条申请中的会议室预约记录
                </span>
              </div>
              <van-list
                v-model="loading"   :finished="finished"
                finished-text="没有更多了"
                :error.sync="error" @load="finished=true"
                error-text="当前没有会议室历史预约记录"
              >
                <van-cell
                  v-for="(item, index) in ing"
                  :key="item.id"
                >
                  <div class="check-list-mobile-first">
                    <span>{{item.building}}</span>
                    <span class="check-list-mobile-first-name">{{item.conferenceName}}</span>
                  </div>
                  <div class="check-list-mobile-second">
                    <span class="check-list-mobile-second-push" @click="toCheckInfo(index, ing)">
                      <van-icon name="arrow" />
                    </span>
                    <span>
                      <span style="color: #BFBFBF">申请人：</span>
                      <span style="color: #1B55A1">{{item.applicantName}}</span><br/>
                      <span style="color: #BFBFBF">参会人数：</span>
                      <span style="color: #1B55A1">{{item.attendNum}}</span><br/>
                      <span style="color: #BFBFBF">预约时间：</span>
                      <span style="color: #1B55A1">{{item.needdate + '    ' + item.begintime + '-' + item.endtime}}</span><br/>
                      <span style="color: #BFBFBF">当前状态：</span>
                      <span style="color: red" v-if="item.progress=='被驳回'">{{item.progress}}</span>
                      <span style="color: #990000" v-else-if="item.progress=='预约过期'">{{item.progress}}</span>
                      <span style="color: blue" v-else-if="item.progress=='已评价'">{{item.progress}}</span>
                      <span style="color: green" v-else-if="item.progress=='通过审核'">已批准</span>
                      <span style="color: #e64722" v-else-if="item.progress=='未审核'"><Icon type="ios-time-outline" />&nbsp&nbsp申请中</span>
                      <span style="color: grey" v-else>用户取消</span>
                      <br/>
                    </span>
                  </div>
                </van-cell>
              </van-list>
            </div>
          </van-tab>
          <van-tab title="已批准">
            <div class="card-myHistory-user">
              <div style="text-align: center;color: #245BA4; font-size: 90%; font-weight: 550;">
                <span>
                  共有
                  <span class="history-all-number">{{this.pass.length}}</span>
                  条通过审核的会议室预约记录
                </span>
              </div>
              <van-list
                v-model="loading"   :finished="finished"
                finished-text="没有更多了"
                :error.sync="error" @load="finished=true"
                error-text="当前没有会议室历史预约记录"
              >
                <van-cell
                  v-for="(item, index) in pass"
                  :key="item.id"
                >
                  <div class="check-list-mobile-first">
                    <span>{{item.building}}</span>
                    <span class="check-list-mobile-first-name">{{item.conferenceName}}</span>
                  </div>
                  <div class="check-list-mobile-second">
                    <span class="check-list-mobile-second-push" @click="toCheckInfo(index, pass)">
                      <van-icon name="arrow" />
                    </span>
                    <span>
                      <span style="color: #BFBFBF">申请人：</span>
                      <span style="color: #1B55A1">{{item.applicantName}}</span><br/>
                      <span style="color: #BFBFBF">参会人数：</span>
                      <span style="color: #1B55A1">{{item.attendNum}}</span><br/>
                      <span style="color: #BFBFBF">预约时间：</span>
                      <span style="color: #1B55A1">{{item.needdate + '    ' + item.begintime + '-' + item.endtime}}</span><br/>
                      <span style="color: #BFBFBF">当前状态：</span>
                      <span style="color: red" v-if="item.progress=='被驳回'">{{item.progress}}</span>
                      <span style="color: #990000" v-else-if="item.progress=='预约过期'">{{item.progress}}</span>
                      <span style="color: blue" v-else-if="item.progress=='已评价'">{{item.progress}}</span>
                      <span style="color: green" v-else-if="item.progress=='通过审核'">已批准</span>
                      <span style="color: #e64722" v-else-if="item.progress=='未审核'"><Icon type="ios-time-outline" />&nbsp&nbsp申请中</span>
                      <span style="color: grey" v-else>用户取消</span>
                      <br/>
                    </span>
                  </div>
                </van-cell>
              </van-list>
            </div>
          </van-tab>
          <van-tab title="已驳回">
            <div class="card-myHistory-user">
              <div style="text-align: center;color: #245BA4; font-size: 90%; font-weight: 550;">
                <span>
                  共有
                  <span class="history-all-number">{{this.reject.length}}</span>
                  条被驳回的会议室预约记录
                </span>
              </div>
              <van-list
                v-model="loading"   :finished="finished"
                finished-text="没有更多了"
                :error.sync="error" @load="finished=true"
                error-text="当前没有会议室历史预约记录"
              >
                <van-cell
                  v-for="(item, index) in reject"
                  :key="item.id"
                >
                  <div class="check-list-mobile-first">
                    <span>{{item.building}}</span>
                    <span class="check-list-mobile-first-name">{{item.conferenceName}}</span>
                  </div>
                  <div class="check-list-mobile-second">
                    <span class="check-list-mobile-second-push" @click="toCheckInfo(index, reject)">
                      <van-icon name="arrow" />
                    </span>
                    <span>
                      <span style="color: #BFBFBF">申请人：</span>
                      <span style="color: #1B55A1">{{item.applicantName}}</span><br/>
                      <span style="color: #BFBFBF">参会人数：</span>
                      <span style="color: #1B55A1">{{item.attendNum}}</span><br/>
                      <span style="color: #BFBFBF">预约时间：</span>
                      <span style="color: #1B55A1">{{item.needdate + '    ' + item.begintime + '-' + item.endtime}}</span><br/>
                      <span style="color: #BFBFBF">当前状态：</span>
                      <span style="color: red" v-if="item.progress=='被驳回'">{{item.progress}}</span>
                      <span style="color: #990000" v-else-if="item.progress=='预约过期'">{{item.progress}}</span>
                      <span style="color: blue" v-else-if="item.progress=='已评价'">{{item.progress}}</span>
                      <span style="color: green" v-else-if="item.progress=='通过审核'">已批准</span>
                      <span style="color: #e64722" v-else-if="item.progress=='未审核'"><Icon type="ios-time-outline" />&nbsp&nbsp申请中</span>
                      <span style="color: grey" v-else>用户取消</span>
                      <br/>
                    </span>
                  </div>
                </van-cell>
              </van-list>
            </div>
          </van-tab>
          <van-tab title="全部申请">
            <div class="card-myHistory-user">
              <div style="text-align: center;color: #245BA4; font-size: 90%; font-weight: 550;">
                <span>
                  共有
                  <span class="history-all-number">{{this.all.length}}</span>
                  条会议室预约记录
                </span>
              </div>
              <van-list
                v-model="loading"   :finished="finished"
                finished-text="没有更多了"
                :error.sync="error" @load="finished=true"
                error-text="当前没有会议室历史预约记录"
              >
                <van-cell
                  v-for="(item, index) in all"
                  :key="item.id"
                >
                  <div class="check-list-mobile-first">
                    <span>{{item.building}}</span>
                    <span class="check-list-mobile-first-name">{{item.conferenceName}}</span>
                  </div>
                  <div class="check-list-mobile-second">
                    <span class="check-list-mobile-second-push" @click="toCheckInfo(index, all)">
                      <van-icon name="arrow" />
                    </span>
                    <span>
                      <span style="color: #BFBFBF">申请人：</span>
                      <span style="color: #1B55A1">{{item.applicantName}}</span><br/>
                      <span style="color: #BFBFBF">参会人数：</span>
                      <span style="color: #1B55A1">{{item.attendNum}}</span><br/>
                      <span style="color: #BFBFBF">预约时间：</span>
                      <span style="color: #1B55A1">{{item.needdate + '    ' + item.begintime + '-' + item.endtime}}</span><br/>
                      <span style="color: #BFBFBF">当前状态：</span>
                      <span style="color: red" v-if="item.progress=='被驳回'">{{item.progress}}</span>
                      <span style="color: #990000" v-else-if="item.progress=='预约过期'">{{item.progress}}</span>
                      <span style="color: blue" v-else-if="item.progress=='已评价'">{{item.progress}}</span>
                      <span style="color: green" v-else-if="item.progress=='通过审核'">已批准</span>
                      <span style="color: #e64722" v-else-if="item.progress=='未审核'"><Icon type="ios-time-outline" />&nbsp&nbsp申请中</span>
                      <span style="color: grey" v-else>用户取消</span>
                      <br/>
                    </span>
                  </div>
                </van-cell>
              </van-list>
            </div>
          </van-tab>
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
                active: 0,
                loading: false,
                finished: false,
                error: false,
                ing: [],
                pass: [],
                reject: [],
                all: [],
                allLength: 0,
            }
        },
        mounted(){
            this.initHistory()
        },
        watch: {
            allLength(newVal, oldVal){
                this.$nextTick(() => {
                    document.querySelector(".history-all-number").innerHTML = newVal
                })
            }
        },
        methods: {
            initHistory(){
                this.pass = [];
                this.reject = [];
                this.ing = [];
                this.all = [];
                this.loading = true;
                this.finished = false;
                axios({
                    url: apiRoot + '/user/myAppointment',
                    method: 'get'
                }).then(res => {
                    console.log(res.data.data)
                    if(res.data.code == 200){
                        res.data.data.myAppointmentVOList.forEach(item => {
                            if(item.progress == "被驳回"){
                                this.reject.push(item)
                            }else if(item.progress == '通过审核'){
                                this.pass.push(item)
                            }else if(item.progress == '未审核'){
                                this.ing.push(item)
                            }
                            this.all.push(item)
                        })
                        this.loading = false;
                    }else{
                        this.$Message.error(res.data.message);
                        this.loading = false;
                    }
                }).catch(err => {
                    this.$Message.error("请检查网络连接！")
                    this.loading = false;
                })
            },
            toCheckInfo(index, arr){
                console.log(arr[index])
                this.$router.push({
                    name: 'checkInfo',
                    params: {
                        id: arr[index].id,
                        departmentName: arr[index].departmentName,
                        fromManager: false,
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
  @import "myHistory";
</style>
