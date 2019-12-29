<template>
  <div>
    <div class="header-managerList-manager">
      <div style="color: white;padding-top: 2.5vh; padding-left:5vw;font-size:120%">普通管理员
        <span style="color: white;float: right;padding-right: 2vw;" @click="init">
          <Icon type="md-refresh" />
        </span>
      </div>
      <div style="margin-top: 4vh">
        <van-row>
          <van-col span="20">
            <van-field
              v-model="addId"
              style="width:30vw;border:1px solid #E8E8E8;border-radius: 10px;float: right;margin-right: 2vw;"
              placeholder='请输入学/工号'
            ></van-field>
          </van-col>
          <van-col span="4">
            <van-button type="primary" style='border-radius: 10px' @click="addManager"
                    :loading="loading_add">添加</van-button>
          </van-col>
        </van-row>


      </div>
      <hr style="margin-top: 2vh;margin-bottom: 1vh" color="	#F8F8F8"/>
      <div class="card-managerList-manager" style="margin-top: 2vh;">
        <van-list
          v-model="loading"   :finished="finished"
          finished-text="没有更多了"
          :error.sync="error" @load="finished=true"
          error-text="当前部门下属没有普通管理员"
        >
          <van-cell
            v-for="(item, index) in managerList"
            :key="item.id"
          >
            <div class="check-list-mobile-first">
              <span>{{item.name}}</span>
              <span class="check-list-mobile-first-name">{{item.userId}}</span>
            </div>
            <div class="check-list-mobile-second">
              <div style="float: right; margin-right: 5vw;">
                <van-button style="color: #FFC197;border: solid 0.5px; border-radius: 10px;margin-top: 2vh"
                    @click="openDeleteModal(index)">删除</van-button>
              </div>
              <span>
                <span style="color: #BFBFBF">部门：</span>
                <span style="color: #1B55A1">{{item.department}}</span><br/>
                <span style="color: #BFBFBF">手机：</span>
                <span style="color: #1B55A1">{{item.phone ? item.phone : '未填写'}}</span><br/>
                <span style="color: #BFBFBF">邮箱：</span>
                <span style="color: #1B55A1">{{item.email ? item.email : '未填写'}}</span>
              </span>
            </div>
          </van-cell>
        </van-list>
        <van-popup v-model="delete_opp" style="width: 90vw;height: 300px;text-align:center;border-radius: 10px">
          <img src="../../../../assets/img/error.png" style='margin-top: 2vh;' width="100">
          <div style="font-size:150%;margin-top: 1vh;">友情提醒</div><br/>
          <div style="margin-left: 4vw; margin-right: 4vw">您确定要撤销&nbsp<span class="approval-num"></span>&nbsp的管理员权限吗？</div><br/>
          <div class="footer">
            <van-button @click="delete_opp=false" style="border-radius: 5px;margin-right: 4vw">取消</van-button>
            <van-button style="border-radius: 5px" type="warning" :loading="loading_delete" @click="deleteManager">撤销</van-button>
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
      name: 'managerListMobile',
      data(){
          return{
              loading: false,
              loading_delete: false,
              loading_add: false,
              finished: false,
              error: false,
              deleteId: 0,
              addId: '',
              item: {
                  userId: '',
                  name: '',
                  department: '',
              },
              idSolid: false,
              delete_opp: false,
              managerList : []
          }
      },
      watch:{
          addId(newVal, oldVal){
              if(newVal.length === 8){
                  this.getInfo(newVal)
              }else{
                  this.idSolid = false;
              }
          }
      },
      mounted(){
          this.init()
      },
      methods: {
          init(){
              this.managerList = []
              this.loading = true;
              this.finished = false;
              axios({
                  url: apiRoot + '/manager/managerList',
                  method: 'get'
              }).then(res => {
                  if(res.data.code == 200){
                      res.data.data.forEach(item => {
                          this.managerList.push(item)
                      })
                      this.loading = false
                  }else{
                      this.$Message.error(res.data.message)
                      this.loading = false
                  }
              }).catch(err => {
                  this.$Message.error('请检查网络连接！')
                  this.loading = false
              })
          },
          deleteManager(){
              this.loading_delete = true;
              axios({
                  url: apiRoot + '/manager/managerDeletion?userId=' + this.deleteId,
                  method: 'get'
              }).then(res => {
                  if(res.data.code == 200){
                      this.$Message.success("删除成功！")
                      this.init()
                      this.loading_delete = false;
                      this.delete_opp = false;
                  }else{
                      this.$Message.error(res.data.message)
                      this.loading_delete = false;
                  }
              }).catch(err => {
                  this.$Message.error('请检查网络连接！')
                  this.loading_delete = false;
              })
          },
          getInfo(userId){
              this.idSolid = false;
              axios({
                  url: apiRoot + '/user/info?userId=' + userId,
                  method: 'get'
              }).then(res => {
                  if(res.data.code == 200){
                      this.item.userId = userId;
                      this.item.name = res.data.data.name;
                      this.item.department = res.data.data.department
                      this.idSolid = true;
                  }else{
                      this.$Message.error(res.data.message)
                      this.idSolid = false;
                  }
              }).catch((err) => {
                  this.$Message.error("请检查网络连接！")
                  this.idSolid = false;
              })
          },
          addManager(){
              if(this.idSolid === false){
                  this.$Message.error("请输入有效的学/工号")
                  return
              }else{
                  this.loading_add = true;
                  axios({
                      url: apiRoot + '/manager/managerSetting',
                      method: 'post',
                      data: {
                          userList : [this.item]
                      }
                  }).then((res) => {
                      if(res.data.code == 200){
                          this.$Message.success("添加成功！")
                          this.item = {
                              userId: '',
                              name: '',
                              department: '',
                          }
                          this.init()
                          this.loading_add = false;
                      }else{
                          this.$Message.error(res.data.message)
                          this.loading_add = false;
                      }
                  }).catch(err => {
                      this.$Message.error('请检查网络连接！')
                      this.loading_add = false;
                  })
              }
          },
          openDeleteModal(index){
              this.deleteId = this.managerList[index].userId;
              this.delete_opp = true;
              this.$nextTick(() => {
                  document.querySelector('.approval-num').innerHTML = this.managerList[index].name
              })
          }
      }
  }
</script>

<style scoped lang="scss">
  @import "managerListMobile";
</style>
