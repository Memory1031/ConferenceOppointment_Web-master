<template>
  <div>
    <div class="button">
      <Dropdown>
        <Button type="primary">
          创建会议室
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem @click.native="modal1=true">直接创建</DropdownItem>
<!--          <DropdownItem>导入excel表格</DropdownItem>-->
        </DropdownMenu>
      </Dropdown>
      <Modal
        v-model="modal1"
        title="创建会议室"
        :loading="loading"
        width="1000" ok-text="提交" @on-ok="createConference">
        <Form :model="conference_info" :label-width="80">
          <Row>
            <Col span="8">
              <FormItem label="房间号">
                <Input v-model="conference_info.name" placeholder="例:D602(必填)"></Input>
              </FormItem>
              <FormItem label="所属大楼">
                <Input v-model="conference_info.building" placeholder="例:D楼(必填)"></Input>
              </FormItem>
              <FormItem label="联系电话">
                <Input v-model="conference_info.phone" placeholder="例:13xxxxxxxxx(必填)"></Input>
              </FormItem>
              <FormItem label="取钥匙地点">
                <Input v-model="conference_info.addressKey" placeholder="(必填)"></Input>
              </FormItem>
              <FormItem label="会议室面积">
                <Input v-model="conference_info.areasize" placeholder="单位为立方米(必填)"></Input>
              </FormItem>
              <FormItem label="座位数">
                <Input v-model="conference_info.seatnumber" placeholder="(必填)"></Input>
              </FormItem>
              <FormItem label="屏幕尺寸">
                <Input v-model="conference_info.screensize" placeholder="若没有则不填"></Input>
              </FormItem>
              <FormItem label="维保成本">
                <Input v-model="conference_info.maintaincost" placeholder="单位为元(必填)"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="对外开放">
                <RadioGroup v-model="conference_info.isAble">
                  <Radio :label='1'>
                    <span>是</span>
                  </Radio>
                  <Radio :label='0'>
                    <span>否</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="对学生开放">
                <RadioGroup v-model="conference_info.studentAble">
                  <Radio :label='1'>
                    <span>是</span>
                  </Radio>
                  <Radio :label='0'>
                    <span>否</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="对老师开放">
                <RadioGroup v-model="conference_info.teacherAble">
                  <Radio :label='1'>
                    <span>是</span>
                  </Radio>
                  <Radio :label='0'>
                    <span>否</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="座椅摆放">
                <RadioGroup v-model="conference_info.seatsize">
                  <Radio :label='0'>
                    <span>圆桌式</span>
                  </Radio>
                  <Radio :label='1'>
                    <span>剧院式</span>
                  </Radio>
                  <Radio :label="2">
                    <span>U形</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="房间用途">
                <RadioGroup v-model="conference_info.roomfunction">
                  <Radio :label='0'>
                    <span>会议</span>
                  </Radio>
                  <Radio :label='1'>
                    <span>培训</span>
                  </Radio>
                  <Radio :label="2">
                    <span>都可以</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="多功能">
                <RadioGroup v-model="conference_info.ismultifunc">
                  <Radio :label='1'>
                    <span>是</span>
                  </Radio>
                  <Radio :label='0'>
                    <span>否</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="有话筒">
                <RadioGroup v-model="conference_info.hasspeaker">
                  <Radio :label='1'>
                    <span>是</span>
                  </Radio>
                  <Radio :label='0'>
                    <span>否</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="有茶水">
                <RadioGroup v-model="conference_info.haswater">
                  <Radio :label='1'>
                    <span>是</span>
                  </Radio>
                  <Radio :label='0'>
                    <span>否</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="麦克风情况">
                <Input v-model="conference_info.microphonecondition" placeholder="选填"></Input>
              </FormItem>
              <FormItem label="其他设备">
                <Input v-model="conference_info.otherdevicecondition" placeholder="选填"></Input>
              </FormItem>
              <div>上传会议室照片(可不传)</div>
              <Upload
                multiple
                type="drag"
                :headers="uploadHeaders"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                action="http://www.songcm.cn:8888/api/file/upload">
                <div style="padding: 20px 0">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p>Click or drag files here to upload</p>
                </div>
              </Upload>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    export default{
        name: 'manageConference',
        data(){
            return{
                loading: false,
                modal1: false,//直接创建会议室的对话框
                conference_info:{
                    name : "",//会议室房间号
                    building : "",//所属大楼
                    phone : "", //会议室联系电话
                    addressKey : "",//取钥匙地点
                    studentAble : 0,//是否对学生开放，1为开放，以下同
                    teacherAble : 0,//是否对老师开放
                    isAble : 0,//是否开放
                    areasize : 0,//会议室面积 单位为立方米
                    seatnumber : 0,//座位数
                    seatsize : 0,//座位摆放方式
                    screensize : "", //投影仪屏幕大小
                    maintaincost : 0, //维保成本
                    roomfunction : 0,//房间用途
                    ismultifunc : 0,//多功能会议室
                    hasspeaker : 0,//有话筒
                    haswater : 0,//有茶水
                    microphonecondition: '',
                    otherdevicecondition: ''
                },
                uploadHeaders: {
                    Authorization: localStorage.getItem('token')
                },
                pictureAddress: "",
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(index){
            },
            createConference(){
                this.loading = true;
                if(this.conference_info.name && this.conference_info.building
                && this.conference_info.phone && this.conference_info.addressKey
                && this.conference_info.areasize && this.conference_info.seatnumber
                    && this.conference_info.maintaincost){
                    axios({
                        url: apiRoot + "/manager/ConferenceCreation",
                        method: "post",
                        data:{
                            name: this.conference_info.name,
                            building: this.conference_info.building,
                            phone: this.conference_info.phone,
                            addressKey: this.conference_info.addressKey,
                            studentAble: this.conference_info.studentAble,
                            teacherAble: this.conference_info.teacherAble,
                            isAble: this.conference_info.isAble,
                            areasize: this.conference_info.areasize,
                            seatnumber: this.conference_info.seatnumber,
                            seatsize: this.conference_info.seatsize,
                            screensize: this.conference_info.screensize,
                            maintaincost: this.conference_info.maintaincost,
                            roomfunction: this.conference_info.roomfunction,
                            ismultifunc: this.conference_info.ismultifunc,
                            hasspeaker: this.conference_info.hasspeaker,
                            haswater: this.conference_info.haswater,
                            microphonecondition: this.conference_info.microphonecondition,
                            otherdevicecondition: this.conference_info.otherdevicecondition,
                            picture: this.pictureAddress
                        }
                    }).then((res) => {
                        if(res.data.code == 200){
                            this.$Message.success("创建成功");
                            this.init("初始化成功");
                            this.loading = false;
                        }else{
                            this.$Message.error(res.data.Message);
                            this.loading = false;
                        }
                    });
                }else{
                    this.$Message.error("请完整填写有关字段");
                    this.loading = false;
                    this.$nextTick(() => {
                        this.modal1 = true;
                    });
                }
            },
            uploadSuccess(response) {
                this.pictureAddress = response.data;
            },
            uploadError(){
                this.$Message.error("上传失败！");
            }
        }
    }
</script>

<style lang="scss">
  @import 'manageConference';
</style>
