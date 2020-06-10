<template>
<!--  <div class="login">-->
<!--    <div class="filter">-->
<!--      <div class="SysTitle" >-->
<!--        会议室预约系统-->
<!--        <div class="login-box">-->
<!--          <Input v-model="UserId" style="margin-bottom: 10px" size="large" prefix='md-person' placeholder="学/工号"/>-->
<!--          <Input v-model="Password" type="password" style="margin-bottom: 7px" prefix="md-lock" size="large" placeholder="密码" v-on:keyup.enter.native="login"/>-->
<!--          <ButtonGroup size="large">-->
<!--            <div style="display: flex;">-->
<!--              <Button size="large" type="primary" :loading="loading" @click="login">-->
<!--                登录-->
<!--              </Button>-->
<!--            </div>-->
<!--          </ButtonGroup>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>

<script>
    import axios from 'axios'

    export default {
        name: "login",
        data() {
            return {
                UserId: '',
                Password: '',
                loading: false,
            }
        },
        mounted(){
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
                this.$router.push('/mobile')
            }else{
              let token = localStorage.getItem("token")
              let logout = localStorage.getItem("logout")
              if(token){
                if(localStorage.getItem("last")){
                  let lst = localStorage.getItem("last");
                  if(lst == '/login'){
                    this.$router.push('/user');
                  }else if(lst == '/mobile/loginMobile'){
                    this.$router.push('/mobile')
                  }else{
                    this.$router.push(localStorage.getItem("last"))
                    localStorage.removeItem("last")
                  }
                }else this.$router.push('/user');
              }else if(logout == "comfirm"){
                  console.log(logout)
                  localStorage.removeItem("logout")
                  window.location.href = "https://oauth.shu.edu.cn/oauth/logout?retUrl=" + window.location.href;
              }else{
                  let code = this.$route.query.code;
                  if(code){
                    //拿到code，向后端发送申请，验证code，获取用户相关信息存到localstorage里
                    this.login(code, document.location.href.split("?")[0])
                  }else{
                    let url = "https://oauth.shu.edu.cn/oauth/authorize?response_type=code&client_id=XcrPCxaPi665pwsvuccUSOOSPiYacVz2&redirect_uri="
                      + document.location.href + "&scope=1"
                    document.location.href = url
                  }

                }
            }
        },
        methods: {
            login(code, url) {
                this.loading = true
                axios({
                    url: apiRoot + '/login',
                    method: 'post',
                    data: {
                        code: code,
                        url: url
                    }
                }).then((res) => {
                        if (res.data.code === 200) {
                            console.log("res:", res.data)
                            this.loading = false;
                            //登陆成功直接进入普通用户界面
                            this.$Message.success('登录成功！');
                            localStorage.setItem('token', res.data.data.token);
                            localStorage.setItem('userid', res.data.data.userId);
                            localStorage.setItem('username', res.data.data.name);
                            localStorage.setItem('identity', res.data.data.identity);
                            if(localStorage.getItem("last")){
                                let lst = localStorage.getItem("last");
                                if(lst == '/login'){
                                    this.$router.push('/user');
                                }else if(lst == '/mobile/loginMobile'){
                                    this.$router.push('/mobile')
                                }else{
                                    this.$router.push(localStorage.getItem("last"))
                                    localStorage.removeItem("last")
                                }
                            }else this.$router.push('/user');
                        } else {
                            this.$Message.error(res.data.message);
                            this.loading = false
                        }
                    }
                ).catch((err) => {
                    console.error(err)
                    this.$Message.error("登录失败，请检查网络连接！");
                    this.loading = false
                })
            }
        },
    }
</script>

<style scoped lang="scss">
  @import "login";
</style>

<style lang="scss">
  .login-box {
    .ivu-input {
      background-color: transparent;
      color: #f8f8f9ab;
    }
  }
</style>

