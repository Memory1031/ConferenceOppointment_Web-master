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
        height="650"
        :columns="columns" :data="data"></Table>
      <Page :total="numberOfArr" :page-size="10"
            @on-change="changepage" :current="pageCurrent"
            style="text-align: center"
            show-total show-elevator/>
<!--      <Modal v-model="modal_create" width="600" :closable="false">-->
<!--        <div>-->
<!--          <Card style="margin-bottom: 25px">-->
<!--            <p>-->
<!--              <span>您的评价：</span>-->
<!--              <Tag v-for="item in tagList"-->
<!--                   :key="item.id" :name="item.id"-->
<!--                   size="large"  closable @on-close="handleClose">{{item.name}}</Tag>-->
<!--            </p>-->
<!--          </Card>-->
<!--          <Table-->
<!--            size="default"-->
<!--            no-data-text="没有可供选择的标签"-->
<!--            stripe border-->
<!--            :loading="loading2"-->
<!--            height="300"-->
<!--            :columns="columns2" :data="data2">-->
<!--          </Table>-->
<!--        </div>-->
<!--        <div slot="footer">-->
<!--          <Button size="large" @click="modal_create=false">取消</Button>-->
<!--          <Button size="large" type="primary" :loading="loading_create" @click="create">评价</Button>-->
<!--        </div>-->
<!--      </Modal>-->
<!--      <Modal v-model="modal_update" width="600" :closable="false">-->
<!--        <div>-->
<!--          <Card style="margin-bottom: 25px">-->
<!--            <p>-->
<!--              <span>您的评价：</span>-->
<!--              <Tag v-for="item in tagList"-->
<!--                   :key="item.id" :name="item.id"-->
<!--                   size="large"  closable @on-close="handleClose2">{{item.name}}</Tag>-->
<!--            </p>-->
<!--          </Card>-->
<!--          <Table-->
<!--            size="default"-->
<!--            no-data-text="没有可供选择的标签"-->
<!--            stripe border-->
<!--            :loading="loading3"-->
<!--            height="300"-->
<!--            :columns="columns3" :data="data3">-->
<!--          </Table>-->
<!--        </div>-->
<!--        <div slot="footer">-->
<!--          <Button size="large" @click="modal_update=false">取消</Button>-->
<!--          <Button size="large" type="primary" :loading="loading_update" @click="update">修改评价</Button>-->
<!--        </div>-->
<!--      </Modal>-->
    </Row>
  </div>
</template>

<script>
    import axios from 'axios'
    import expandRow from './table-expand'

    export default {
        name: 'historyManager',
        components: { expandRow },
        data() {
            return{
                loading: false,
                roomName: '',
                numberOfArr: 0,
                pageCurrent: 1,
                nowData: [],
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
                        width: 150,
                        tooltip: true
                    },
                    {
                        title: '房间号',
                        key: 'conferenceName',
                        align: 'center',
                        width: 180,
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
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '身份',
                        key: 'identity',
                        align: 'center',
                        width: 100,
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
                            }else if(this.data[params.index].progress == '预约过期'){
                                return h('div', {}, [
                                    h('span', {
                                        style: {
                                            color: '#990000'
                                        }
                                    }, '预约过期')
                                ])
                            }else if(this.data[params.index].progress == '通过审核'){
                                return h('div', {}, [
                                    h('span', {
                                        style: {
                                            color: 'green'
                                        }
                                    }, this.data[params.index].progress)
                                ])
                            }else if(this.data[params.index].progress == '已评价'){
                                return h('div', {}, [
                                    h('span', {
                                        style: {
                                            color: 'blue'
                                        }
                                    }, this.data[params.index].progress)
                                ])
                            }else{
                                    return h('div', {}, [
                                        h('span', {
                                            style: {
                                                color: 'grey'
                                            }
                                        }, this.data[params.index].progress)
                                    ])
                            }
                        }
                    }
                ],
                data: [],
            }
        },
        mounted() {
            this.init("初始化成功！", '', 0);
        },
        methods: {
            init(index,type, page){
                this.data = []
                if(index == "初始化成功！" || index == "检索成功！") this.numberOfArr = 0;
                this.pageCurrent = page + 1;
                this.loading = true;
                axios({
                    url: apiRoot + '/manager/departmentHistory/' + page + '/10',
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.appointmentHistoryList.forEach((item) => {
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
                        console.log(this.numberOfArr != res.data.data.recordNum)
                        if(this.numberOfArr != res.data.data.recordNum) this.numberOfArr = res.data.data.recordNum
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
                this.init("检索成功！", this.roomName, 0)
            },
            changepage(index) {
                //需要显示开始数据的index,(因为数据是从0开始的，页码是从1开始的，需要-1)
                this.init("获取第" + index + "页数据成功", this.roomName, index - 1);
                //储存当前页
                this.pageCurrent = index;
            },
        }
    }
</script>

<style scoped lang="scss">
  @import 'historyManager';
</style>
