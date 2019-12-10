<template>
  <div>
    <Row>
      <div class="button">
        <Select v-model="data_search.campus" style="width:150px" size="large" placeholder="请选择校区" clearable>
          <Option v-for="item in campusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <AutoComplete v-model="data_search.departmentName" placeholder="请填写部门(选填)"
                      :data="data3" clearable :filter-method="filterMethod"
                      style="width: 230px" size="large"></AutoComplete>
        <Input v-model="data_search.building" placeholder="请输入大楼名称(选填)"
               style="width: 200px" size="large" clearable></Input>
        <InputNumber v-model="data_search.minSeats" placeholder="请输入最小座位数(默认0)"
               style="width: 200px" size="large" clearable></InputNumber>
        <Checkbox v-model='data_search.isMultifunc' :label="1" size="large">
          <span>多功能室</span>
        </Checkbox>
        <Checkbox v-model='data_search.hasSpeaker' :label="1" size="large">
          <span>有扩音设备</span>
        </Checkbox>
        <Button type="success" class="refresh_button" @click="searchConference">查询</Button>
      </div>
    </Row>
    <Row>
      <Table
        size="large"
        no-data-text="无法检索到符合条件的会议室"
        stripe border
        :loading="loading"
        height="700"
        :columns="columns" :data="data"></Table>
    </Row>

  </div>
</template>

<script>
    import axios from 'axios'
    import expandRow from './table-expand'

    export default{
        name: 'Oppconference',
        components: { expandRow },
        data(){
            return{
                loading: false,
                campusList:[
                    {
                        value: '宝山',
                        label: '宝山校区'
                    },
                    {
                        value: '嘉定',
                        label: '嘉定校区'
                    },
                    {
                        value: '延长',
                        label: '延长校区'
                    }
                ],
                columns: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row,
                                    departmentName: this.data[params.index].department
                                }
                            })
                        }
                    },
                    {
                        title: '大楼名称',
                        key: 'building',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '房间号',
                        key: 'name',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '管理部门',
                        key: 'department',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '座位数',
                        key: 'seatnumber',
                        align: 'center',
                        tooltip: true,
                        sortable: true
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
                                        type: 'primary',
                                        size: 'large'
                                    },
                                    style: {
                                        // height: '30px',
                                        // backgroundColor: '#FF7F50',
                                        // borderColor: 'white',
                                        // fontSize: '15px'
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
                                }, '申请')
                            ])
                        }
                    }
                ],
                data: [],
                device: [],
                data_search: {
                    campus: '', //校区,宝山|嘉定|延长  不可以为空
                    building: '',//可以为空
                    departmentName: '',//部门名字，可以为空
                    minSeats: 0,//最小座位数,默认为0
                    isMultifunc: false,//多功能厅
                    hasSpeaker: false//有扩音设备
                },
                data3: []
            }
        },
        mounted(){
            this.init("初始化成功!", null);
        },
        methods:{
            init(index, name){
                this.loading = true;
                this.data = [];
                this.data3 = [];
                this.getDepartment()
                if(name == null){
                    var data_search2 = {
                        campus: '', //校区,宝山|嘉定|延长  不可以为空
                        building: '',//可以为空
                        departmentName: '',//部门名字，可以为空
                        minSeats: 0,//最小座位数,默认为0
                        isMultifunc: '',//多功能厅
                        hasSpeaker: ''
                    }
                    axios({
                        url: apiRoot + "/user/conferenceSearch",
                        method: 'post',
                        data: data_search2
                    }).then((res) => {
                        if(res.data.code == 200){
                            res.data.data.forEach((item) => {
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
                }else{
                    if(!name.campus) name.campus = '';
                    if(!name.building) name.building = '';
                    if(!name.depatmentName) name.departmentName = '';
                    name.isMultifunc = name.isMultifunc ? 1 : 0;
                    name.hasSpeaker = name.hasSpeaker ? 1 : 0;
                    axios({
                        url: apiRoot + "/user/conferenceSearch",
                        method: 'post',
                        data: name
                    }).then((res) => {
                        if(res.data.code == 200){
                            res.data.data.forEach((item) => {
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
                }
            },
            getDepartment(){
                axios({
                    url: apiRoot + '/user/departmentList',
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.forEach((item) => {
                            this.data3.push(item.departmentName)
                        })
                        // console.log(this.data3)
                    }
                })
            },
            searchConference(){
                this.init("检索成功", this.data_search)
                console.log(this.data_search)
            },
            filterMethod (value, option) {
                if(value == '')return false
                return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
            }
        }
    }
</script>

<style scoped lang="scss">
  @import 'Oppconference';
</style>

