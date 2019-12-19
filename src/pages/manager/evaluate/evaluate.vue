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
      <Modal v-model="modal_create" width="600" :closable="false">
        <div>
          <Card style="margin-bottom: 25px">
            <p>
              <span>您的评价：</span>
              <Tag v-for="item in tagList"
                   :key="item.id" :name="item.id"
                   size="large"  closable @on-close="handleClose">{{item.name}}</Tag>
            </p>
          </Card>
          <Table
            size="default"
            no-data-text="没有可供选择的标签"
            stripe border
            :loading="loading2"
            height="300"
            :columns="columns2" :data="data2">
          </Table>
        </div>
        <div slot="footer">
          <Button size="large" @click="modal_create=false">取消</Button>
          <Button size="large" type="primary" :loading="loading_create" @click="create">评价</Button>
        </div>
      </Modal>
      <Modal v-model="modal_update" width="600" :closable="false">
        <div>
          <Card style="margin-bottom: 25px">
            <p>
              <span>您的评价：</span>
              <Tag v-for="item in tagList"
                   :key="item.id" :name="item.id"
                   size="large"  closable @on-close="handleClose2">{{item.name}}</Tag>
            </p>
          </Card>
          <Table
            size="default"
            no-data-text="没有可供选择的标签"
            stripe border
            :loading="loading3"
            height="300"
            :columns="columns3" :data="data3">
          </Table>
        </div>
        <div slot="footer">
          <Button size="large" @click="modal_update=false">取消</Button>
          <Button size="large" type="primary" :loading="loading_update" @click="update">修改评价</Button>
        </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
    import axios from 'axios'
    import expandRow from './table-expand'

    export default {
        name: 'evaluate',
        components: { expandRow },
        data() {
            return{
                loading: false,
                loading2: false,
                loading3: false,
                loading_create: false,
                loading_update: false,
                roomName: '',
                create_index: 0,
                update_index: 0,
                modal_create: false,
                modal_update: false,
                tagList: [],
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
                        title: '状态',
                        key: 'progress',
                        align: 'center',
                        tooltip: true,
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        width: 250,
                        render: (h, params) => {
                            if(this.data[params.index].progress == '待评价')
                            {
                                return h('div',
                                    [h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'large'
                                        },
                                        on: {
                                            click: () => {
                                                this.create_index = params.index
                                                this.modal_create = true;
                                                this.getTagList();
                                            }
                                        }
                                    }, '评价')]
                                )
                            }else return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'large'
                                    },
                                    on: {
                                        click: () => {
                                            this.update_index = params.index
                                            this.modal_update = true;
                                            this.getTagList2();
                                        }
                                    }
                                }, '修改评价')
                            ])

                        }
                    }
                ],
                columns2:[
                    {
                        title: '标签名',
                        key: 'name',
                        align: 'center',
                        tooltip: true,
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        width: 250,
                        render: (h, params) => {
                            if(this.data2[params.index].num == false)
                            {
                                return h('div',
                                    [h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'default',
                                        },
                                        on: {
                                            click: () => {
                                                if(this.tagList.length <= 2){
                                                    this.tagList.push(this.data2[params.index])
                                                    this.data2[params.index].num = true
                                                }else{
                                                    this.$Message.error("您最多选择三个标签进行评价")
                                                }
                                            }
                                        }
                                    }, '选择')]
                                )
                            }else return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'default',
                                        disabled: true
                                    }
                                }, '已选择')
                            ])

                        }
                    }
                ],
                columns3:[
                    {
                        title: '标签名',
                        key: 'name',
                        align: 'center',
                        tooltip: true,
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        width: 250,
                        render: (h, params) => {
                            if(this.data3[params.index].num == false)
                            {
                                return h('div',
                                    [h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'default',
                                        },
                                        on: {
                                            click: () => {
                                                if(this.tagList.length <= 2){
                                                    this.tagList.push(this.data3[params.index])
                                                    this.data3[params.index].num = true
                                                }else{
                                                    this.$Message.error("您最多选择三个标签进行评价")
                                                }
                                            }
                                        }
                                    }, '选择')]
                                )
                            }else {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'default',
                                            disabled: true
                                        }
                                    }, '已选择')
                                ])
                            }
                        }
                    }
                ],
                data: [],
                data2: [],
                data3: []
            }
        },
        mounted() {
            this.init("初始化成功！", '');
        },
        methods: {
            init(index,type){
                this.data = []
                this.loading = true;
                axios({
                    url: apiRoot + '/manager/appointmentTagList',
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
            getTagList(){
                this.data2 = []
                this.tagList = []
                axios({
                    url: apiRoot + '/user/tagList',
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.forEach((item) => {
                            item.newParams = 'num';
                            item.num = false;
                            this.data2.push(item)
                        })
                    }else{
                        this.$Message.error(res.data.message)
                    }
                }).catch((err) => {
                    this.$Message.error("获取标签列表失败，请检查网络连接！")
                })
            },
            getTagList2(){
                this.data3 = []
                this.tagList = []
                axios({
                    url: apiRoot + '/user/tagList',
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.forEach((item) => {
                            item.newParams = 'num';
                            item.num = false;
                            this.data3.push(item)
                        })
                    }else{
                        this.$Message.error(res.data.message)
                    }
                }).catch((err) => {
                    this.$Message.error("获取标签列表失败，请检查网络连接！")
                })
            },
            handleClose(event, name){
                this.data2.forEach((item) => {
                    if(item.id == name){
                        item.num = false
                    }
                })
                let index = 0;
                for(let i = 0; i < this.tagList.length; i++){
                    if(this.tagList[i].id == name){
                        index = i
                    }
                }
                this.tagList.splice(index, 1);
            },
            handleClose2(event, name){
                this.data3.forEach((item) => {
                    if(item.id == name){
                        item.num = false
                    }
                })
                let index = 0;
                for(let i = 0; i < this.tagList.length; i++){
                    if(this.tagList[i].id == name){
                        index = i
                    }
                }
                this.tagList.splice(index, 1);
            },
            create(){
                this.loading_create = true;
                let arr = []
                this.tagList.forEach((item) => {
                    arr.push(item.name)
                })
                if(this.tagList.length == 0){
                    this.$Message.error("请至少选择一个标签！")
                    this.loading_create = false;
                    return
                }
                axios({
                    url: apiRoot + '/manager/evaluation',
                    method: 'post',
                    data: {
                        tagNameList: arr,
                        applicationId: this.data[this.create_index].id
                    }
                }).then((res) => {
                    if(res.data.code == 200){
                        this.$Message.success("评价成功！")
                        this.loading_create = false;
                        this.modal_create = false;
                        this.init("刷新成功！", '')
                    }else{
                        this.$Message.error(res.data.message)
                        this.loading_create = false;
                    }
                }).catch((err) => {
                    this.$Message.error("提交评价失败，请检查网络连接！")
                    this.loading_create = false;
                })
            },
            update(){
                this.loading_update = true;
                let arr = []
                this.tagList.forEach((item) => {
                    arr.push(item.name)
                })
                if(this.tagList.length == 0){
                    this.$Message.error("请至少选择一个标签！")
                    this.loading_update = false;
                    return
                }
                axios({
                    url: apiRoot + '/manager/tagUpdate',
                    method: 'post',
                    data: {
                        tagNameList: arr,
                        applicationId: this.data[this.update_index].id
                    }
                }).then((res) => {
                    if(res.data.code == 200){
                        this.$Message.success("修改评价成功！")
                        this.loading_update = false;
                        this.modal_update = false;
                        this.init("刷新成功！", '')
                    }else{
                        this.$Message.error(res.data.message)
                        this.loading_update = false;
                    }
                }).catch((err) => {
                    this.$Message.error("提交评价失败，请检查网络连接！")
                    this.loading_update = false;
                })
            }
        }
    }
</script>

<style scoped lang="scss">
  @import 'evaluate';
</style>
