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
            <div v-if="!current">
              <Card style="height: 400px;user-select: none">
                <Row>
                  <Col span="8">
                    <DatePicker type="date" :options="options" placeholder="选择预约日期"
                                show-week-numbers size="large"
                                @on-change="selectTime" style="width: 200px" v-model="chosenDate"></DatePicker>
                    <Divider/>
                    <Poptip placement="right" width="450" trigger="hover">
                      <Button>提示</Button>
                      <div slot="content">
                        <div style="text-align: center">
                          <br/>
                          <p style="text-align: center;font-size: 130%">注意：您只能选择连续的时间段进行预约</p>
                          <br/>
                          <p style="text-align: center;font-size: 100%">由于周末值班老师不在，预约周六/周日任意一天即预约整个周末</p>
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
                    <br/>
                    <br/>
                    <Spin v-if="spinexist"></Spin>
                    <br/><br/><br/><br/>
                    <p style="font-size: 150%; text-align: center;color: blue" v-if="!isConstant">请选择连续的时间段!</p>
                  </Col>
                  <Col span="16" style="text-align: center">
                    <p style="text-align: center">
                      <Tooltip content="前一天" placement="top-start">
                        <span>
                          <span @click="beforeDate"  style="font-size: 200%;" class="icon-color">
                            <Icon type="ios-arrow-back"/>
                          </span>
                        </span>
                      </Tooltip>

                      <span style="user-select: none">&nbsp</span>
                      <Tooltip content="后一天" placement="top-start">
                        <span>
                          <span @click="nextDate"  style="font-size: 200%"  class="icon-color">
                            <Icon type="ios-arrow-forward"/>
                          </span>
                        </span>
                      </Tooltip>
                    </p>
                    <CheckboxGroup v-model="chosenTime" v-if="!isweekend" size="large">
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
                                :disabled="timePd[6]"><span>14:00-14:50</span></Checkbox>
                      <Checkbox :label="15" border style="margin-bottom:5px"
                                :style="{'background-color': (manyAva[7] == true ? 'orange':'white'), 'color' : (manyAva[7] == true) ? 'white': 'black'}"
                                :disabled="timePd[7]"><span>15:00-15:50</span></Checkbox>
                      <Checkbox :label="16" border style="margin-bottom:5px"
                                :style="{'background-color': (manyAva[8] == true ? 'orange':'white'), 'color' : (manyAva[8] == true) ? 'white': 'black'}"
                                :disabled="timePd[8]"><span>16:00-16:50</span></Checkbox>
                      <Checkbox :label="17" border style="margin-bottom:5px"
                                :style="{'background-color': (manyAva[9] == true ? 'orange':'white'), 'color' : (manyAva[9] == true) ? 'white': 'black'}"
                                :disabled="timePd[9]"><span>17:00-17:50</span></Checkbox>
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
                    <CheckboxGroup v-model="chosenTime" v-if="isweekend" size="large">
                      <Checkbox :label="8" border style="margin-bottom:5px;"
                                :style="{'background-color': (manyAva2 == true ? 'orange':'white'), 'color' : (manyAva2 == true) ? 'white': 'black'}"
                                :disabled="timePd2"><span class="date-weekend"></span></Checkbox>
                    </CheckboxGroup>
                  </Col>
                </Row>
              </Card>
              <Card>
                <div>
                  <span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp联系电话：</span>
                  <Input v-model="phone" size="large" style="width: 300px" clearable></Input>
                </div>
                <div style="margin-top: 10px">
                  <span>请填写申请理由：</span>
                  <Input v-model="requestReason" style="width: 450px" size="large" type="textarea" :rows="4" maxlength="1024"></Input>
                </div>


              </Card>

            </div>
            <div v-if="current">
              <Card style="height: 70px">
                <div style="float: left">
                  <Select v-model="groupName" :value='groupName' style="width:200px" size="large"  placeholder="请选择群组">
                    <Option v-for="(item, index) in groupList" :value="item.id" :key="item.index">{{ item.name }}</Option>
                  </Select>
                  <Button type="primary" size="large" @click="handleAdd" icon="md-add" style="text-align: center;">添加</Button>
                </div>
              </Card>
              <Card style="height: 500px; margin-top: 10px">
                <div style="float:right">
                  <AutoComplete v-model="userid" @on-search='searchUserInfo'
                                @on-select="selectUserInfo(data2[0])"
                                :data="data2" style="width: 200px"
                                clearable placeholder="输入学/工号"></AutoComplete>
                  <Button type="success" @click="add2">添加</Button>
                </div>
                <div style="margin-top: 45px">
                  <Table
                    no-data-text="无法检索到符合条件的会议室"
                    stripe border
                    height="400"
                    :columns="columns2" :data="participate"></Table>
                </div>

              </Card>
            </div>
          </Col>
        </Row>
        <div slot="footer">
          <Button size="large" @click="modal_apply=false">取消</Button>
          <Button size="large" type="primary" @click="nextStep" v-if="!current">下一步</Button>
          <Button size="large" type="warning" @click.native="current=0" v-if="current">上一步</Button>
          <Button size="large" type="success" :loading="loading_submit" @click="submit" v-if="current">提交</Button>
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
                loading_submit: false,
                avaConference : false,
                modal_apply: false,
                groupName: '',
                groupList: [],
                userid: '',
                userInfo: {
                    userId: '',
                    name: '',
                    department: ''
                },
                current: 0,
                chosenDate: '',
                chosenTime: [],
                spinexist: false,
                isweekend: false,
                //0表示可以预约 1表示不能预约 2表示已有人预约，但还没通过
                timePd: [true, true, true, true, true,
                    true, true, true, true, true,
                    true, true, true, true],
                timePd2 : true,
                manyAva: [false, false, false, false, false,
                    false, false, false, false, false,
                    false, false, false, false],
                manyAva2 : false,
                requestReason: '',
                phone: '',
                participate: [],
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
                                            this.current = 0
                                        }
                                    }
                                }, '申请')
                            ])
                        }
                    }
                ],
                columns2: [
                    {
                        title: '学/工号',
                        key: 'userId',
                        align: 'center',
                        width: '130',
                        tooltip: true
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center',
                        width: '100',
                        tooltip: true
                    },
                    {
                        title: '部门',
                        key: 'department',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            if(params.index != 0){
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.participate.splice(params.index, 1)
                                            }
                                        }
                                    }, '删除')
                                ])
                            }

                        }
                    }
                ],
                data: [],
                data2: [],
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
            this.initUserInfo();
        },
        watch:{
            chosenTime(newArr, oldArr){
                let pd = true;
                let newnew = newArr.slice(0).sort((a, b) => {
                    return a - b
                });
                let begintime = newnew[0], endtime = newnew[newnew.length - 1] + 1;
                if(newnew.length >= 2){
                    for(let i = 0; i < newnew.length - 1; i++)
                    {
                        if(newnew[i] != newnew[i + 1] - 1) {
                            this.isConstant = false;
                            pd = false
                        }
                    }
                }
                if(pd == true) this.isConstant = true;
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
            initUserInfo(){
                this.participate = []
                axios({
                    url: apiRoot + '/user/info?userId=' + localStorage.getItem('userid'),
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        this.participate.push({
                            userId: localStorage.getItem('userid'),
                            name: localStorage.getItem('username'),
                            department: res.data.data.department
                        })
                        this.phone = res.data.data.phone
                    }
                })
            },
            initGroupList(){
                this.groupList = [];
                axios({
                    url: apiRoot + '/user/myGroupList',
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.forEach((item) => {
                            this.groupList.push(item)
                        })
                    }else{
                        this.$Message.error(res.data.message)
                    }
                }).catch((err) => {})
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
                this.spinexist = true;
                if(chosenDate != ''){
                    this.chosenTime = [];
                    this.chosenDate = chosenDate
                    let days = new Date(this.chosenDate).getDay()
                    if(days == 6){
                        let datetime = new Date(chosenDate);
                        let DateString = datetime.toLocaleDateString();
                        let tomorrow = new Date(datetime.setDate(datetime.getDate() + 1))
                        DateString += '至' + tomorrow.toLocaleDateString() + '两天'
                        this.$nextTick(() => {
                            document.querySelector('.date-weekend').innerHTML = DateString
                        })
                    }else if(days == 0){
                        let datetime = new Date(chosenDate);
                        let DateString = datetime.toLocaleDateString();
                        let tomorrow = new Date(datetime.setDate(datetime.getDate() - 1))
                        DateString = tomorrow.toLocaleDateString() + '至' + DateString + '两天'
                        this.$nextTick(() => {
                            document.querySelector('.date-weekend').innerHTML = DateString
                        })
                    }
                    if(days == 0 || days == 6){
                        this.isweekend = true
                    }else this.isweekend = false
                    axios({
                        url : apiRoot + '/user/appointmentByDay',
                        method: 'post',
                        data: {
                            needdate : chosenDate,
                            conferenceId : this.data[this.avaConference].id
                        }
                    }).then((res) => {
                        if(res.data.code == 200){
                            if(this.isweekend == false){
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
                                if(res.data.data[0] == 0 || res.data.data[0] == 2){
                                    this.timePd2 = false;
                                }else this.timePd2 = true
                                if(res.data.data[0] == 2){
                                    this.manyAva2 = true
                                }else this.manyAva2 = false
                            }
                            this.spinexist = false
                        }else{
                            this.$Message.error(res.data.message)
                            this.spinexist = false
                        }
                    }).catch((err) => {
                        console.log(err)
                        this.$Message.error("获取预约时间失败，请检查网络连接！")
                        this.spinexist = false
                    })
                }else{
                    this.chosenTime = [];
                    for(let i = 0; i < 14; i++){
                        this.$set(this.timePd, i, true)
                        this.$set(this.manyAva, i, false)
                    }
                    this.spinexist = false
                }
            },
            nextStep(){
                let pd = true;
              if(this.chosenDate == '' || this.chosenTime.length == 0){
                  this.$Message.error("请选择预约时间！")
                  pd = false
              }else{
                  if(this.isConstant == false){
                      this.$Message.error('请选择连续的时间段')
                      pd = false
                  }
                  if(this.phone == ''){
                      this.$Message.error("请填写手机号")
                      pd = false
                  }
                  if(this.requestReason == ''){
                      this.$Message.error("请填写申请理由")
                      pd = false
                  }
              }
              if(pd == true){
                  this.current = 1;
                  this.initGroupList()
              }
            },
            handleAdd() {
                axios({
                    url: apiRoot + '/user/groupDetail?id=' + this.groupName,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.members.forEach((item) => {
                            let pd = 0;
                            this.participate.forEach((item2) => {
                                if(item2.userId == item.userId){
                                    pd = 1;
                                }
                            })
                            if(pd == 0){
                                this.participate.push(item)
                            }
                        })
                        this.$Message.success('添加成功，已自动为您筛选重复人员！')
                    }
                })
            },
            add2(){
                let pd = false;
                if(this.data2[0] == '请输入正确的学号' || this.data2[0] === '查询失败' || this.data2[0] === '暂无此人' || this.data2[0] === '查询中...' || this.data2[0] === undefined){
                    this.$Message.error("请输入有效的学/工号！")
                }else{
                    this.participate.forEach((item) => {
                        if(item.userId == this.userInfo.userId){
                            this.$Message.error('该用户已存在！')
                            pd = true
                        }
                    })
                    if(pd == false){
                        this.participate.push(this.userInfo)
                    }
                }
                console.log(this.participate)
            },
            delPartner(index) {
                this.items.splice(index, 1)
            },
            searchUserInfo(value) {
                this.data2 = ['查询中...']
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
                        }else {
                            this.data2 = ['暂无此人']
                        }
                    }).catch(() => {
                        this.data2 = ['查询失败']
                    })
                } else {
                    this.data2 = ['请输入正确的学号']
                }
            },
            selectUserInfo(value) {
                if (value === '请输入正确的学号' || value === '查询失败' || value === '暂无此人' || value === '查询中...') {
                    this.userid = ''
                } else {
                    var id = value.split("-")[0]   //用户学/工号
                    var name = value.split("-")[1]
                    var department = value.split("-")[2]

                    this.userInfo.userId = id;
                    this.userInfo.name = name;
                    this.userInfo.department = department
                    setTimeout(() => {
                        this.userid = id
                    })
                }
            },
            submit(){
                this.loading_submit = true;
                if(this.phone == ''){
                    this.$Message.error("请填写手机号！")
                    this.loading_submit = false;
                }else{
                    let arr = [];
                    this.participate.forEach((item) => {
                        arr.push(item.userId)
                    })
                    let arrTime = this.chosenTime.slice(0).sort((a, b) => {
                        return a - b
                    });
                    let begintime = arrTime[0], endtime = arrTime[arrTime.length - 1] + 1;
                    axios({
                        url: apiRoot + '/user/appointmentCreation',
                        method: 'post',
                        data: {
                            id: this.data[this.avaConference].id,
                            needdate: this.chosenDate,
                            begintime: this.isweekend==true ? 8 : begintime,
                            endtime: this.isweekend==true ? 9 : endtime,
                            requestreason: this.requestReason,
                            phone: this.phone,
                            participateId: arr
                        }
                    }).then((res) => {
                        if(res.data.code == 200){
                            this.$Message.success("会议室申请成功！")
                            this.loading_submit = false
                            this.modal_apply = false
                            this.chosenDate = ''
                            this.chosenTime = []
                            this.requestReason = ''
                            this.participate = []
                        }else{
                            this.$Message.error(res.data.message)
                            this.loading_submit = false
                        }
                    }).catch((err) => {
                        this.$Message.error("申请会议室失败，请检查网络连接！")
                        this.loading_submit = false
                    })
                }
            },
            filterMethod (value, option) {
                if(value == '')return false
                return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
            },
            nextDate(){
                if(this.chosenDate == '')
                {
                    this.$Message.error("请选择日期！")
                    return
                }
                this.timePd = [true, true, true, true, true,
                    true, true, true, true, true,
                    true, true, true, true]
                this.manyAva = [false, false, false, false, false,
                    false, false, false, false, false,
                    false, false, false, false]
                this.timePd2 = true;
                this.manyAva2 = false;
                let datetime = new Date(this.chosenDate);
                datetime = new Date(datetime.setDate(datetime.getDate() + 1))
                datetime = datetime.toLocaleDateString().replace('/', '-').replace('/', '-')
                this.chosenDate = datetime
                this.selectTime(this.chosenDate, 'date')
            },
            beforeDate(){
                if(this.chosenDate == '')
                {
                    this.$Message.error("请选择日期！")
                    return
                }
                this.timePd = [true, true, true, true, true,
                    true, true, true, true, true,
                    true, true, true, true]
                this.manyAva = [false, false, false, false, false,
                    false, false, false, false, false,
                    false, false, false, false]
                this.timePd2 = true;
                this.manyAva2 = false;
                var today = new Date()
                var datetime = new Date(this.chosenDate);
                datetime = new Date(datetime.setDate(datetime.getDate() - 1))
                if(datetime.getFullYear() == today.getFullYear() && datetime.getMonth() == today.getMonth() && datetime.getDate() == today.getDate()){
                    this.$Message.error("请不要选择过期时间！")
                }else{
                    this.chosenDate = datetime.toLocaleDateString().replace('/', '-').replace('/', '-')
                    this.selectTime(this.chosenDate, 'date')
                }
            }
        }
    }
</script>

<style scoped lang="scss">
  @import 'Oppconference';
</style>

<style scoped lang="scss">
  .icon-color{
    color: deepskyblue !important;
  }

  .icon-color:hover{
    color: dodgerblue !important;
  }
</style>

