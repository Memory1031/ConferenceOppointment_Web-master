<template>
  <div>
    <Row>
      <div class="button">
        <Button type="success" class="refresh_button" @click="refresh">刷新</Button>
        <Dropdown>
          <Button type="primary">
            创建会议室
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem @click.native="modal_create=true">直接创建</DropdownItem>
            <!--          <DropdownItem>导入excel表格</DropdownItem>-->
          </DropdownMenu>
        </Dropdown>
        <Modal
          v-model="modal_create"
          title="创建会议室" draggable
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
                  :format="['jpg','jpeg','png']"
                  :on-format-error="handleFormatError"
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
    </Row>
    <Row>
        <Table
          size="large"
          no-data-text="您当前没有可供管理的会议室"
          stripe border
          :loading="loading2"
          height="700"
          :columns="columns" :data="data"></Table>
        <Modal v-model="modal_delete" draggable width="360">
          <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>删除确认</span>
          </p>
          <div style="text-align:center">
            <p>在进行此操作后，会议室<span id="conference-name"></span>将会被删除</p>
            <p>您确定要删除么</p>
          </div>
          <div slot="footer">
            <Button type="error" size="large" long @click="del">删除</Button>
          </div>
        </Modal>
      <Modal
        v-model="modal_info"
        title="会议室详情" draggable
        width="1000">
        <Form :model="updatedconference_info" :label-width="80">
          <Row>
            <Col span="8">
              <FormItem label="房间号">
                <Input v-model="updatedconference_info.name" :disabled="disable_imple" placeholder="例:D602(必填)"></Input>
              </FormItem>
              <FormItem label="所属大楼">
                <Input v-model="updatedconference_info.building"  :disabled="disable_imple" placeholder="例:D楼(必填)"></Input>
              </FormItem>
              <FormItem label="联系电话">
                <Input v-model="updatedconference_info.phone" :disabled="disable_imple" placeholder="例:13xxxxxxxxx(必填)"></Input>
              </FormItem>
              <FormItem label="取钥匙地点">
                <Input v-model="updatedconference_info.addressKey" :disabled="disable_imple" placeholder="(必填)"></Input>
              </FormItem>
              <FormItem label="会议室面积">
                <Input v-model="updatedconference_info.areasize" :disabled="disable_imple" placeholder="单位为立方米(必填)"></Input>
              </FormItem>
              <FormItem label="座位数">
                <Input v-model="updatedconference_info.seatnumber" :disabled="disable_imple" placeholder="(必填)"></Input>
              </FormItem>
              <FormItem label="屏幕尺寸">
                <Input v-model="updatedconference_info.screensize" :disabled="disable_imple" placeholder="若没有则不填"></Input>
              </FormItem>
              <FormItem label="维保成本">
                <Input v-model="updatedconference_info.maintaincost" :disabled="disable_imple" placeholder="单位为元(必填)"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="对外开放">
                <RadioGroup v-model="updatedconference_info.isAble">
                  <Radio :label='1' :disabled="disable_imple">
                    <span>是</span>
                  </Radio>
                  <Radio :label='0' :disabled="disable_imple">
                    <span>否</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="对学生开放" >
                <RadioGroup v-model="updatedconference_info.studentAble">
                  <Radio :label='1' :disabled="disable_imple">
                    <span>是</span>
                  </Radio>
                  <Radio :label='0' :disabled="disable_imple">
                    <span>否</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="对老师开放">
                <RadioGroup v-model="updatedconference_info.teacherAble">
                  <Radio :label='1' :disabled="disable_imple">
                    <span>是</span>
                  </Radio>
                  <Radio :label='0' :disabled="disable_imple">
                    <span>否</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="座椅摆放">
                <RadioGroup v-model="updatedconference_info.seatsize">
                  <Radio :label='0' :disabled="disable_imple">
                    <span>圆桌式</span>
                  </Radio>
                  <Radio :label='1' :disabled="disable_imple">
                    <span>剧院式</span>
                  </Radio>
                  <Radio :label="2" :disabled="disable_imple">
                    <span>U形</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="房间用途">
                <RadioGroup v-model="updatedconference_info.roomfunction">
                  <Radio :label='0' :disabled="disable_imple">
                    <span>会议</span>
                  </Radio>
                  <Radio :label='1' :disabled="disable_imple">
                    <span>培训</span>
                  </Radio>
                  <Radio :label="2" :disabled="disable_imple">
                    <span>都可以</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="多功能">
                <RadioGroup v-model="updatedconference_info.ismultifunc">
                  <Radio :label='1' :disabled="disable_imple">
                    <span>是</span>
                  </Radio>
                  <Radio :label='0' :disabled="disable_imple">
                    <span>否</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="有话筒">
                <RadioGroup v-model="updatedconference_info.hasspeaker">
                  <Radio :label='1' :disabled="disable_imple">
                    <span>是</span>
                  </Radio>
                  <Radio :label='0' :disabled="disable_imple">
                    <span>否</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="有茶水">
                <RadioGroup v-model="updatedconference_info.haswater">
                  <Radio :label='1' :disabled="disable_imple">
                    <span>是</span>
                  </Radio>
                  <Radio :label='0' :disabled="disable_imple">
                    <span>否</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="麦克风情况">
                <Input v-model="updatedconference_info.microphonecondition" :disabled="disable_imple" placeholder="选填"></Input>
              </FormItem>
              <FormItem label="其他设备">
                <Input v-model="updatedconference_info.otherdevicecondition" :disabled="disable_imple" placeholder="选填"></Input>
              </FormItem>
              <div>
                <span>会议室图片：</span> <span v-if="!picture_exit">无</span><br/>
                <img :src="picture_url" style="margin-left: 30px" v-if="picture_exit" max-width="280">
              </div>
              <br/>
              <div v-if="!disable_imple">上传会议室照片(可不传)</div>
              <Upload
                multiple v-if="!disable_imple"
                type="drag"
                :headers="uploadHeaders"
                :format="['jpg','jpeg','png']"
                :on-format-error="handleFormatError"
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
        <div slot="footer">
          <Button type="info" size="large"  @click="cancel_model_info">取消</Button>
          <Button type="warning" size="large" v-if="disable_imple" @click="disable_imple=false">修改</Button>
          <Button type="success" size="large" :loading="loading_change" v-if="!disable_imple" @click="save">保存</Button>

        </div>
      </Modal>
    </Row>

  </div>
</template>

<script>
    import axios from 'axios'
    export default{
        name: 'manageConference',
        data(){
            return{
                loading: false,
                loading2: false,
                loading_change: false,
                modal_create: false,//直接创建会议室的对话框
                modal_delete: false,
                modal_info: false,
                disable_imple: true,
                picture_url: '',
                picture_exit: false,
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
                updatedconference_info:{
                    id: '',
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
                deleteNumber: 0,
                columns: [
                    {
                        title: '会议室房间号',
                        key: 'name',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '所属大楼',
                        key: 'building',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '是否开放',
                        key: 'isAble',
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
                                        type: 'info'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        height: '30px',
                                        fontSize: '15px',
                                        borderColor: 'white',
                                    },
                                    on: {
                                        click: () => {
                                             this.getConference_info(params.index)
                                        }
                                    }
                                }, '详情'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                    },
                                    style: {
                                        height: '30px',
                                        backgroundColor: '#FF7F50',
                                        borderColor: 'white',
                                        fontSize: '15px'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteConference(params.index)
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
                this.loading2 = true;
                this.data = [];
                axios({
                    url: apiRoot + "/manager/list",
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.forEach((item) => {
                            item.isAble = item.isAble == 1 ? '是' : '否'
                            this.data.push(item);
                        })
                        this.$Message.success(index);
                        this.loading2 = false;
                    } else {
                        this.$Message.error(res.data.message);
                        this.loading2 = false
                    }
                }).catch((err) => {
                    console.error(err)
                    this.$Message.error("请检查网络连接！");
                    this.loading2 = false
                })
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
                            this.init("刷新成功");
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
                        this.modal_create = true;
                    });
                }
            },
            uploadSuccess(response) {
                this.pictureAddress = response.data;
            },
            uploadError(){
                this.$Message.error("上传失败！");
            },
            handleFormatError(file){
                this.$Message.error("请确定您上传的文件为图片!")
            },
            refresh(){
                this.init("刷新成功!");
            },
            deleteConference(index){
                this.modal_delete = true;
                this.deleteNumber = index;
                this.$nextTick(()=>{
                    document.querySelector("#conference-name").innerHTML = this.data[this.deleteNumber].name;
                })
            },
            del(){
                axios({
                    url: apiRoot + '/manager/conferenceDeletion?id=' + this.data[this.deleteNumber].id,
                    method: 'get',
                }).then((res) => {
                    if(res.data.code == 200){
                        this.$Message.success("删除成功!");
                        this.init();
                    }else{
                        this.$Message.error(res.data.Message);
                    }
                }).catch((err)=>{
                    this.$Message.error("删除失败，请检查网络连接!")
                })
                this.modal_delete = false;
            },
            getConference_info(index){
                this.modal_info = true;
                this.picture_url = '';
                this.picture_exit = false;
                axios({
                    url: apiRoot + '/user/conferenceInfo?id=' + this.data[index].id,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        this.updatedconference_info.addressKey = res.data.data.addressKey
                        this.updatedconference_info.areasize = res.data.data.areasize
                        this.updatedconference_info.building = res.data.data.building
                        this.updatedconference_info.hasspeaker = res.data.data.hasspeaker
                        this.updatedconference_info.haswater = res.data.data.haswater
                        this.updatedconference_info.id = res.data.data.id
                        this.updatedconference_info.isAble = res.data.data.isAble
                        this.updatedconference_info.ismultifunc = res.data.data.ismultifunc
                        this.updatedconference_info.maintaincost = res.data.data.maintaincost
                        this.updatedconference_info.microphonecondition = res.data.data.microphonecondition
                        this.updatedconference_info.name = res.data.data.name
                        this.updatedconference_info.otherdevicecondition = res.data.data.otherdevicecondition
                        this.updatedconference_info.phone = res.data.data.phone
                        this.updatedconference_info.picture = res.data.data.picture
                        this.updatedconference_info.roomfunction = res.data.data.roomfunction
                        this.updatedconference_info.screensize = res.data.data.screensize
                        this.updatedconference_info.seatnumber = res.data.data.seatnumber
                        this.updatedconference_info.seatsize = res.data.data.seatsize
                        this.updatedconference_info.studentAble = res.data.data.studentAble
                        this.updatedconference_info.teacherAble = res.data.data.teacherAble

                        if(this.updatedconference_info.picture != ""){
                            this.picture_url = "http://www.songcm.cn" + this.updatedconference_info.picture;
                            this.picture_exit = true;
                        }
                    }else{
                        this.$Message.error(res.data.Message);
                        this.modal_info = false;
                    }
                }).catch((err)=>{
                    this.$Message.error("加载失败，请检查网络连接!")
                    this.modal_info = false;
                })
            },
            cancel_model_info(){
                this.modal_info = false;
                this.disable_imple = true;
            },
            save(){
                this.loading_change = true;
                if(this.updatedconference_info.name && this.updatedconference_info.building
                    && this.updatedconference_info.phone && this.updatedconference_info.addressKey
                    && this.updatedconference_info.areasize && this.updatedconference_info.seatnumber
                    && this.updatedconference_info.maintaincost){
                    axios({
                        url: apiRoot + "/manager/update",
                        method: "post",
                        data:{
                            id: this.updatedconference_info.id,
                            name: this.updatedconference_info.name,
                            building: this.updatedconference_info.building,
                            phone: this.updatedconference_info.phone,
                            addressKey: this.updatedconference_info.addressKey,
                            studentAble: this.updatedconference_info.studentAble,
                            teacherAble: this.updatedconference_info.teacherAble,
                            isAble: this.updatedconference_info.isAble,
                            areasize: this.updatedconference_info.areasize,
                            seatnumber: this.updatedconference_info.seatnumber,
                            seatsize: this.updatedconference_info.seatsize,
                            screensize: this.updatedconference_info.screensize,
                            maintaincost: this.updatedconference_info.maintaincost,
                            roomfunction: this.updatedconference_info.roomfunction,
                            ismultifunc: this.updatedconference_info.ismultifunc,
                            hasspeaker: this.updatedconference_info.hasspeaker,
                            haswater: this.updatedconference_info.haswater,
                            microphonecondition: this.updatedconference_info.microphonecondition,
                            otherdevicecondition: this.updatedconference_info.otherdevicecondition,
                            picture: this.updatedconference_info.picture
                        }
                    }).then((res) => {
                        if(res.data.code == 200){
                            this.$Message.success("信息更新成功");
                            this.init("刷新成功");
                        }else{
                            this.$Message.error(res.data.Message);
                        }
                    });
                }else{
                    this.$Message.error("请完整填写有关字段");
                    this.loading = false;
                    this.$nextTick(() => {
                        this.modal_create = true;
                    });
                }

                this.disable_imple = true;
                this.loading_change = false;
                this.modal_info = false;
            }
        }
    }
</script>

<style lang="scss">
  @import 'manageConference';
</style>
