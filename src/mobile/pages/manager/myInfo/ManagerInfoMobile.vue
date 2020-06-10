<template>
  <div>
    <van-popup v-model="info_change" style="width: 90vw;height: 300px;border-radius: 10px">
      <div class="modal-info" style="margin-top: 3vh">
        <div class="phone">
          <div class="title">
            手机号
          </div>
          <div>
            <van-field v-model="phone" placeholder="请输入手机号"
                       style="background-color: #EDEDED; border-radius: 5px; width:70vw"/>
          </div>
        </div>
        <div class="phone" style="margin-top: 2vh">
          <div class="title">邮箱</div>
          <div>
            <van-field v-model="email" placeholder="请输入邮箱"
                       style="background-color: #EDEDED; border-radius: 5px;width:70vw"/>
          </div>
        </div>
        <div class="footer">
          <van-button @click="info_change=false,initPersonInfo()" style="border-radius: 5px;margin-right: 5px">取消</van-button>
          <van-button style="border-radius: 5px" type="primary" :loading="loading" @click="submit">提交</van-button>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="info_department" style="width: 90vw;height: 300px;border-radius: 10px">
      <div class="modal-info" style="margin-top: 3vh">
        <div class="phone">
          <div class="title">
            联系电话
          </div>
          <div>
            <van-field v-model="departmentInfo.telphone" placeholder="请输入手机号"
                       style="background-color: #EDEDED; border-radius: 5px; width:70vw"/>
          </div>
        </div>
        <div class="phone" style="margin-top: 2vh">
          <div class="title">邮箱</div>
          <div>
            <van-field v-model="departmentInfo.email" placeholder="请输入邮箱"
                       style="background-color: #EDEDED; border-radius: 5px;width:70vw"/>
          </div>
        </div>
        <div class="footer">
          <van-button @click="info_department=false,initDepartmentInfo()" style="border-radius: 5px;margin-right: 5px">取消</van-button>
          <van-button style="border-radius: 5px" type="primary" :loading="loading2" @click="submit2">提交</van-button>
        </div>
      </div>
    </van-popup>
    <div class="info-header">
    </div>
    <div class="info-header-image">
      <div class="info-header-image-first">
        <Avatar style="background-color: #87d068" icon="ios-person" size="80"/>
      </div>
      <div class="info-header-image-second">{{this.username}}</div>
      <div class="info-header-image-third">{{this.department}}</div>
    </div>
    <div class="info-person-department">
      <van-collapse v-model="activeNames" border>
        <van-collapse-item name="1" >
          <span slot="icon" style="color:#346DB3">
            <Icon type="md-person" />
          </span>
          <span slot="title">&nbsp&nbsp&nbsp&nbsp个人信息</span>
          <div class="content">
            <div class="change-info" @click="info_change=true">
              <Icon type="ios-create" />
            </div>
            <div class="phone" style="padding-top: 1vh">
              <span>手机号</span>
            </div>
            <div class="phone-info">
              <span style="display: inline-block;margin-left: 5vw; font-weight: 500;margin-top: 0.4vh">{{this.phone != '' ? this.phone : '未填写'}}</span>
            </div>
            <div class="phone" style="margin-top: 2vh">
              <span>邮箱</span>
            </div>
            <div class="phone-info">
              <span style="display: inline-block;margin-left: 5vw; margin-bottom: 2vh;font-weight: 500;margin-top: 0.4vh">{{this.email != '' ? this.email : '未填写'}}</span>
            </div>
          </div>
        </van-collapse-item>
        <van-collapse-item name="2">
          <span slot='icon' style="color:#346DB3;foont-size: 150%">
            <Icon type="ios-folder" />
          </span>
          <span slot="title">&nbsp&nbsp&nbsp&nbsp部门信息</span>
          <div class="content">
            <div class="change-info" @click="info_department=true">
              <Icon type="ios-create" />
            </div>
            <div class="phone" style="padding-top: 1vh">
              <span>部门名称</span>
            </div>
            <div class="phone-info">
              <span style="display: inline-block;margin-left: 5vw; font-weight: 500;margin-top: 0.4vh">{{this.departmentInfo.departmentName}}</span>
            </div>
            <div class="phone" style="margin-top: 2vh">
              <span>联系方式</span>
            </div>
            <div class="phone-info">
              <span style="display: inline-block;margin-left: 5vw; margin-bottom: 2vh;font-weight: 500;margin-top: 0.4vh">{{this.departmentInfo.telphone != '' ? this.departmentInfo.telphone : '未填写'}}</span>
            </div>
            <div class="phone" style="margin-top: 2vh">
              <span>邮箱</span>
            </div>
            <div class="phone-info">
              <span style="display: inline-block;margin-left: 5vw; margin-bottom: 2vh;font-weight: 500;margin-top: 0.4vh">{{this.departmentInfo.email!='' ? this.departmentInfo.email : "未填写"}}</span>
            </div>
          </div>
        </van-collapse-item>
        <van-collapse-item title="选择身份" name="3" v-if="isManager">
          <span slot='icon' style="color:#346DB3;foont-size: 150%">
            <Icon type="md-arrow-round-forward" />
          </span>
          <span slot="title">&nbsp&nbsp&nbsp&nbsp选择身份 （当前身份：管理员）</span>
          <div>
            <van-radio-group v-model="radio">
              <van-cell-group>
                <van-cell title="普通用户" clickable @click="radio = '1', $router.push('/mobile/userMobile/infoMobile')">
                  <van-radio slot="right-icon" name="1" />
                </van-cell>
                <van-cell title="管理员" clickable @click="radio = '2'">
                  <van-radio slot="right-icon" name="2" />
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
        </van-collapse-item>
        <van-collapse-item title="注销" name="4">
          <span slot='icon' style="color:#346DB3;">
            <Icon type="md-close" />
          </span>
          <span slot="title">&nbsp&nbsp&nbsp&nbsp注销</span>
          <div style="text-align: center">
            <van-button type="danger" @click="logout" style="width: 60vw" round>注销</van-button>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'managerInfoMobile',
        data(){
            return{
                isManager: localStorage.getItem('identity').indexOf("manager") != -1 ? true : false,
                username: localStorage.getItem('username'),
                department: '',
                phone: "",
                email: '',
                radio: '2',
                departmentInfo: {
                    id: '',
                    departmentName: '',
                    email: '',
                    telphone: ''
                },
                info_change: false,
                info_department: false,
                loading: false,
                loading2: false,
                activeNames: [],
            }
        },
        watch:{
            info_change(newVal, oldVal){
                this.initPersonInfo()
            },
            info_department(newVal, oldVal){
                this.initDepartmentInfo();
            }
        },
        mounted() {
            this.initPersonInfo()
            this.initDepartmentInfo()
        },
        methods:{
            initPersonInfo(){
                axios({
                    url: apiRoot + '/user/info?userId=' + localStorage.getItem('userid'),
                    method: 'get'
                }).then((res) =>{
                    if(res.data.code == 200){
                        this.department = res.data.data.department
                        this.email = res.data.data.email
                        this.phone = res.data.data.phone
                    }else{
                        this.$Message.error(res.data.message)
                    }
                }).catch((err) => {
                    this.$Message.error("请检查网络连接！")
                })
            },
            initDepartmentInfo(){
                axios({
                    url: apiRoot + '/user/departmentInfo',
                    method: 'get'
                }).then((res) =>{
                    if(res.data.code == 200){
                        this.departmentInfo.departmentName = res.data.data.departmentName
                        this.departmentInfo.email = res.data.data.email;
                        this.departmentInfo.telphone = res.data.data.telphone
                        this.departmentInfo.id = res.data.data.id
                    }else{
                        this.$Message.error(res.data.message)
                    }
                }).catch((err) => {
                    this.$Message.error("请检查网络连接！")
                })
            },
            submit(){
                this.loading = true;
                if(this.phone === '' || this.email === ''){
                    this.$Message.error("请不要提交空白信息！")
                    this.loading = false;
                }else{
                    axios({
                        url: apiRoot + '/user/userInfoUpdate',
                        method: 'post',
                        data: {
                            email: this.email,
                            phone: this.phone
                        }
                    }).then((res) => {
                        if(res.data.code == 200){
                            this.$Message.success("修改成功！")
                            this.loading = false
                            this.info_change = false
                        }else{
                            this.$Message.error(res.data.message)
                            this.loading = false
                        }
                    }).catch((err) => {
                        this.$Message.error("请检查网络连接！")
                        this.loading = false
                    })
                }
            },
            submit2(){
                this.loading2 = true;
                if(this.departmentInfo.telphone === '' || this.departmentInfo.email === ''){
                    this.$Message.error("请不要提交空白信息！")
                    this.loading2 = false;
                }else{
                    axios({
                        url: apiRoot + '/manager/departmentUpdate',
                        method: 'post',
                        data: {
                            id: this.departmentInfo.id,
                            email: this.departmentInfo.email,
                            telphone: this.departmentInfo.telphone
                        }
                    }).then((res) => {
                        if(res.data.code == 200){
                            this.$Message.success("修改成功！")
                            this.loading2 = false
                            this.info_department = false
                        }else{
                            this.$Message.error(res.data.message)
                            this.loading2 = false
                        }
                    }).catch((err) => {
                        this.$Message.error("请检查网络连接！")
                        this.loading2 = false
                    })
                }

            },
            logout(){
              this.$router.push("/login");
              localStorage.clear();
              localStorage.setItem("logout", "comfirm");
            }
        }
    }
</script>

<style scoped lang="scss">
  @import 'ManagerInfoMobile';
</style>
