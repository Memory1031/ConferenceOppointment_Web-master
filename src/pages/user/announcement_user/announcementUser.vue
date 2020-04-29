<template>
  <div style="height: 90vh !important;">
    <Tabs size="default">
      <TabPane label="部门公告">
        <Row>
          <div class="button2">
            <Button type="success" class="refresh_button" @click="refresh">刷新</Button>
          </div>
        </Row>
        <Row>
          <Table class="table"
                 size="large"
                 no-data-text="当前没有公告"
                 stripe border
                 :loading="loading1"
                 height="650"
                 :columns="columns1" :data="data1"></Table>
        </Row>
      </TabPane>
      <TabPane label="系统公告">
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
  </div>

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
                        title: '发布时间',
                        key: 'date',
                        align: 'center',
                        width: 350,
                        tooltip: true
                    },
                    {
                        title: '部门公告',
                        key: 'content',
                        align: 'center',
                        tooltip: true
                    }
                ],
                columns2: [
                    {
                        title: '发布时间',
                        key: 'date',
                        align: 'center',
                        width: 350,
                        tooltip: true
                    },
                    {
                        title: '系统公告',
                        key: 'content',
                        align: 'center',
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
                            let date = item.time.replace("年", '/').replace("月", '/').replace("日", '')
                            item['date'] = date;
                            if(item.kind == 1) this.data1.push(item)
                            else this.data2.push(item)
                        })
                        this.$Message.success(index);
                        this.loading1 = false;
                        this.loading2 = false;
                    }else{
                        this.$Message.error(res.data.message);
                        this.loading1 = false;
                        this.loading2 = false;
                    }
                }).catch((err) => {
                    this.$Message.error("获取公告列表失败，请检查网络连接！");
                    this.loading1 = false;
                    this.loading2 = false;
                })
            },
            refresh(){
                this.init("刷新成功!")
            }
        }
    }
</script>

<style scoped lang="scss">
  @import 'announcementUser';
</style>

