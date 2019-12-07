<template>
  <Tabs size="default">
    <TabPane label="部门公告" icon="ios-alert">
      <Row>
        <div class="button2">
          <Button type="success" class="refresh_button" @click="refresh">刷新</Button>
          <Button type="primary" @click="modal_create=true,notice_create=''">发布公告</Button>
          <Modal v-model="modal_create" title="发布公告">
            <p style="font-size: 15px; margin-bottom: 10px">请输入您要发布的部门公告：</p>
            <Input placeholder="请输入公告"  v-model="notice_create" maxlength="100" size="large" :rows="4" show-word-limit type="textarea"></Input>
            <div slot="footer">
              <Button size="large" @click="modal_create=false">取消</Button>
              <Button size="large" :loading="create_loading" type="primary" @click="createNotice">提交</Button>
            </div>
          </Modal>
        </div>
      </Row>
      <Row>
        <Table
          size="large"
          no-data-text="当前没有公告"
          stripe border
          :loading="loading1"
          height="650"
          :columns="columns1" :data="data1"></Table>
        <Modal v-model="modal_update" title="修改公告(请注意：修改公告将会更改发布时间！！！！)">
          <p style="font-size: 15px; margin-bottom: 10px">请修改部门公告:</p>
          <Input placeholder="请输入公告"  v-model="notice_create" maxlength="100" size="large" :rows="4" show-word-limit type="textarea"></Input>
          <div slot="footer">
            <Button size="large" @click="modal_update=false">取消</Button>
            <Button size="large" :loading="update_loading" type="primary" @click="updateNotice">提交</Button>
          </div>
        </Modal>
        <Modal v-model="modal_delete"  width="360">
          <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>删除确认</span>
          </p>
          <div style="text-align:center">
            <p>在进行此操作后，该公告将会被删除</p>
            <p>您确定要删除么</p>
          </div>
          <div slot="footer">
            <Button type="error" size="large" :loading="delete_loading" long @click="deleteAnnouncement">删除</Button>
          </div>
        </Modal>
      </Row>
    </TabPane>
    <TabPane label="系统公告" icon="md-alert">
      <Row>
        <div class="button2">
          <Button type="success" class="refresh_button" @click="refresh">刷新</Button>
        </div>
      </Row>
      <Row>
        <Table
          size="large"
          no-data-text="当前没有公告"
          stripe border
          :loading="loading2"
          height="650"
          :columns="columns2" :data="data2"></Table>
      </Row>
    </TabPane>
  </Tabs>
</template>

<script>
    import axios from 'axios'
    export default{
        name: 'announceManager',
        data(){
            return{
                modal_create: false,
                modal_update: false,
                modal_delete: false,
                loading1: false,
                loading2: false,
                create_loading: false,
                update_loading: false,
                delete_loading: false,
                notice_create: '',
                notice_update_number: 0,
                notice_delete_number: 0,
                columns1: [
                    {
                        title: '部门公告',
                        key: 'content',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '最近修改时间',
                        key: 'time',
                        align: 'center',
                        width: 350,
                        tooltip: true
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
                                        type: 'info'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        height: '30px',
                                        fontSize: '15px',
                                        borderColor: 'white',
                                    },
                                    on: {
                                        click: () => {
                                            this.updateAnnouncement(params.index)
                                            this.notice_create = this.data1[params.index].content;
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                    },
                                    style: {
                                        height: '30px',
                                        backgroundColor: '#FF7F50',
                                        borderColor: 'white',
                                        fontSize: '15px'
                                    },
                                    on: {
                                        click: () => {
                                            this.notice_delete_number = params.index;
                                            this.modal_delete = true;
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                columns2: [
                    {
                        title: '系统公告',
                        key: 'content',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '发布时间',
                        key: 'time',
                        align: 'center',
                        width: 350,
                        tooltip: true
                    }
                ],
                data1: [],
                data2: [],


            }
        },
        mounted() {
            this.init("初始化成功!")
        },
        methods:{
            init(index){
                this.loading1 = true;
                this.loading2 = true;
                this.data1 = [];
                this.data2 = [];
                axios({
                    url: apiRoot + '/user/noticeList?kind=2',
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.forEach((item) => {
                            if(item.kind == 1) this.data1.push(item)
                            else this.data2.push(item)
                        })
                        this.$Message.success(index);
                    }else{
                        this.$Message.error(res.data.message);
                    }
                }).catch((err) => {
                    this.$Message.error("获取公告列表失败，请检查网络连接！");
                })
                this.loading1 = false;
                this.loading2 = false;
            },
            refresh(){
                this.init("刷新成功!")
            },
            createNotice(){
                this.create_loading = true;
                    if(!this.notice_create){
                        this.$Message.error("无法发布内容为空的公告!");
                        this.create_loading = false;
                    }else{
                        axios({
                            url: apiRoot + '/manager/noticeCreation',
                            method: 'post',
                            data:{
                                content: this.notice_create
                            }
                        }).then((res) => {
                            if(res.data.code == 200){
                                this.$Message.success("发布成功!");
                                this.init("刷新成功");
                                this.modal_create = false;
                                this.create_loading = false;
                            }else{
                                this.$Message.error(res.data.message);
                                this.modal_create = false;
                                this.create_loading = false;
                            }
                        }).catch(err =>{
                            this.$Message.error("发布失败，请检查网络连接");
                            this.modal_create = false;
                            this.create_loading = false;
                        })
                }
            },
            updateAnnouncement(index){
                this.notice_update_number = index;
                this.modal_update = true;
            },
            updateNotice(){
                this.update_loading = true;
                if(this.notice_create == ''){
                    this.$Message.error("无法发布内容为空的公告!")
                }else{
                    axios({
                        url: apiRoot + '/manager/noticeUpdate',
                        method: 'post',
                        data:{
                            content: this.notice_create,
                            id: this.data1[this.notice_update_number].id
                        }
                    }).then((res) => {
                        if(res.data.code == 200){
                            this.$Message.success("公告更新成功！")
                            this.init("刷新成功");
                            this.update_loading = false;
                            this.modal_update = false;
                        }else{
                            this.$Message.error(res.data.message)
                            this.update_loading = false;
                            this.modal_update = false;
                        }
                    }).catch((err) => {
                        this.$Message.error("公告更新失败,请检查网络连接！")
                        this.update_loading = false;
                        this.modal_update = false;
                    })
                }
            },
            deleteAnnouncement(index){
                this.delete_loading = true;
                axios({
                    url: apiRoot + '/manager/noticeDeletion?id=' + this.data1[this.notice_delete_number].id,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        this.$Message.success("删除成功！")
                        this.init("刷新成功！")
                        this.delete_loading = false;
                        this.modal_delete = false;
                    }else{
                        this.$Message.error(res.data.message);
                        this.delete_loading = false;
                        this.modal_delete = false;
                    }
                }).catch((err) => {
                    this.$Message.error("删除失败,请检查网络连接");
                    this.delete_loading = false;
                    this.modal_delete = false;
                })
            },
        }
    }
</script>

<style scoped lang="scss">
  @import 'announceManager';
</style>
