<template>
  <div>
    <van-popup v-model="showTime"
               position="bottom"
               :style="{ height: '30%' }">
      <van-datetime-picker
        v-model="nowDate"
        type="date"
        @confirm="confirmTime"
        @cancel="showTime=false,nowDate=new Date(new Date().setDate(new Date().getDate() + 1))"
        :min-date="minDate" title="选择预约时间"
      />
    </van-popup>
    <div class="header-ava">
      <div class="date-ava">
        预约日期：
        <span style="font-size:110%">{{this.chosenDate}}</span>&nbsp
        <span @click="showTime=true">
          <Icon type="ios-calendar-outline" />
        </span>
      </div>
    </div>
    <div class="search-part-mobile-for-conference">
      <van-row>
        <van-col span="4">
          <van-field
            readonly
            clickable style="width:15vw;border:1px solid #E8E8E8;margin-right: 1vw;border-radius:5%"
            :value="search.campus"
            placeholder="选择校区"
            @click="showCampus=true"
          />
          <van-popup v-model="showCampus" position="bottom">
            <van-picker
              show-toolbar
              :columns="campus" title="选择校区" clearable
              @cancel="showCampus=false"
              @confirm="onConfirm"
            />
          </van-popup>
        </van-col>
        <van-col span="10">
          <van-field
            readonly
            clickable style="width:40vw;border:1px solid #E8E8E8;border-radius:5%"
            :value="search.departmentName"
            placeholder="管理部门（可选）"
            @click="showDepartment = true"
          />
          <van-popup v-model="showDepartment" position="bottom">
            <van-picker
              show-toolbar
              :columns="departmentName" title="选择管理部门"
              @cancel="showDepartment = false"
              @confirm="onConfirmDepartment"
            />
          </van-popup>
        </van-col>
        <van-col span="10">
          <van-field
            v-model="search.building"
            style="width:37vw;border:1px solid #E8E8E8;margin-left: 1vw;border-radius:5%"
            placeholder='大楼名称（可填）'
          />
        </van-col>
      </van-row>
      <van-row  style="margin-top:1vh">
        <van-col span="10">
          <van-field
            readonly
            clickable
            :value="search.minSeats" placeholder="最小座位数（默认0）"
            @touchstart.native.stop="showNumberKeyboard = true"
            style="width:38vw;border:1px solid #E8E8E8;border-radius:5%"
          />
          <van-number-keyboard
            v-model="search.minSeats"
            :show="showNumberKeyboard"
            :maxlength="6"
            @blur="showNumberKeyboard = false"
          />
        </van-col>
        <van-col span="6">
          <van-checkbox v-model="multiFun"
                style="margin-top: 1.5vh">需多功能室
          </van-checkbox>
        </van-col>
        <van-col span="8">
          <van-checkbox v-model="speaker"
                        style="margin-top: 1.5vh; margin-left: 2vw">需扩音设备
          </van-checkbox>
        </van-col>
      </van-row>
    </div>
    <hr style="margin-top: 2vh;margin-bottom: 1vh" color="	#F8F8F8"/>
    <div style="text-align: center;color: #245BA4; font-size: 90%; font-weight: 550;">
      <span>
        {{this.search.campus}}校区共有
        <span class="conference-number"></span>
        间会议室
      </span>
    </div>
    <div class="conference-list-mobile">
      <van-list
        v-model="loading"   :finished="finished"
        finished-text="没有更多了"
        :error.sync="error" @load="finished=true"
        error-text="无法检索到符合条件的会议室"
      >
        <van-cell
          v-for="(item, index) in conferenceInfo" class="van-cell-list"
          :key="item.id"
        >
          <div class="conference-list-mobile-first">
            <span>{{item.building}}</span>
            <span class="conference-list-mobile-first-name">{{item.name}}</span>
          </div>
          <div class="conference-list-mobile-second">
            <span>
              <span style="color: #BFBFBF">管理单位：</span>
            <span style="color: #1B55A1">{{item.department}}</span><br/>
            <span style="color: #BFBFBF">座位数量：</span>
            <span style="color: #1B55A1">{{item.seatnumber}}</span>
            </span>
            <span class="conference-list-mobile-second-push" @click="toConferenceInfo(index)">
              <van-icon name="arrow" />
            </span>
          </div>
          <div class="conference-list-mobile-third">
            <van-row>
              <span style="float: left; color:#2C63A8">&nbsp&nbsp8:00</span>
              <span style="text-align: center;padding-right:6vw; color:#2C63A8">14:00</span>
              <span style="float: right; color:#2C63A8">21:00&nbsp&nbsp</span>
            </van-row>
            <van-row type="flex" justify="center" style="margin-top: -1.5vh;display: flex; flex-direction: row;">
              &nbsp&nbsp
              <span v-for="(pd, index2) in item.appointmentSymbol"
                      :key="index2">
                &nbsp<span v-if="pd==1" style="background-color: #CC5358;padding-left:2.2vw;padding-right: 2.2vw"></span>
                <span v-else-if="pd==0" style="background-color: #80DB60;padding-left:2.2vw;padding-right: 2.2vw"></span>
                <span v-else style="background-color: #F9B705;padding-left:2.2vw;padding-right: 2.2vw"></span>&nbsp
              </span>
            </van-row>
          </div>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
      name: 'avaMobile',
      data() {
          return {
              finished: false,
              minDate: new Date(new Date().setDate(new Date().getDate() + 1)),
              chosenDate: new Date(new Date().setDate(new Date().getDate() + 1)).getFullYear() +
                  "-" +
                  (new Date(new Date().setDate(new Date().getDate() + 1)).getMonth() > 9
                      ? new Date(new Date().setDate(new Date().getDate() + 1)).getMonth() + 1
                      : "0" + (new Date(new Date().setDate(new Date().getDate() + 1)).getMonth() + 1)) +
                  "-" +
                  (new Date(new Date().setDate(new Date().getDate() + 1)).getDate() > 9
                      ? new Date(new Date().setDate(new Date().getDate() + 1)).getDate()
                      : "0" + new Date(new Date().setDate(new Date().getDate() + 1)).getDate()),
              nowDate: new Date(new Date().setDate(new Date().getDate() + 1)),
              showTime: false,
              showCampus: false,
              showDepartment: false,
              showNumberKeyboard: false,
              multiFun: false,
              speaker: false,
              conferenceNumber: 0,
              loading: false,
              error: false,
              list: [],
              search: {
                  campus: '宝山', //校区,宝山|嘉定|延长  不可以为空
                  building: '',//可以为空
                  departmentName: '',//部门名字，可以为空
                  minSeats: '',//最小座位数,默认为0
                  isMultifunc: 0,//多功能厅
                  hasSpeaker: 0,
                  nowDate: new Date(new Date().setDate(new Date().getDate() + 1)),
              },
              campus: ['宝山','嘉定', '延长'],
              departmentName: [],
              conferenceInfo: [],

          }
      },
      watch:{
          chosenDate(newVal, oldVal){
              let date = new Date(newVal);
              this.finished = false;
              this.getConferenceInfo();
          },
          multiFun(newD,oldD){
              this.search.isMultifunc = newD == true ? 1 : 0;
          },
          speaker(newD, oldD){
              this.search.hasSpeaker = newD == true ? 1 : 0;
          },
          search:{
              handler: function(newVal, oldVal) {
                  this.finished = false;
                  this.getConferenceInfo();
              },
              deep: true
          },
          conferenceNumber(newVal, oldVal){
              this.$nextTick(() => {
                  document.querySelector(".conference-number").innerHTML = newVal
              })
          },
      },
      mounted(){
          this.initDepartmentName();
          this.init();
      },
      methods:{
          init(){
              this.loading = true;
              this.conferenceInfo = []
              axios({
                  url: apiRoot + '/user/conferenceListWithTime',
                  method: 'post',
                  data: {
                      campus: this.search.campus,
                      building: this.search.building,
                      departmentName: this.search.departmentName==='不限' ? '' : this.search.departmentName,
                      minSeats: this.search.minSeats,
                      isMultifunc: 0,
                      hasSpeaker: 0,
                      needDate: this.chosenDate
                  }
              }).then((res) => {
                  if(res.data.code == 200){
                      this.conferenceNumber = res.data.data.length;
                      res.data.data.forEach((item, index) => {
                          // this.conferenceInfo.push(item)
                          this.$set(this.conferenceInfo, index, item)
                      })
                      this.loading = false;
                      this.error = false;

                  }else{
                      this.conferenceNumber = 0
                      this.conferenceInfo = [];
                      this.loading = false
                      this.error = true;
                  }
              }).catch((err) => {
                  this.$Message.error("请检查网络连接！")
                  this.loading = false;
                  this.error = true;
              })
          },
          initDepartmentName(){
              axios({
                  url: apiRoot + '/user/departmentList',
                  method: 'get'
              }).then((res) => {
                  if(res.data.code == 200){
                      this.departmentName.push('不限');
                      res.data.data.forEach((item) => {
                          this.departmentName.push(item.departmentName)
                      })
                  }else{
                      this.$Message.error(res.data.message)
                  }
              }).catch((err) => {
                  this.$Message.error("请检查网络连接！")
              })
          },
          onConfirm(value){
              this.search.campus = value;
              this.showCampus = false
          },
          onConfirmDepartment(value){
              this.search.departmentName = value;
              this.showDepartment = false
          },
          getConferenceInfo(){
              this.loading = true;
              this.conferenceInfo = []
              axios({
                  url: apiRoot + '/user/conferenceListWithTime',
                  method: 'post',
                  data: {
                      campus: this.search.campus,
                      building: this.search.building,
                      departmentName: this.search.departmentName==='不限' ? '' : this.search.departmentName,
                      minSeats: this.search.minSeats,
                      isMultifunc: this.search.isMultifunc,
                      hasSpeaker: this.search.hasSpeaker,
                      needDate: this.chosenDate
                  }
              }).then((res) => {
                  if(res.data.code == 200){
                      this.conferenceNumber = res.data.data.length;
                      res.data.data.forEach((item) => {
                          this.conferenceInfo.push(item)
                      })
                      this.loading = false;
                      this.error = false;

                  }else{
                      this.conferenceNumber = 0
                      this.conferenceInfo = [];
                      this.loading = false
                      this.error = true;
                  }
              }).catch((err) => {
                  this.$Message.error("请检查网络连接！")
                  this.loading = false;
                  this.error = true;
              })
          },
          toConferenceInfo(index){
              this.$router.push({
                  name: 'avaInfo',
                  params: {
                      id: this.conferenceInfo[index].id,
                      chosenDate: this.chosenDate,
                      departmentName: this.conferenceInfo[index].department
                  }
              });
          },
          confirmTime(){
              this.showTime=false
              this.chosenDate = this.nowDate.getFullYear() +
                  "-" +
                  (this.nowDate.getMonth() > 9
                      ? this.nowDate.getMonth() + 1
                      : "0" + (this.nowDate.getMonth() + 1)) +
                  "-" +
                  (this.nowDate.getDate() > 9
                      ? this.nowDate.getDate()
                      : "0" + this.nowDate.getDate());
          }
      }
  }
</script>

<style lang="scss">
  @import 'AvaMobile';
</style>
