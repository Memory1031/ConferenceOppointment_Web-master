<template>
  <Tabs size="default">
    <TabPane label="部门公告" icon="ios-alert">
      <Row>
        <div class="button2">
          <Button type="success" class="refresh_button" @click="refresh">刷新</Button>
          <Button type="primary" @click="modal_create=true">发布公告</Button>
          <Modal v-model="modal_create" title="发布公告">
            <p style="font-size: 15px; margin-bottom: 10px">请输入您要发布的部门公告:</p>
            <Input placeholder="请输入公告"  v-model="notice_create" maxlength="100" size="large" :rows="4" show-word-limit type="textarea"></Input>
            <div slot="footer">
              <Button  size="large" @click="modal_create=false">取消</Button>
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
      </Row>
    </TabPane>
    <TabPane label="系统公告" icon="md-alert">标签二的内容</TabPane>
  </Tabs>

</template>

<script>
    import axios from 'axios'
    export default{
        name: 'announceManager',
        data(){
            return{
                modal_create: false,
                modal_delete: false,
                loading1: false,
                loading2: false,
                create_loading: false,
                notice_create: '',
                columns1: [
                    {
                        title: '公告',
                        key: 'content',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '最近修改时间',
                        key: 'Date',
                        align: 'center',
                        width: 200,
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
                                            this.deleteAnnouncement(params.index)
                                        }
                                    }
                                }, '删除')
                            ])
                        }
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
                // axios({
                //     url: apiRoot + '/user/noticeList?kind=2',
                //     method: 'get'
                // }).then((res) => {
                //     console.log(res.data.data)
                // })
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

            },
            deleteAnnouncement(index){

            },
        }
    }
</script>

<style scoped lang="scss">
  @import 'announceManager';
</style>
