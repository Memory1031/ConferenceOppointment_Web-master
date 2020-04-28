<template>
  <div class="login">
    <div class="filter">
      <div class="SysTitle" >
        会议室预约系统
        <div class="login-box">
          <Input v-model="UserId" style="margin-bottom: 10px" size="large" prefix='md-person' placeholder="学/工号"/>
          <Input v-model="Password" type="password" style="margin-bottom: 7px" prefix="md-lock" size="large" placeholder="密码" v-on:keyup.enter.native="login"/>
          <ButtonGroup size="large">
            <div style="display: flex;">
              <Button size="large" type="primary" :loading="loading" @click="login">
                登录
              </Button>
            </div>
          </ButtonGroup>
        </div>
      </div>
    </div>
  </div>
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
            }
        },
        methods: {
            login() {
                this.loading = true
                if (this.UserId && this.Password) {
                    axios({
                        url: apiRoot + '/login',
                        method: 'post',
                        data: {
                            userId: this.UserId,
                            password: this.Password
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
                } else {
                    this.$Message.info("请完整填写有关字段！");
                    this.loading = false
                }
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

