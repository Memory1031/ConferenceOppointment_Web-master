<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
  .hr_extend{
    margin-top: 10px;
    margin-bottom: 10px;
    color: #d7dde4;
  }
</style>
<template>
  <div>
    <Card style="font-size: 15px">
      <Row style="padding-left: 30px; margin-bottom: 0px">详情：</Row>
      <Divider size="small"/>
      <Row style="text-align: center">
        <Col span="8">
          <p>{{this.conference_info.campus}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
          <p>房间面积：{{this.conference_info.areasize}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
          <p>拿钥匙地点：{{this.conference_info.addressKey}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
          <p>座位摆放方式：{{this.conference_info.seatsize}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
          <p>{{this.conference_info.hasspeaker}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
        </Col>
        <Col span="8">
          <p>{{this.conference_info.building}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
          <p>房间用途：{{this.conference_info.roomfunction}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
          <p>{{this.conference_info.ismultifunc}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
          <p>投影仪尺寸：{{this.conference_info.screensize}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
          <p>维保及设备维修成本：{{this.conference_info.maintaincost}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
        </Col>
        <Col span="8">
          <p>房间号：{{this.conference_info.name}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
          <p>管理部门：{{this.row.department}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
          <p>座位数：{{this.conference_info.seatnumber}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
          <p>话筒情况：{{this.conference_info.microphonecondition}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
          <p>{{this.conference_info.haswater}}</p>
          <hr class="hr_extend" color="#d7dde4"/>
        </Col>
      </Row>
      <Row style="text-align: center">
        <p>备注：{{this.conference_info.otherdevicecondition}}</p>
        <hr class="hr_extend" color="#d7dde4"/>
      </Row>
      <Row style="margin-top: 10px;text-align: center">
        <p v-if="!picture_exist">会议室照片：无</p>
        <img :src="conference_info.picture" height="300">
      </Row>
    </Card>
  </div>
</template>
<script>
    import axios from 'axios'

    export default {
        props: {
            row: Object
        },
        data(){
            return{
                conference_info: { },
                picture_exist: false
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                axios({
                    url: apiRoot + '/user/conferenceInfo?id=' + this.row.id,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        this.conference_info = res.data.data;
                        if(this.conference_info.picture){
                            this.picture_exist = true;
                            this.conference_info.picture = 'http://www.songcm.cn' + this.conference_info.picture
                        }
                        if(this.conference_info.roomfunction == '兼有'){
                            this.conference_info.roomfunction = '会议，培训'
                        }
                        if(this.conference_info.seatsize == 0){
                            this.conference_info.seatsize = '圆桌式'
                        }else if(this.conference_info.seatsize == 1){
                            this.conference_info.seatsize = '剧院式'
                        }else this.conference_info.seatsize = 'U形'
                        this.conference_info.hasspeaker = (this.conference_info.hasspeaker == 1) ? '有扩音设备' : '无扩音设备';
                        this.conference_info.ismultifunc = (this.conference_info.ismultifunc == 1) ? '是多功能会议室' : '不是多功能会议室';
                        this.conference_info.screensize = (this.conference_info.screensize == '') ? '无投影仪' : this.conference_info.screensize;
                        this.conference_info.microphonecondition = (this.conference_info.microphonecondition == '') ? '未填写' : this.conference_info.microphonecondition;
                        this.conference_info.otherdevicecondition = (this.conference_info.otherdevicecondition == '') ? '未填写' : this.conference_info.otherdevicecondition;
                        this.conference_info.haswater = (this.conference_info.haswater == 1) ? '有茶杯和热水' : '没有茶杯和热水'

                    }else{
                        this.$Message.error(res.data.message)
                    }
                }).catch((err) => {
                    this.$Message.error("获取数据失败，请检查网络连接！")
                })
            }
        }
    };
</script>
