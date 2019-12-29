<template>
  <div>
    <div>
      <router-view/>
    </div>
    <div class="footer-mobile">
      <van-tabbar v-model="active" fixed @change="onchange" border>
        <van-tabbar-item name="checkAvaMobile" icon="home-o">审批</van-tabbar-item>
        <van-tabbar-item name="managerListMobile" icon="friends-o">人员</van-tabbar-item>
        <van-tabbar-item name="managerInfoMobile" icon="user-circle-o">信息</van-tabbar-item>

        <!--      <van-tabbar-item name="setting" icon="setting-o">标签</van-tabbar-item>-->
      </van-tabbar>
    </div>

  </div>
</template>

<script>
    export default {
        name: 'managerMobile',
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
