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
        <InputNumber v-model="data_search.minSeats" placeholder="请输入最小座位数(默认0)" :min="0"
               style="width: 200px" size="large" clearable></InputNumber>
        <Checkbox v-model='data_search.isMultifunc' size="large">
          <span>多功能室</span>
        </Checkbox>
        <Checkbox v-model='data_search.hasSpeaker' size="large">
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

      <Modal v-model="modal_apply"  width="1000" :closable="false">
        <Row>
          <Col span="8">
            <Steps :current="current"  direction="vertical">
              <Step title="进行中" v-if="!current" content="请选择预约时间并填写预约理由"></Step>
              <Step title="已完成" v-if="current" content="请选择预约时间并填写预约理由"></Step>
              <Step title="进行中" v-if="current" content="请填写申请人信息"></Step>
              <Step title="未进行" v-if="!current" content="请填写申请人信息"></Step>
            </Steps>
          </Col>
          <Col span="16">
            <Card>
              <Row>
                <Col span="8">
                  <DatePicker type="date" :options="options" placeholder="选择预约日期"
                              show-week-numbers size="large"
                              @on-change="selectTime" style="width: 200px"></DatePicker>
                  <Divider/>
                  <Poptip placement="right" width="400" trigger="hover">
                    <Button>提示</Button>
                    <div slot="content">
                      <div style="text-align: center">
                        <br/>
                        <p style="text-align: center;font-size: 130%">注意：您只能选择连续的时间段进行预约</p>
                        <br/>
                        <p >
                          <span style="color:orange">橘色指该时间段已有人预约，成功概率会下降</span>
                        </p>
                        <br/>
                        <p>
                          <span>无法选中状态指该会议室已被预约</span>
                        </p>
                        <br/>
                      </div>
                    </div>
                  </Poptip>
                  <br/><br/><br/><br/>
                  <p style="font-size: 150%; text-align: center;color: blue" v-if="!isConstant">请选择连续的时间段!</p>
                </Col>
                <Col span="16" style="text-align: center">
                  <CheckboxGroup v-model="chosenTime" size="large">
                    <Checkbox :label="8" border style="margin-bottom:5px;"
                              :style="{'background-color': (manyAva[0] == true ? 'orange':'white'), 'color' : (manyAva[0] == true) ? 'white': 'black'}"
                              :disabled="timePd[0]"><span>08:00-08:50</span></Checkbox>
                    <Checkbox :label="9" border style="margin-bottom:5px"
                              :style="{'background-color': (manyAva[1] == true ? 'orange':'white'), 'color' : (manyAva[1] == true) ? 'white': 'black'}"
                              :disabled="timePd[1]"><span>09:00-09:50</span></Checkbox>
                    <Checkbox :label="10" border style="margin-bottom:5px"
                              :style="{'background-color': (manyAva[2] == true ? 'orange':'white'), 'color' : (manyAva[2] == true) ? 'white': 'black'}"
                              :disabled="timePd[2]"><span>10:00-10:50</span></Checkbox>
                    <Checkbox :label="11" border style="margin-bottom:5px"
                              :style="{'background-color': (manyAva[3] == true ? 'orange':'white'), 'color' : (manyAva[3] == true) ? 'white': 'black'}"
                              :disabled="timePd[3]"><span>11:00-11:50</span></Checkbox>
                    <Checkbox :label="12" border style="margin-bottom:5px"
                              :style="{'background-color': (manyAva[4] == true ? 'orange':'white'), 'color' : (manyAva[4] == true) ? 'white': 'black'}"
                              :disabled="timePd[4]"><span>12:00-12:50</span></Checkbox>
                    <Checkbox :label="13" border style="margin-bottom:5px"
                              :style="{'background-color': (manyAva[5] == true ? 'orange':'white'), 'color' : (manyAva[5] == true) ? 'white': 'black'}"
                              :disabled="timePd[5]"><span>13:00-13:50</span></Checkbox>
                    <Checkbox :label="14" border style="margin-bottom:5px"
                              :style="{'background-color': (manyAva[6] == true ? 'orange':'white'), 'color' : (manyAva[6] == true) ? 'white': 'black'}"
                              :disabled="timePd[6]"><span>13:00-13:50</span></Checkbox>
                    <Checkbox :label="15" border style="margin-bottom:5px"
                              :style="{'background-color': (manyAva[7] == true ? 'orange':'white'), 'color' : (manyAva[7] == true) ? 'white': 'black'}"
                              :disabled="timePd[7]"><span>14:00-14:50</span></Checkbox>
                    <Checkbox :label="16" border style="margin-bottom:5px"
                              :style="{'background-color': (manyAva[8] == true ? 'orange':'white'), 'color' : (manyAva[8] == true) ? 'white': 'black'}"
                              :disabled="timePd[8]"><span>15:00-15:50</span></Checkbox>
                    <Checkbox :label="17" border style="margin-bottom:5px"
                              :style="{'background-color': (manyAva[9] == true ? 'orange':'white'), 'color' : (manyAva[9] == true) ? 'white': 'black'}"
                              :disabled="timePd[9]"><span>16:00-17:50</span></Checkbox>
                    <Checkbox :label="18" border style="margin-bottom:5px"
                              :style="{'background-color': (manyAva[10] == true ? 'orange':'white'), 'color' : (manyAva[10] == true) ? 'white': 'black'}"
                              :disabled="timePd[10]"><span>18:00-18:50</span></Checkbox>
                    <Checkbox :label="19" border style="margin-bottom:5px"
                              :style="{'background-color': (manyAva[11] == true ? 'orange':'white'), 'color' : (manyAva[11] == true) ? 'white': 'black'}"
                              :disabled="timePd[11]"><span>19:00-19:50</span></Checkbox>
                    <Checkbox :label="20" border style="margin-bottom:5px"
                              :style="{'background-color': (manyAva[12] == true ? 'orange':'white'), 'color' : (manyAva[12] == true) ? 'white': 'black'}"
                              :disabled="timePd[12]"><span>20:00-20:50</span></Checkbox>
                    <Checkbox :label="21" border style="margin-bottom:5px"
                              :style="{'background-color': (manyAva[13] == true ? 'orange':'white'), 'color' : (manyAva[13] == true) ? 'white': 'black'}"
                              :disabled="timePd[13]"><span>21:00-21:50</span></Checkbox>
                  </CheckboxGroup>
                </Col>
              </Row>

            </Card>
          </Col>
        </Row>

        <div slot="foot">
          <Button ></Button>
        </div>
      </Modal>
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
                avaConference : false,
                modal_apply: false,
                current: 0,
                chosenDate: '',
                chosenTime: [],
                //0表示可以预约 1表示不能预约 2表示已有人预约，但还没通过
                timePd: [true, true, true, true, true,
                    true, true, true, true, true,
                    true, true, true, true],
                manyAva: [false, false, false, false, false,
                    false, false, false, false, false,
                    false, false, false, false],
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now();
                    }
                },
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
                                            this.avaConference = params.index;
                                            this.modal_apply = true;
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
                data3: [],
                isConstant: true
            }
        },
        mounted(){
            this.init("初始化成功!", null);
        },
        watch:{
            chosenTime(newArr, oldArr){
                let pd = true;
                newArr.forEach(item => {
                    if(newArr.length != 1){
                        if((newArr.indexOf(item + 1) == -1) && (newArr.indexOf(item - 1) == -1)){
                            this.isConstant = false;
                            pd = false
                        }
                    }
                })
                if(pd == true) this.isConstant = true;
                // console.log(this.isConstant)
            }
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
                    console.log(name)
                    var data_search2 = {
                        campus: name.campus, //校区,宝山|嘉定|延长  不可以为空
                        building: name.building,//可以为空
                        departmentName: name.departmentName,//部门名字，可以为空
                        minSeats: name.minSeats,//最小座位数,默认为0
                        isMultifunc: 0,//多功能厅
                        hasSpeaker: 0
                    }
                    if(name.minSeats == '') data_search2.minSeats = 0;
                    if(!name.campus) data_search2.campus = '';
                    if(!name.building) data_search2.building = '';
                    if(!name.departmentName) data_search2.departmentName = '';
                    // if(name.isMultifunc == true){
                    //     name.isMultifunc = 1;
                    // }else name.isMultifunc = 0;
                    data_search2.isMultifunc = parseInt(name.isMultifunc==true ? 1 : 0)
                    data_search2.hasSpeaker = parseInt(name.hasSpeaker==true ? 1 : 0)
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
            selectTime(chosenDate, type){
                if(chosenDate != ''){
                    this.chosenDate = chosenDate
                    axios({
                        url : apiRoot + '/user/appointmentByDay',
                        method: 'post',
                        data: {
                            needdate : chosenDate,
                            conferenceId : this.data[this.avaConference].id
                        }
                    }).then((res) => {
                        if(res.data.code == 200){
                            let i = 0;
                            res.data.data.forEach((item) => {
                                if(item == 0 || item == 2){
                                    this.$set(this.timePd, i, false)
                                }else this.$set(this.timePd, i, true)
                                if(item == 2){
                                    this.$set(this.manyAva, i, true)
                                }else this.$set(this.manyAva, i, false)
                                i++;
                            })
                        }else{
                            this.$Message.error(res.data.message)
                        }
                    }).catch((err) => {
                        this.$Message.error("获取预约时间失败，请检查网络连接！")
                    })
                }else{
                    this.chosenTime = [];
                    for(let i = 0; i < 14; i++){
                        this.$set(this.timePd, i, true)
                        this.$set(this.manyAva, i, false)
                    }
                }

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

