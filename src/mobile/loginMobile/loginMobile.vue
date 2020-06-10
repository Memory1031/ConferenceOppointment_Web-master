<template>
<!--  <div class="loginMobile">-->
<!--    <div class="login-box" style="text-align: center">-->
<!--      <img src="../../assets/img/shu_title.png" style="width: 60vw">-->
<!--      <br/><br/>-->
<!--      <p style="font-size:160%; color: #000066; font-family: 新宋体;font-weight: bolder">会议室预约系统</p>-->
<!--      <br/>-->
<!--      <van-field-->
<!--          v-model="username"-->
<!--          clearable-->
<!--          label="学/工号"-->
<!--          left-icon="contact"-->
<!--          placeholder="请输入用户名"-->
<!--      />-->
<!--      <br/>-->
<!--      <van-field-->
<!--          v-model="password"-->
<!--          type="password"-->
<!--          label="密码" clearable-->
<!--          left-icon="lock"-->
<!--          placeholder="请输入密码"-->
<!--      />-->
<!--      <br/>-->
<!--      <van-button round type="info" style="width: 60vw"-->
<!--              @click="login" :loading="loading">登录</van-button>-->
<!--    </div>-->
<!--  </div>-->
</template>

<script>
  import axios from 'axios'

  export default {
      name: 'loginMobile',
      data(){
          return{
              username: '',
              password: '',
              loading: false,
          }
      },
      mounted(){
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
      },
      methods: {
          login(code, url){
              this.loading = true;
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
                          }else this.$router.push('/mobile/userMobile');
                      } else {
                          this.$Message.error(res.data.message);
                          this.loading = false
                      }
                  }
              ).catch((err) => {
                  this.$Message.error("登录失败，请检查网络连接！");
                  this.loading = false
              })
          }
      }
  }
</script>

<style scoped lang="scss">
  @import 'loginMobile';
</style>
