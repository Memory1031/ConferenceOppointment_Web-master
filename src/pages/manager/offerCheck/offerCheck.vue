<template>
  <div>
    <Row>
      <div class="button">
        <Input size="large" placeholder="输入房间号（选填）"
               style="width: 250px" clearable
                v-model="roomName"></Input>
        <Button type="success" class="refresh_button" @click="searchForApply">筛选</Button>
      </div>
    </Row>
    <Row>
      <Table
        size="large"
        no-data-text="当前没有会议室申请"
        stripe border
        :loading="loading"
        height="700"
        :columns="columns" :data="data"></Table>
      <Modal v-model="modal_pass" width="600" :closable="false">
        <div  style="text-align: center" >
          <img src="../../../assets/img/error.png" width="100">
          <br/>
          <p style="font-size: 200%">确认通过申请？</p>
          <br/><br/>
          <p style="font-size: 120%">有<span class="approvalNumber"></span>人同时申请，通过此申请将自动驳回该时间段的所有冲突申请</p>
        </div>
        <div slot="footer">
          <Button size="large" @click="modal_pass=false">取消</Button>
          <Button size="large" type="success" :loading="loading_pass" @click="submit">通过</Button>
        </div>
      </Modal>
      <Modal v-model="modal_cancel" width="600" :closable="false">
        <div>
          <Card>
            <p style="font-size: 130%">请填写驳回理由（可不填）:</p>
            <br/>
            <Input v-model="refuseReason" :row='2' size="large"></Input>
          </Card>
        </div>
        <div slot="footer">
          <Button size="large" @click="modal_cancel=false">取消</Button>
          <Button size="large" type="error" :loading="loading_cancel" @click="cancel">驳回</Button>
        </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
  import axios from 'axios'
  import expandRow from './table-expand'

  export default {
      name: 'offerCheck',
      components: { expandRow },
      data() {
          return{
              loading: false,
              roomName: '',
              pass_index: 0,
              modal_pass: false,
              modal_cancel: false,
              loading_pass: false,
              loading_cancel: false,
              refuseReason: '',
              columns: [
                  {
                      type: 'expand',
                      width: 50,
                      render: (h, params) => {
                          return h(expandRow, {
                              props: {
                                  row: params.row,
                              }
                          })
                      }
                  },
                  {
                      title: '大楼名称',
                      key: 'building',
                      align: 'center',
                      width: 200,
                      tooltip: true
                  },
                  {
                      title: '房间号',
                      key: 'conferenceName',
                      align: 'center',
                      width: 150,
                      tooltip: true
                  },
                  {
                      title: '申请单位',
                      key: 'departmentName',
                      align: 'center',
                      tooltip: true
                  },
                  {
                      title: '申请人',
                      key: 'applicantName',
                      align: 'center',
                      width: 150,
                      tooltip: true,
                  },
                  {
                      title: '身份',
                      key: 'identity',
                      align: 'center',
                      width: 150,
                      tooltip: true,
                  },
                  {
                      title: '使用时间',
                      key: 'needdate',
                      align: 'center',
                      tooltip: true,
                  },
                  {
                      title: '时间段',
                      key: 'time',
                      align: 'center',
                      tooltip: true,
                  },
                  {
                      title: '操作',
                      key: 'operation',
                      align: 'center',
                      width: 250,
                      render: (h, params) => {
                          return h('div', [
                              h('Button', {
                                  props: {
                                      type: 'info',
                                  },
                                  style: {
                                      marginRight: '5px',
                                      height: '30px',
                                      borderColor: 'white',
                                      fontSize: '15px'
                                  },
                                  on: {
                                      click: () => {
                                          this.pass_index = params.index
                                          this.getConflict();
                                      }
                                  }
                              }, '通过'),
                              h('Button', {
                                  props: {
                                      type: 'error',
                                  },
                                  style: {
                                      height: '30px',
                                      backgroundColor: '#FF7F50',
                                      borderColor: 'white',
                                      fontSize: '15px'
                                  },
                                  on: {
                                      click: () => {
                                          this.cancel_index = params.index
                                          this.modal_cancel = true;
                                      }
                                  }
                              }, '驳回')
                          ])

                      }
                  }
              ],
              data: []
          }
      },
      mounted() {
          this.init("初始化成功！", '');
      },
      methods: {
          init(index,type){
              this.loading = true;
              this.data = []
              axios({
                  url: apiRoot + '/manager/appointmentList',
                  method: 'get'
              }).then((res) => {
                  if(res.data.code == 200){
                      res.data.data.forEach((item) => {
                          item.newParam = 'time'
                          item.time = item.isweekend==0 ? (item.begintime + '-' + item.endtime) : '周末全天'
                          if(type == ''){
                              this.data.push(item)
                          }else{
                              if(item.conferenceName.indexOf(type) != -1){
                                  this.data.push(item)
                              }
                          }
                      })
                      this.$Message.success(index);
                      this.loading = false;
                  }else{
                      this.$Message.error(res.data.message)
                      this.loading = false;
                  }
              }).catch((err) => {
                  this.$Message.error("获取数据失败，请检查网络连接")
                  this.loading = false;
              })
          },
          searchForApply(){
              this.init("检索成功！", this.roomName)
          },
          getConflict(){
              this.modal_pass = true;
              axios({
                  url: apiRoot + '/manager/approvalNum?id=' + this.data[this.pass_index].id,
                  method: 'get'
              }).then((res) => {
                  if(res.data.code == 200){
                      this.$nextTick(() => {
                          document.querySelector(".approvalNumber").innerHTML = res.data.data.num
                      })
                  }else{
                      this.$Message.error(res.data.message)
                  }
              }).catch((err) => {
                  this.$Message.error("请检查网络连接！")
              })
          },
          submit(){
              this.loading_pass = true;
              axios({
                  url: apiRoot + '/manager/approval',
                  method: 'post',
                  data: {
                      id: this.data[this.pass_index].id,
                      isPass: true,
                      refusereason: ''
                  }
              }).then((res) => {
                  if(res.data.code == 200){
                      this.$Message.success("审批成功！")
                      this.loading_pass = false;
                      this.init("刷新成功", '')
                      this.modal_pass = false
                  }else{
                      this.$Message.error(res.data.message)
                      this.loading_pass = false;
                  }
              }).catch((err) => {
                  this.$Message.error("提交请求失败，请检查网络连接！")
                  this.loading_pass = false;
              })
          },
          cancel(){
              this.loading_cancel = true;
              axios({
                  url: apiRoot + '/manager/approval',
                  method: 'post',
                  data: {
                      id: this.data[this.cancel_index].id,
                      isPass: false,
                      refusereason: this.refuseReason
                  }
              }).then((res) => {
                  if(res.data.code == 200){
                      this.$Message.success("驳回成功！")
                      this.loading_cancel = false;
                      this.init("刷新成功", '')
                      this.modal_cancel = false
                  }else{
                      this.$Message.error(res.data.message)
                      this.loading_cancel = false;
                  }
              }).catch((err) => {
                  this.$Message.error("提交请求失败，请检查网络连接！")
                  this.loading_cancel = false;
              })
          }
      }
  }
</script>

<style scoped lang="scss">
  @import 'offerCheck';
</style>
