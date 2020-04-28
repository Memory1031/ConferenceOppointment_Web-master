<template>
  <div>
    <Row>
      <div class="button">
        <Button type="success" class="refresh_button" @click="refresh">刷新</Button>
        <Button type="primary" size="large" @click="modal_create=true,data2=[]">创建群组</Button>
      </div>
      <Modal v-model="modal_create" width="900" :closable="false">
        <div>
          <Card style="text-align: center">
            <span>群组名称:</span>
            <Input v-model="groupName" placeholder="请输入群组名称" style="width: 400px"></Input>
          </Card>
          <Card style="margin-top:10px;height: 500px">
            <div style="float:right">
              <AutoComplete v-model="userid" @on-search='searchUserInfo'
                            @on-select="selectUserInfo(data2[0])"
                            :data="data2" style="width: 200px"
                            clearable placeholder="输入学/工号"></AutoComplete>
              <Button type="success" @click="add">添加</Button>
            </div>
            <br/>
            <div style="text-align: center;margin-top: 20px">
              <Table
                size="large"
                no-data-text="当前群组内没有成员"
                stripe border
                height="400" width="800"
                :columns="columns2" :data="data_list"
              ></Table>
            </div>
          </Card>
        </div>
        <div slot="footer">
          <Button size="large" @click="modal_create=false">取消</Button>
          <Button size="large" type="primary" :loading="loading_create" @click="createGroup">创建</Button>
        </div>
      </Modal>
    </Row>
    <Row>
      <Table
        size="large"
        no-data-text="当前没有群组"
        stripe border
        :loading="loading"
        height="700"
        :columns="columns" :data="data"></Table>
      <Modal v-model="modal_update" width="500" :closable="false">
        <div>
          <Card style="text-align: center">
            <span>群组名称:</span>
            <Input v-model="groupUpdateName" placeholder="请输入群组名称" style="width: 300px"></Input>
          </Card>
        </div>
        <div slot="footer">
          <Button size="large" @click="modal_update=false">取消</Button>
          <Button size="large" type="primary" :loading="loading_update" @click="updateGroupName">修改</Button>
        </div>
      </Modal>
      <Modal v-model="modal_delete" width="600" :closable="false">
        <div  style="text-align: center" >
          <img src="../../../assets/img/error.png" width="100">
          <br/>
          <br/>
          <p style="font-size: 200%">确认删除该群组？</p>
          <br/>
        </div>
        <div slot="footer">
          <Button size="large" @click="modal_delete=false">取消</Button>
          <Button size="large" type="error" :loading="loading_delete" @click="groupDelete">删除</Button>
        </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
    import axios from 'axios'
    import expandRow from './table-expand'

    export default {
        name: 'myOpp',
        components: { expandRow },
        data() {
            return{
                loading: false,
                loading_create: false,
                loading_update: false,
                loading_delete: false,
                modal_create: false,
                modal_update: false,
                modal_delete: false,
                update_index: 0,
                deleting_index: 0,
                groupName: '',
                groupUpdateName: '',
                userid: '',
                userInfo: {
                    userId: '',
                    name: '',
                    department: ''
                },
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
                        title: '群组名称',
                        key: 'name',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        width: 250,
                        render: (h, params) => {
                            return h('div', {}, [
                                h('Button', {
                                    props:{
                                        type: 'primary',
                                        size: 'large'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        height: '30px',
                                        fontSize: '15px',
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_update = true;
                                            this.update_index = params.index;
                                            this.groupUpdateName = this.data[params.index].name
                                        }
                                    }
                                }, '修改名称'),
                                h('Button', {
                                    props:{
                                        type: 'error',
                                        size: 'large'
                                    },
                                    style:{
                                        height: '30px',
                                        fontSize: '15px',
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_delete = true;
                                            this.deleting_index = params.index;
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                columns2: [
                    {
                        title: '学/工号',
                        key: 'userId',
                        align: 'center',
                        width: '150',
                        tooltip: true
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        width: '150',
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
                        render: (h, params) => {
                            if(params.index != 0){
                                return h('div', {}, [
                                    h('Button', {
                                        props:{
                                            type: 'error',
                                            size: 'large'
                                        },
                                        on: {
                                            click: () => {
                                                this.data_list.splice(params.index, 1)
                                            }
                                        }
                                    }, '删除')
                                ])
                            }

                        }
                    }
                ],
                data: [],
                data2: [],
                data_list: [],
            }
        },
        mounted() {
            this.init("初始化成功！");
        },
        methods: {
            init(index){
                this.data = []
                this.loading = true;
                this.data_list = []
                this.data_list.push({
                    userId: localStorage.getItem('userid'),
                    name: localStorage.getItem('username'),
                    department: ''
                })
                axios({
                    url: apiRoot + '/user/info?userId=' + localStorage.getItem('userid'),
                    method: 'get'
                }).then((res) => {
                    if (res.data.code === 200) {
                        this.$set(this.data_list[0], 'department', res.data.data.department)
                    }
                }).catch((err) => {})
                axios({
                    url: apiRoot + '/user/myGroupList',
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.forEach((item) => {
                            this.data.push(item)
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
            refresh(){
                this.init("刷新成功！")
            },
            searchUserInfo(value) {
                this.data2 = ['查询中...']
                if (value.length === 8) {
                    axios({
                        url: apiRoot + '/user/info?userId=' + value,
                        method: 'get'
                    }).then((res) => {
                        if (res.data.code === 200) {
                            this.userInfo.userId = res.data.data.userId;
                            this.userInfo.name = res.data.data.name;
                            this.userInfo.department = res.data.data.department
                            if(res.data)
                                this.data2 = !value ? [] : [
                                    res.data.data.userId + '-' + res.data.data.name + '-' + res.data.data.department
                                ];
                        }
                        else {
                            this.data2 = ['暂无此人']
                        }
                    }).catch(() => {
                        this.data2 = ['查询失败']
                    })
                } else {
                    this.data2 = ['请输入正确的学号']
                }
            },
            selectUserInfo(value) {
                if (value === '请输入正确的学号' || value === '查询失败' || value === '暂无此人' || value === '查询中...') {
                    this.userid = ''
                } else {
                    var id = value.split("-")[0]   //用户学/工号
                    var name = value.split("-")[1]
                    var department = value.split("-")[2]

                    this.userInfo.userId = id;
                    this.userInfo.name = name;
                    this.userInfo.department = department
                    setTimeout(() => {
                        this.userid = id
                    })
                }
            },
            add(){
                let pd = false;
                if(this.data2[0] == '请输入正确的学号' || this.data2[0] === '查询失败' || this.data2[0] === '暂无此人' || this.data2[0] === '查询中...' || this.data2[0] === undefined){
                    this.$Message.error("请输入有效的学/工号！")
                }else{
                    this.data_list.forEach((item) => {
                        if(item.userId == this.userInfo.userId){
                            this.$Message.error('该用户已存在！')
                            pd = true
                        }
                    })
                    console.log(this.data2[0])
                    if(pd == false){
                        this.data_list.push({
                            userId: this.userInfo.userId,
                            name: this.userInfo.name,
                            department: this.userInfo.department
                        })
                    }
                }
            },
            createGroup(){
                this.loading_create = true;
                let userlist = [];
                this.data_list.forEach((item) => {
                    userlist.push(item.userId)
                })
                if(this.groupName === ''){
                    this.$Message.error('请填写群组名称！')
                    this.loading_create = false
                }else{
                    axios({
                        url: apiRoot + '/user/groupCreation',
                        method: 'post',
                        data: {
                            name: this.groupName,
                            userList: userlist
                        }
                    }).then((res) => {
                        if(res.data.code == 200){
                            this.$Message.success("创建成功！");
                            this.init("刷新成功！")
                            this.loading_create = false
                            this.modal_create = false
                        }else{
                            this.$Message.error(res.data.message)
                            this.loading_create = false
                        }
                    }).catch((err) => {
                        this.$Message.error("创建失败，请检查网络连接！")
                        this.loading_create = false
                    })
                }

            },
            updateGroupName(){
                this.loading_update = true
                if(this.groupName == ''){
                    axios({
                        url: apiRoot + '/user/groupNameUpdate',
                        method: 'post',
                        data: {
                            id: this.data[this.update_index].id,
                            name: this.groupUpdateName
                        }
                    }).then((res) => {
                        if(res.data.code == 200){
                            this.$Message.success("修改群组名称成功！");
                            this.loading_update = false;
                            this.modal_update = false;
                            this.init("刷新成功！")
                        }else{
                            this.$Message.error(res.data.message)
                            this.loading_update = false;
                        }
                    }).catch((err) => {
                        this.$Message.error("修改群组名称失败，请检查网络连接！")
                        this.loading_update = false
                    })
                }else{
                    this.$Message.error("请填写群组名称！")
                    this.loading_update = false
                }
            },
            groupDelete(){
                this.loading_delete = true;
                axios({
                    url: apiRoot + '/user/groupDeletion?id=' + this.data[this.deleting_index].id,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        this.$Message.success("删除群组成功！")
                        this.loading_delete = false;
                        this.modal_delete = false
                        this.init("刷新成功！")
                    }else{
                        this.$Message.error(res.data.message)
                        this.loading_delete = false;
                    }
                }).catch((err) => {
                    this.$Message.error("删除群组失败，请检查网络连接！")
                    this.loading_delete = false;
                })
            }
        }
    }
</script>

<style scoped lang="scss">
  @import 'myGroup';
</style>
