<template>
  <div class="layout">
    <Layout :style="{minHeight: '100vh'}">
      <Sider :width="250">
        <div class="layout-logo-left">
          <img src="../../assets/img/font.png">
        </div>
        <Menu :active-name="activeName"
              width="251px"
              @on-select="push">
          <MenuItem name="announceManager">
            <Icon type="ios-mail"></Icon>
            <span>公告管理</span>
          </MenuItem>
          <MenuItem name="managerList">
            <Icon type="ios-body"></Icon>
            <span>人员管理</span>
          </MenuItem>
          <Submenu name="1">
            <template slot="title">
              <Icon type="ios-book-outline" />
              会议室
            </template>
            <MenuItem name="manageConference">
              <span>管理会议室</span>
            </MenuItem>
            <MenuItem name="offerCheck">
              <span>申请审核</span>
            </MenuItem>
          </Submenu>
<!--          <Submenu name="2">-->
<!--            <template slot="title">-->
<!--              <Icon type="ios-people" />-->
<!--              预约审核-->
<!--            </template>-->
<!--          </Submenu>-->
          <Submenu name="3">
            <template slot="title">
              <Icon type="ios-people" />
              信息
            </template>
            <MenuItem name="managerInfo">
              <span>我的信息</span>
            </MenuItem>
            <MenuItem name="departmentInfo">
              <span>部门信息</span>
            </MenuItem>
          </Submenu>

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
                <DropdownItem @click.native="$router.push('managerInfo')">我的信息</DropdownItem>
                <DropdownItem divided @click.native="logout">登出</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

        </Header>
        <Content :style="{margin: '20px', background: '#fff', minHeight: '220px'}">
          <router-view></router-view>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
    export default {
        name: 'manager',
        data () {
            return {
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
                    this.$router.push('/login');
                    localStorage.clear();
                }
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
  .layout-con{
    height: 100%;
    width: 100%;
  }
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
