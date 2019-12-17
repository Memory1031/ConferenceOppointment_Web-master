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
      <Col span="16" style="padding-right: 25px">
        <p>会议参与者（默认第一个人为申请人）</p>
        <Table
          size="large"
          no-data-text="数据异常"
          stripe border
          :loading="loading"
          height="350"
          :columns="columns" :data="data"></Table>
      </Col>
      <Col span="8">
        <Row>
          <Card>
            <div>
              <Row>
                <Col span="5">
                  申请理由：
                </Col>
                <Col span="19">
                  <span v-if="reasonExist" style="float: left">{{this.info.requestreason}}</span>
                  <span v-if="!reasonExist">未填写</span>
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
                tagList: [],
                loading: false,
                reasonExist: true,
                tags: [],
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
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                            return h('Poptip', {
                                props: {
                                    placement: 'left-start',
                                    width: '350',
                                }
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'primary'
                                    },
                                    on:{
                                        click: () => {
                                            this.getTag(params.index);
                                        }
                                    }
                                }, '查看历史评价'),
                                h('div',{
                                        slot: 'content'
                                    }, this.tags.map((item) => {
                                        return h('Tag', {
                                            props: {
                                                size: 'large'
                                            },
                                            style:{
                                                float: 'left'
                                            },
                                            domProps: {
                                                innerHTML: item
                                            }
                                        })
                                    })
                                )
                            ])
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
                        this.tagList = this.info.tagList

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
            getTag(index){
                this.tags = [];
                axios({
                    url: apiRoot + '/user/usersTag?id=' + this.data[index].userId,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        let dat = res.data.data;
                        dat.forEach((item)=> {
                            this.tags.push(item.tag)
                        })
                    }else{
                        this.$Message.error(res.data.message)
                    }
                }).catch((err) => {
                    this.$Message.error("获取评价标签失败，请检查网络连接")
                })
            }
        }
    }
</script>
