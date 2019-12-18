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
      <Modal v-model="modal_delete" width="600" :closable="false">
        <div  style="text-align: center" >
          <img src="../../../assets/img/error.png" width="100">
          <br/>
          <br/>
          <p style="font-size: 200%">确认撤销该申请？</p>
          <br/>
        </div>
        <div slot="footer">
          <Button size="large" @click="modal_delete=false">取消</Button>
          <Button size="large" type="error" :loading="loading_delete" @click="cancel">撤销</Button>
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
                roomName: '',
                modal_delete: false,
                deleting_index: 0,
                loading_delete: false,
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
                        align: 'center',
                        tooltip: true,
                        render: (h,params) => {
                            if (this.data[params.index].progress == '被驳回') {
                                return h('div', {}, [
                                    h('span', {
                                        style: {
                                            color: 'red'
                                        }
                                    }, '已驳回')
                                ])
                            } else if (this.data[params.index].progress == '预约过期') {
                                return h('div', {}, [
                                    h('span', {
                                        style: {
                                            color: '#990000'
                                        }
                                    }, '预约过期')
                                ])
                            } else if (this.data[params.index].progress == '通过审核') {
                                return h('div', {}, [
                                    h('span', {
                                        style: {
                                            color: 'green'
                                        }
                                    }, this.data[params.index].progress)
                                ])
                            } else if (this.data[params.index].progress == '已评价') {
                                return h('div', {}, [
                                    h('span', {
                                        style: {
                                            color: 'deepskyblue'
                                        }
                                    }, this.data[params.index].progress)
                                ])
                            } else if (this.data[params.index].progress == '未审核') {
                                return h('div', {}, [
                                    h('span', {
                                        style: {
                                            color: '#0000FF'
                                        }
                                    }, '申请中')
                                ])
                            } else if (this.data[params.index].progress == '用户取消') {
                                return h('div', {}, [
                                    h('span', {
                                        style: {
                                            color: 'grey'
                                        }
                                    }, '已取消')
                                ])
                            }  else {
                                return h('div', {}, [
                                    h('span', {
                                        style: {
                                            color: 'blue'
                                        }
                                    }, this.data[params.index].progress)
                                ])
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        render: (h, params) => {
                            if(this.data[params.index].progress == '未审核'){
                                return h('div', {}, [
                                    h('Button', {
                                        props:{
                                            type: 'error',
                                            size: 'large'
                                        },
                                        on: {
                                            click: () => {
                                                this.modal_delete = true;
                                                this.deleting_index = params.index;
                                            }
                                        }
                                    }, '取消')
                                ])
                            }
                        }
                    }
                ],
                data: [],
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
                    url: apiRoot + '/user/myAppointment',
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.forEach((item) => {
                            item.newParam = 'time'
                            item.time = item.begintime + '-' + item.endtime
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
            searchForApply() {
                this.init("检索成功！", this.roomName)
            },
            cancel(){
                this.loading_delete = true;
                axios({
                    url: apiRoot + '/user/cancelAppointment?id=' + this.data[this.deleting_index].id,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        this.$Message.success("取消申请成功！");
                        this.loading_delete = false;
                        this.modal_delete = false
                        this.init("刷新成功！", '')
                    }else{
                        this.$Message.error(res.data.message)
                        this.loading_delete = false;
                    }
                }).catch((err) => {
                    this.$Message.error("取消申请失败，请检查网络连接！")
                    this.loading_delete = false;
                })
            }
        }
    }
</script>

<style scoped lang="scss">
  @import 'myOpp';
</style>
