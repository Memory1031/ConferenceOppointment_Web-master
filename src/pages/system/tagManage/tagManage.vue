<template>
  <div>
    <Row>
      <div class="button">
        <Button type="success" class="refresh_button" @click="refresh">刷新</Button>
        <Button type="primary" @click="modal_create=true">创建标签</Button>
        <Modal v-model="modal_create" width="400px" title="创建标签">
          <Card>
            <div style="text-align: center">
              <span style="font-size: 16px">标签名：</span>
              <Input v-model="tag_name" size="large" clearable style="width: 250px"></Input>
            </div>

          </Card>
          <div slot="footer">
            <Button size="large" @click="modal_create=false">取消</Button>
            <Button size="large" :loading="create_loading" type="primary" @click="createTag">创建</Button>
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
          <span>删除确认</span>
        </p>
        <div style="text-align:center;font-size: 16px;">
          <img src="../../../assets/img/error.png" width="100">
          <br/><br/>
          <p>在进行此操作后，该标签将会被删除</p>
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

    export default{
        name: 'tagManage',
        data(){
            return{
                loading: false,
                modal_create: false,
                modal_delete: false,
                create_loading: false,
                delete_loading: false,
                deletingTag: 0,
                tag_name: '',
                columns: [
                    {
                        title: '标签名',
                        key: 'name',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '最后修改人',
                        key: 'creatorName',
                        align: 'center',
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
                                        type: 'error',
                                    },
                                    style: {
                                        height: '30px',
                                        fontSize: '15px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_delete = true;
                                            this.deletingTag = params.index
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                data: [],
            }
        },
        mounted(){
            this.init("初始化成功!");
        },
        methods:{
            init(index){
                this.loading = true;
                this.data = [];
                axios({
                    url: apiRoot + "/user/tagList",
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.forEach((item) => {
                            this.data.push(item)
                        })
                        this.$Message.success(index);
                        this.loading = false;
                    } else {
                        this.$Message.error(res.data.message);
                        this.loading = false
                    }
                }).catch((err) => {
                    this.$Message.error("请检查网络连接！");
                    this.loading = false
                })
            },
            refresh(){
                this.init('刷新成功！');
            },
            del(){
                this.delete_loading = true;
                axios({
                    url: apiRoot + '/system/tagDeletion?id=' + this.data[this.deletingTag].id,
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
            createTag(){
                // console.log(this.data)
                this.create_loading = true;
                axios({
                    url: apiRoot + '/system/tagCreation?name=' + this.tag_name,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        this.$Message.success("创建标签成功！");
                        this.create_loading = false;
                        this.modal_create = false;
                        this.tag_name = '';
                        this.init("刷新成功！")
                    }else{
                        this.$Message.error(res.data.message)
                        this.create_loading = false;
                    }
                }).catch((err) => {
                    this.$Message.error("创建失败，请检查网络连接！");
                    this.create_loading = false;
                })
            }
        }
    }
</script>

<style scoped lang="scss">
  @import 'tagManage';
</style>
