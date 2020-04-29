<template>
  <div>
    <van-popup v-model="showTime"
               position="bottom"
               :style="{ height: '30%' }">
      <van-datetime-picker
        v-model="nowDate"
        type="date"
        @confirm="confirm"
        @cancel="showTime=false"
        :min-date="minDate" title="选择预约时间"
      />
    </van-popup>
    <div class="header-avaInfo">
      <div class="background-img">
        <span style="float:left; color: #D0DCEC; font-size: 180%; padding-top: 3vh" @click="goback">
          <van-icon name="arrow-left" />
        </span>
      </div>
      <div class="header-avaInfo-card">
        <div class="conference-info-mobile-first">
          <span>{{this.info.building}}</span>
          <span class="conference-list-mobile-first-name">{{info.name}}</span>
        </div>
        <div class="conference-info-mobile-second">
          <span style="display: inline-block; padding-bottom: 0.5vh">
            <Icon type="ios-home" />&nbsp
            {{this.params.departmentName}}
          </span><br/>
          <span style="display: inline-block; padding-bottom: 0.5vh">
            <Icon type="ios-man" />&nbsp
            {{this.info.seatnumber}}&nbsp座位
          </span><br/>
          <span>
            <Icon type="ios-call-outline" />&nbsp
            {{this.info.phone}}
          </span>
        </div>
      </div>
      <div class="chosentime-part">
        <div class="title-chosentime-part">
          <span>选择预约日期及时间段</span>
        </div>
        <div class="changedate-chosentime-part" @click="changeDate">
          <span style="display: inline-block;margin-left: 5vw; font-weight: 500;margin-top: 0.4vh">{{this.chosenDate.replace('/', '-').replace('/', '-')}}</span>
          <span style="float:right;color: #004498;font-size: 120%;margin-right: 2vw;margin-top: 0.1vh">
            <Icon type="ios-calendar" />
          </span>
        </div>
        <div class="chosentime-chosentime-part">
          <span v-for="(item, index) in timeStatus" :key="index">
            <span class="chosentime-info-for" @click="chooseTime(item, index)"
                  :style="{'background-color': isChoose[index] ==  false ? '#094A9B' : (item == 0 ? 'white' : (item == 2 ? '#F9B705': '#EDEDED')),
                            'color': isChoose[index] == false ? '#F3FAFF' : '#484848'}">
              {{parseInt(index) + 8}}:00-{{parseInt(index) + 8}}:50
            </span>
          </span>
        </div>
      </div>
      <div class="phone-reason">
        <div class="phone">
          <div class="title">申请人手机号</div>
          <div>
            <van-field v-model="phone" placeholder="请输入手机号"
                       style="background-color: #EDEDED; border-radius: 5px"/>
          </div>
        </div>
        <div class="reason" style="margin-top: 2vh">
          <div class="title">申请理由</div>
          <div>
            <van-field v-model="reason" placeholder="请输入申请理由"
                       style="background-color: #EDEDED; border-radius: 5px"/>
          </div>
        </div>
      </div>

    </div>
    <van-button style="bottom: 0; background-color: #094A9B; width: 100vw; position: fixed"
            @click="commit" :loading="loading"><span style="color:white">提交预约</span></van-button>
  </div>
</template>

<script>
  import axios from 'axios'

 export default {
     name: 'avaInfo',
     data(){
         return{
             params: this.$route.params,
             loading: false,
             info: {
                 name: '',
                 building: '',
                 phone: '',
                 seatnumber: '',
             },
             timeStatus: [0, 0, 0, 0, 0, 0, 0,
                 0, 0, 0, 0, 0, 0, 0],
             isChoose: [true, true, true, true, true,
                          true, true, true, true, true],
             chosenTime: [],
             isConstant: true,
             chosenDate: this.$route.params.chosenDate,
             nowDate: new Date(this.chosenDate),
             showTime: false,
             minDate: new Date(new Date().setDate(new Date().getDate() + 1)),
             phone: '',
             reason: ''
         }
     },
     watch:{
         chosenTime(newVal, oldVal){
             let arr = [];
             if(this.chosenTime.length == 1){
                 this.isConstant = true;
             }
             if(this.chosenTime.length > 1){
                 arr = this.chosenTime.slice(0).sort(function(a, b){
                     return a - b;
                 })
                 console.log(arr)
                 let pd = true;
                 for(let i = 0; i < arr.length - 1; i++){
                     if(arr[i] + 1 == arr[i + 1]){
                         pd = true;
                     }else{
                         pd = false;
                         break;
                     }
                 }
                 this.isConstant = pd == true ? true : false
             }
             console.log(this.isConstant)
         }
     },
     mounted(){
         this.init()
         this.initDate()
         this.initPerson()
     },
     methods:{
         init(){
             this.params = this.$route.params
             if(this.params.id == undefined){
                 this.$router.push('/mobile/userMobile')
                 return
             }
             axios({
                 url: apiRoot + '/user/conferenceInfo?id=' + this.params.id,
                 method: 'get'
             }).then((res) => {
                 if(res.data.code == 200){
                     let response = res.data.data
                     this.info.name = response.name;
                     this.info.building = response.building;
                     this.info.phone = response.phone;
                     this.info.seatnumber = response.seatnumber;
                 }else{
                     this.$Message.error(res.data.message)
                 }
             }).catch((err) => {
                 this.$Message.error("请检查网络连接！")
             })
         },
         initPerson(){
             axios({
                 url: apiRoot + '/user/info?userId=' + localStorage.getItem('userid'),
                 method:'get'
             }).then((res) => {
                 if(res.data.code == 200){
                     this.phone = res.data.data.phone;
                 }
             })
         },
         initDate(){
             if(this.params.id == undefined){
                 this.$router.push('/mobile/userMobile')
                 return
             }
             axios({
                 url : apiRoot + '/user/appointmentByDay',
                 method: 'post',
                 data: {
                     needdate: this.chosenDate,
                     conferenceId: this.params.id
                 }
             }).then((res) => {
                 if(res.data.code == 200){
                     this.isChoose = [true, true, true, true, true,
                         true, true, true, true, true]
                         this.chosenTime = []
                     for(let i = 0; i < 14; i++){
                         this.$set(this.timeStatus, i, res.data.data[i])
                     }
                 }else{
                     this.$Message.error(res.data.message)
                 }
             }).catch((err) => {
                 this.$Message.error("请检查网络连接！")
             })
         },
         goback(){
             this.$router.go(-1)
         },
         changeDate(){
             this.showTime = true;
         },
         confirm(){
             this.showTime = false;
             this.chosenDate = this.nowDate.toLocaleDateString().replace('/', '-').replace('/', '-');
             this.initDate()
         },
         chooseTime(item, index){
             if(item === 1){
                 return;
             }else if(item === 0 || item === 2){
                 if(this.isChoose[index] === true){
                     this.chosenTime.push(index);
                     // this.isChoose[index] = false;
                     this.$set(this.isChoose, index, false)
                 }else {
                     // this.isChoose[index] = true;
                     this.$set(this.isChoose, index, true)
                     this.chosenTime.splice(this.chosenTime.indexOf(index), 1)
                 }
             }
         },
         commit(){
             this.loading = true;
             if(this.chosenTime.length == 0){
                 this.$Message.error("请选择预约时间！")
                 this.loading = false;
             }else if(this.isConstant === false){
                 this.$Message.error("请选择连续的时间段！")
                 this.loading = false;
             }else if(this.phone == ''){
                 this.$Message.error('请填写手机号！')
                 this.loading = false;
             }else if(this.reason == ''){
                 this.$Message.error("请填写申请理由！")
                 this.loading = false;
             }else{
                 let arr = this.chosenTime.slice(0).sort((a, b) => {
                     return a - b
                 })
                 axios({
                     url: apiRoot + '/user/appointmentCreation',
                     method: 'post',
                     data: {
                         id: this.params.id,
                         needdate: this.chosenDate,
                         begintime: arr[0] + 8,
                         endtime: arr[arr.length - 1] + 9,
                         requestreason: this.reason,
                         phone: this.phone,
                         participateId: [localStorage.getItem('userid')]
                     }
                 }).then((res) => {
                         if(res.data.code == 200){
                             this.loading = false;
                             this.$router.push("/mobile/userMobile")
                             this.$Message.success("申请成功")
                         }else{
                             this.$Message.error(res.data.message)
                             this.loading = false;
                         }
                 }).catch((err) => {
                     this.$Message.error("请检查网络连接！")
                     this.loading = false;
                 })
             }

         }
     }
 }
</script>

<style scoped lang="scss">
  @import "AvaInfo";
</style>
