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
      <span>群组详情：</span>
      <div style="float: right">
        <AutoComplete v-model="add_id" @on-search='searchUserInfo'
                      @on-select="selectUserInfo(index,data2[0])"
                      :data="data2" style="width: 200px"
                      clearable placeholder="输入学/工号"></AutoComplete>
        <Button size="default" type="primary" @click="add">新增群组成员</Button>
      </div>
    </Row>
    <Divider size="small"/>
    <Row>
        <p>群组成员（默认第一个人为创建者）</p>
        <Table
               size="large"
               no-data-text="数据异常"
               stripe border
               :loading="loading"
               height="350"
               :columns="columns" :data="data"></Table>
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
                add_id: '',
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
                        key: 'department',
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
                                                    url: apiRoot + '/user/groupMemberUpdate',
                                                    method: 'post',
                                                    data: {
                                                        id: this.data[params.index].userId,
                                                        groupId: this.row.id,
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
                    url: apiRoot + '/user/groupDetail?id=' + this.row.id,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.members.forEach((item) => {
                            this.data.push(item)
                        })
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
                        }else {
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
            add() {
                if (this.add_id == '') {
                    this.$Message.error("请输入正确的学号！")
                    return
                }
                axios({
                    url: apiRoot + '/user/groupMemberUpdate',
                    method: 'post',
                    data: {
                        id: this.add_id,
                        groupId: this.row.id,
                        isAdd: true
                    }
                }).then((res) => {
                    if (res.data.code == 200) {
                        this.$Message.success("添加成功！")
                        this.init()
                    } else {
                        this.$Message.error(res.data.message)
                    }
                }).catch((err) => {
                    this.$Message.error("添加失败，请检查网络连接！")
                })
            }
        }
    }
</script>
