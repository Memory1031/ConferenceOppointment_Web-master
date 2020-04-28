<template>
  <div class="loginMobile">
    <div class="login-box" style="text-align: center">
      <img src="../../assets/img/shu_title.png" style="width: 60vw">
      <br/><br/>
      <p style="font-size:160%; color: #000066; font-family: 新宋体;font-weight: bolder">会议室预约系统</p>
      <br/>
      <van-field
          v-model="username"
          clearable
          label="学/工号"
          left-icon="contact"
          placeholder="请输入用户名"
      />
      <br/>
      <van-field
          v-model="password"
          type="password"
          label="密码" clearable
          left-icon="lock"
          placeholder="请输入密码"
      />
      <br/>
      <van-button round type="info" style="width: 60vw"
              @click="login" :loading="loading">登录</van-button>
    </div>
  </div>
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
      methods: {
          login(){
              this.loading = true;
              if(this.username && this.password){
                  axios({
                      url: apiRoot + '/login',
                      method: 'post',
                      data: {
                          userId: this.username,
                          password: this.password
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
              }else{
                  this.$Message.error("请完整填写有关字段！")
                  this.loading = false
              }
          }
      }
  }
</script>

<style scoped lang="scss">
  @import 'loginMobile';
</style>
