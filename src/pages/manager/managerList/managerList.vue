<template>
  <div>
    <Row>
      <div class="button">
        <Button type="success" class="refresh_button" @click="refresh">刷新</Button>
        <Button type="primary" @click="modal_create=true">新增普通管理员</Button>
        <Modal v-model="modal_create" width="1000px">
          <Button type="dashed" size="large" @click="handleAdd" icon="md-add" style="margin-top: 5px;text-align: center;">添加</Button>
          <Card v-for="(item,index) in items" :key="index" style="width: 70%;margin: 20px auto 0 auto">
            <p slot="title">
              <Icon type="ios-people"/>
              普通管理员{{index + 1}}
            </p>
            <div slot="extra">
              <Button type="error" size="small" @click="delPartner(index)">删除</Button>
            </div>
            <Form :label-width="120" style="width: 100%">
              <FormItem label="学/工号" prop="item.userId">
                <AutoComplete v-model="item.userId" @on-search='searchUserInfo'
                              @on-select="selectUserInfo(index,data2[0])"
                              :data="data2"
                              clearable
                              placeholder="输入学/工号"></AutoComplete>
              </FormItem>
              <FormItem label="姓名" prop="item.ame">
                <Input v-model="item.name" disabled clearable placeholder="输入姓名"></Input>
              </FormItem>
              <FormItem label="部门" prop="item.department">
                <Input v-model="item.department" disabled clearable placeholder="输入部门"></Input>
              </FormItem>
            </Form>
          </Card>
          <div slot="footer">
            <Button size="large" @click="modal_create=false">取消</Button>
            <Button size="large" :loading="create_loading" type="primary" @click="createManager">提交</Button>
          </div>
        </Modal>
      </div>
    </Row>
    <Row>
      <Table
        size="large"
        no-data-text="本部门暂无其他普通管理员"
        stripe border
        :loading="loading"
        height="700"
        :columns="columns" :data="data"></Table>
      <Modal v-model="modal_delete"  width="550">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>取消资格确认</span>
        </p>
        <div style="text-align:center;font-size: 16px;">
          <img src="../../../assets/img/error.png" width="100">
          <br/><br/>
          <p>在进行此操作后，<span id="manager-name"></span>将会被取消普通管理员资格</p>
          <p>您确定要删除么</p>
        </div>
        <div slot="footer">
          <Button type="error" size="large" :loading="delete_loading" long @click="del">删除</Button>
        </div>
      </Modal>
    </Row>

  </div>
</template>

<script>
    import axios from 'axios'
    import download from '../../../assets/js/download'

    export default{
        name: 'managerList',
        data(){
            return{
                loading: false,
                modal_create: false,
                modal_delete: false,
                create_loading: false,
                delete_loading: false,
                deletingManager: 0,
                uploadHeaders: {
                    Authorization: localStorage.getItem('token')
                },
                deleteNumber: 0,
                items: [
                    {
                        userId: '',
                        name: '',
                        department: ''
                    }
                ],
                columns: [
                    {
                        title: '学/工号',
                        key: 'userId',
                        align: 'center',
                        width: 150,
                        tooltip: true
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center',
                        width: 150,
                        tooltip: true
                    },
                    {
                        title: '部门',
                        key: 'department',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '手机',
                        key: 'phone',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '邮箱',
                        key: 'email',
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
                                        type: 'error',
                                    },
                                    style: {
                                        height: '30px',
                                        // backgroundColor: '#FF7F50',
                                        // borderColor: 'white',
                                        fontSize: '15px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_delete = true;
                                            console.log(params.index)
                                            this.deletingManager = params.index
                                            this.$nextTick(()=>{
                                                document.querySelector("#manager-name").innerHTML = this.data[this.deletingManager].name;
                                            })
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                data: [],
                data2: []
            }
        },
        mounted(){
            this.init("初始化成功!");
        },
        methods:{
            init(index){
                this.loading = true;
                this.data = [];
                let userId = localStorage.getItem('userid');
                axios({
                    url: apiRoot + "/manager/managerList",
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.forEach((item) => {
                            item.phone = item.phone ? item.phone : '未填写';
                            item.email = item.email ? item.email : '未填写';
                            if(item.userId != userId)
                            this.data.push(item);
                        })
                        this.$Message.success(index);
                        this.loading = false;
                    } else {
                        this.$Message.error(res.data.message);
                        this.loading = false
                    }
                }).catch((err) => {
                    console.error(err)
                    this.$Message.error("请检查网络连接！");
                    this.loading = false
                })
            },
            refresh(){
                this.init('刷新成功！');
            },
            delPartner(index) {
                this.items.splice(index, 1)
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
                    this.items[index].userId = ''
                    this.items[index].name = ''
                    this.items[index].department = ''
                } else {
                    var id = value.split("-")[0]   //用户学/工号
                    var name = value.split("-")[1] //用户姓名
                    var dep = value.split("-")[2]  //用户部门
                    setTimeout(() => {
                        this.items[index].userId = id
                        this.items[index].name = name
                        this.items[index].department = dep
                    })
                }
            },
            handleAdd() {
                this.items.push({
                    userId: '',
                    name: '',
                    department: '',
                })
            },
            del(){
                this.delete_loading = true;
                axios({
                    url: apiRoot + '/manager/managerDeletion?userId=' + this.data[this.deletingManager].userId,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        this.$Message.success("删除成功！");
                        this.delete_loading = false;
                        this.modal_delete = false;
                        this.init("刷新成功！")
                    }else{
                        this.$Message.error(res.data.message);
                        this.delete_loading = false;
                        this.modal_delete = false;
                        this.init("刷新成功！")
                    }
                }).catch((err) => {
                    this.$Message.error('删除失败，请检查网络连接！');
                    this.delete_loading = false;
                    this.modal_delete = false;
                })
            },
            createManager(){
                // console.log(this.data)
                this.create_loading = true;
                axios({
                    url: apiRoot + '/manager/managerSetting',
                    method: 'post',
                    data:{
                        userList : this.items
                    }
                }).then((res) => {
                    if(res.data.code == 200){
                        this.$Message.success("新增管理员成功！");
                        this.create_loading = false;
                        this.modal_create = false;
                        this.items = [
                            {
                                name: '',
                                userId: '',
                                department: ''
                            }
                        ]
                        this.init("刷新成功！")
                    }else{
                        this.$Message.error(res.data.message)
                        this.create_loading = false;
                    }
                }).catch((err) => {
                    this.$Message.error("操作失败，请检查网络连接！");
                    this.create_loading = false;
                })
            }
        }
    }
</script>

<style scoped lang="scss">
  @import 'managerList';
</style>
