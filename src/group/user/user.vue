<template>
  <div class="layout">
    <Layout style="height: 100vh;">
      <Sider :width="250">
        <div class="layout-logo-left">
          <img src="../../assets/img/font.png">
        </div>
        <Menu :active-name="activeName"
              width="251px"
              @on-select="push">
          <MenuItem name="announcementUser">
            <Icon type="ios-mail"></Icon>
            <span>查看公告</span>
          </MenuItem>
          <MenuItem name="OppointConference">
            <Icon type="ios-create-outline"></Icon>
            <span>预约会议室</span>
          </MenuItem>
          <MenuItem name="myOpp">
            <Icon type="md-attach" />
            <span>我的预约</span>
          </MenuItem>
          <MenuItem name="myGroup">
            <Icon type="md-git-network" />
            <span>我的群组</span>
          </MenuItem>
          <MenuItem name="myInfo">
            <Icon type="ios-person"></Icon>
            <span>个人信息</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{background: '#fff', height: '80px',boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}"
                class="layout-header-bar">
          <div class="layout-header-title"
            id="layout-header-title">
          </div>
          <div class="select">
            <Avatar style="background-color: #87d068" icon="ios-person" />
            <Dropdown>
              <a href="javascript:void(0)" class="name">
                {{this.UserName}}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <Dropdown placement="left-start" v-if="identity.show">
                  <DropdownItem>
                    选择身份
                    <Icon type="ios-arrow-forward"></Icon>
                  </DropdownItem>
                  <DropdownMenu slot="list">
                    <DropdownItem v-if="this.identity.student|this.identity.teacher" @click.native="$router.push('/user')">普通用户</DropdownItem>
                    <DropdownItem v-if="this.identity.manager" @click.native="$router.push('/manager')">普通管理员</DropdownItem>
                    <DropdownItem v-if="this.identity.system" @click.native="$router.push('/system')">系统管理员</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <DropdownItem @click.native="$router.push('myInfo')">我的信息</DropdownItem>
                <DropdownItem divided @click.native="logout">登出</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Header>
        <Content :style="{margin: '20px', background: '#fff', minHeight: '220px'}" style="height:100vh; overflow-y: scroll">
<!--          <Scroll :height="contentHeight">-->
            <router-view></router-view>
<!--          </Scroll>-->

        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
    export default {
        name: 'user',
        data () {
            return {
                contentHeight: 450,
                isCollapsed: false,
                activeName: "",
                UserName: "",
                identityString: "",
                identity:{
                    student: false,
                    teacher: false,
                    manager: false,
                    system: false,
                    show: false,
                }
            };
        },
        watch: {
            $route() {
                this.$nextTick(() => {
                    this.initMenuActive();
                });
            }
        },
        mounted(){
            this.contentHeight = document.body.offsetHeight - 130;
            this.initMenuActive();
            this.initIdentity();
        },
        methods:{
          initMenuActive(){
              this.activeName = this.$route.name;
              this.$nextTick(() => {
                  document.querySelector(
                      "#layout-header-title"
                  ).innerHTML = document.querySelector(
                      ".ivu-menu-item-selected"
                  ).innerHTML;
              });
              this.UserName = localStorage.getItem("username");
          },
          push(name){
              this.$router.push(name);
          },
          initIdentity(){
              this.identityString = localStorage.getItem("identity");
              if(!this.identityString){
                  // this.$router.push('/login');
                  // localStorage.clear();
              }else{
                  if(this.identityString.indexOf("student")!= -1){
                      this.identity.student = true;
                  }
                  if(this.identityString.indexOf("teacher")!= -1){
                      this.identity.teacher = true;
                  }
                  if(this.identityString.indexOf("manager")!= -1){
                      this.identity.manager = true;
                      this.identity.show = true;
                  }
                  if(this.identityString.indexOf("system")!= -1){
                      this.identity.system = true;
                      this.identity.show = true;
                  }
              }

          },
          logout(){
              this.$router.push("/login");
              localStorage.clear();
          }
        }
    }
</script>

<style lang="scss">
  @import "../group";
</style>
<style scoped>
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }

  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }

</style>
