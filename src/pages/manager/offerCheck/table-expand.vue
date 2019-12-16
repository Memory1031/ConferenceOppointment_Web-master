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
    <Row style="padding-left: 30px; margin-bottom: 0px">预约详情：</Row>
    <Divider size="small"/>
    <Row>
      <Col span="8">
        <Row>
          <Card>
            <div>
              <Row>
                <Col span="5">
                  申请理由：
                </Col>
                <Col span="19">
                  <span v-if="reasonExist">{{this.info.requestreason}}</span>
                  <span v-if="!reasonExist">未填写</span>
                </Col>
              </Row>
            </div>
          </Card>
        </Row>
      </Col>
      <Col span="16" style="padding-left: 25px">
        <p>会议参与者（默认第一个人为申请人）</p>
        <Table
          size="large"
          no-data-text="数据异常"
          stripe border
          :loading="loading"
          height="350"
          :columns="columns" :data="data"></Table>
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
              reasonExist: true,
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
                  },
                  {
                      title: '操作',
                      key: 'operation',
                      align: 'center',
                      width: 150,
                      render: (h, params) => {
                          return h('div', [
                                  h('Button', {
                                      props: {
                                          type: 'primary'
                                      },
                                      style: {
                                          height: '30px',
                                          borderColor: 'white',
                                          fontSize: '15px'
                                      },
                                      on: {
                                          click: () => {

                                          }
                                      }
                                  }, '查看标签')
                              ]
                          )
                      }
                  }
              ],
              data: []
          }
        },
        mounted(){
            this.init()
            console.log(this.row)
        },
        methods:{
            init(){
                this.loading = true
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
            }
        }
    }
</script>
