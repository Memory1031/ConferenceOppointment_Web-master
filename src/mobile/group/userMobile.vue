<template>
  <div>
    <div>
      <router-view/>
    </div>
    <div class="footer-mobile">
      <van-tabbar v-model="active" fixed @change="onchange" border>
        <van-tabbar-item name="avaMobile" icon="home-o">预约</van-tabbar-item>
        <van-tabbar-item name="infoMobile" icon="user-circle-o">信息</van-tabbar-item>
        <!--      <van-tabbar-item name="friends" icon="friends-o">标签</van-tabbar-item>-->
        <!--      <van-tabbar-item name="setting" icon="setting-o">标签</van-tabbar-item>-->
      </van-tabbar>
    </div>

  </div>
</template>

<script>
  export default {
      name: 'userMobile',
      data(){
          return{
              active: 'avaMobile'
          }

      },
      watch: {
          $route() {
              this.$nextTick(() => {
                  this.initMenuActive();
              });
          }
      },
      mounted(){
          this.initMenuActive();
      },
      methods: {
          initMenuActive(){
              this.active = this.$route.name
          },
          onchange(name){
              this.$router.push(name)
          }
      }
  }
</script>

<style lang="scss">
  @import 'group';
</style>
