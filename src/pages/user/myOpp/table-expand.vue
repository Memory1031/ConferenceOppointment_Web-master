<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
  .hr_extend{
    margin-top: 10px;
    margin-bottom: 10px;
    color: #d7dde4;
  }
</style>

<template>
  <Card style="font-size: 15px">
    <Row style="padding-left: 30px; margin-bottom: 0px">
      <span>预约详情：</span>
      <div style="float: right" v-if="this.row.progress=='未审核'">
        <AutoComplete v-model="add_id" @on-search='searchUserInfo'
                      @on-select="selectUserInfo(index,data2[0])"
                      :data="data2" style="width: 200px"
                      clearable placeholder="输入学/工号"></AutoComplete>
        <Button size="default" type="primary" @click="add">新增参与者</Button>
        <Button v-if="!canWrite" @click="canWrite=!canWrite" size="default" type="info">修改理由</Button>
        <Button v-if="canWrite" size="default" :loading="loading_check" @click="check" type="success">提交</Button>
      </div>
    </Row>
    <Divider size="small"/>
    <Row>
      <Col span="16" style="padding-right: 25px">
        <p>会议参与者（默认第一个人为申请人）</p>
        <Table v-if="this.row.progress!='未审核'"
          size="large"
          no-data-text="数据异常"
          stripe border
          :loading="loading"
          height="350"
          :columns="columns" :data="data"></Table>
        <Table v-if="this.row.progress=='未审核'"
               size="large"
               no-data-text="数据异常"
               stripe border
               :loading="loading"
               height="350"
               :columns="columns2" :data="data"></Table>
      </Col>
      <Col span="8">
        <Row>
          <Card>
            <div>
              <Row>
                <Col span="5">
                  申请理由：
                </Col>
                <Col span="19" v-if="this.row.progress=='未审核'">
                  <Input v-model="applicationReason" :disabled="!canWrite" type="textarea" :row="2"></Input>
                </Col>
                <Col span="19" v-else>
                  <span v-if="reasonExist">{{this.info.requestreason}}</span>
                  <span v-if="!reasonExist">未填写</span>
                </Col>
              </Row>
            </div>
          </Card>
          <Card v-if="this.row.progress=='被驳回'" style="margin-top: 25px">
            <div>
              <Row>
                <Col span="5">
                  拒绝理由：
                </Col>
                <Col span="19">
                  <span v-if="!info.refusereason==''">{{this.info.refusereason}}</span>
                  <span v-if="info.refusereason==''">未填写</span>
                </Col>
              </Row>
            </div>
          </Card>
          <Card v-if="this.row.progress=='已评价'" style="margin-top: 25px">
            <div>
              <Row>
                <Col span="5">
                  评价：
                </Col>
                <Col span="19">
                  <Tag v-for="item in tagList" :key="item.tag"
                       size="large" style="float: left">{{item.tag}}</Tag>
                </Col>
              </Row>
            </div>
          </Card>
        </Row>
      </Col>
    </Row>
  </Card>

</template>

<script>
    import axios from 'axios'

    export default {
        props: {
            row: Object
        },
        data(){
            return {
                info: {},
                loading: false,
                loading_check: false,
                reasonExist: true,
                applicationReason: '',
                add_id: '',
                canWrite: false,
                tags: [],
                tagList: [],
                isEmpty: false,
                columns: [
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '学/工号',
                        key: 'userId',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '部门',
                        key: 'departmentName',
                        align: 'center',
                        tooltip: true
                    }
                ],
                columns2: [
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '学/工号',
                        key: 'userId',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '部门',
                        key: 'departmentName',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                            if(params.index != 0){
                                return h('div', {}, [
                                    h("Button",{
                                        props: {
                                            type: 'error',
                                        },
                                        on:{
                                            click: () => {
                                                axios({
                                                    url: apiRoot + '/user/participantUpdate',
                                                    method: 'post',
                                                    data: {
                                                        id: this.data[params.index].userId,
                                                        applicationId: this.row.id,
                                                        isAdd: false
                                                    }
                                                }).then((res) => {
                                                    if(res.data.code == 200){
                                                        this.$Message.success("删除成功！")
                                                        this.init()
                                                    }else{
                                                        this.$Message.error(res.data.message)
                                                    }
                                                }).catch((err) => {
                                                    this.$Message.error("删除失败，请检查网络连接！")
                                                })
                                            }
                                        }
                                    },'删除')
                                ])
                            }
                        }
                    }
                ],
                data: [],
                data2: []
            }
        },
        mounted(){
            this.init()
        },
        methods:{
            init(){
                this.loading = true
                this.data = []
                axios({
                    url: apiRoot + '/user/appointmentDetail?id=' + this.row.id,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        this.info = res.data.data
                        if(this.info.requestreason == '') this.reasonExist = false
                        this.data.push(this.info.applicantName)
                        if(this.info.participants.length != 0){
                            this.info.participants.forEach((item) => {
                                this.data.push(item)
                            })
                        }
                        this.tagList = this.info.tagList
                        this.applicationReason = this.info.requestreason
                        this.loading = false;
                    }else{
                        this.$Message.error(res.data.message)
                        this.loading = false;
                    }
                }).catch((err) => {
                    console.log(err)
                    this.$Message.error("获取详细信息失败，请检查网络连接！")
                    this.loading = false;
                })
            },
            searchUserInfo(value) {
                this.data2 = ['查询中...']
                let depart = '';
                axios({
                    url: apiRoot + '/user/info?userId=' + localStorage.getItem('userId'),
                    method: 'get'
                }).then((res) => {
                    if (res.data.code === 200) {
                        depart = res.data.data.department
                    }
                }).catch((err) => {})
                if (value.length === 8) {
                    axios({
                        url: apiRoot + '/user/info?userId=' + value,
                        method: 'get'
                    }).then((res) => {
                        if (res.data.code === 200) {
                            if(res.data)
                                this.data2 = !value ? [] : [
                                    res.data.data.userId + '-' + res.data.data.name + '-' + res.data.data.department
                                ];
                        } else if(depart != res.data.data.department){
                            this.data2 = ['权限不足，你无法添加其他部门的用户成为本部门的普通管理员']
                        } else {
                            this.data2 = ['暂无此人']
                        }
                    }).catch(() => {
                        this.data2 = ['查询失败']
                    })
                } else {
                    this.data2 = ['请输入正确的学号']
                }
            },
            selectUserInfo(index, value) {
                if (value === '请输入正确的学号' || value === '查询失败' || value === '暂无此人' || value === '查询中...') {
                    this.add_id = ''
                } else {
                    var id = value.split("-")[0]   //用户学/工号
                    setTimeout(() => {
                        this.add_id = id
                    })
                }
            },
            add(){
               if(this.add_id == ''){
                   this.$Message.error("请输入正确的学号！")
                   return
               }
               axios({
                   url: apiRoot + '/user/participantUpdate',
                   method: 'post',
                   data: {
                       id: this.add_id,
                       applicationId: this.row.id,
                       isAdd: true
                   }
               }).then((res) => {
                   if(res.data.code == 200){
                       this.$Message.success("添加成功！")
                       this.init()
                   }else{
                       this.$Message.error(res.data.message)
                   }
               }).catch((err) => {
                   this.$Message.error("添加失败，请检查网络连接！")
               })
            },
            check(){
                this.loading_check = true;
                axios({
                    url: apiRoot + '/user/reasonUpdate',
                    method: 'post',
                    data:{
                        id: this.row.id,
                        reason: this.applicationReason
                    }
                }).then((res) => {
                    if(res.data.code == 200){
                        this.$Message.success("更新申请理由成功！")
                        this.loading_check = false
                        this.canWrite = false
                        this.init()
                    }else{
                        this.$Message.error(res.data.message)
                        this.loading_check = false
                        this.init()
                    }
                }).catch((err) => {
                    this.$Message.error("更新失败，请检查网络连接！")
                    this.loading_check = false
                })
            }
        }
    }
</script>
