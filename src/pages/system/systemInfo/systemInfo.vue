<template>
  <div class="wrapper">
    <div class="content">
      <Tabs>
        <TabPane label="个人信息">
          <Form :model="person_info" :label-width="80" style="width: 500px;" size="large">
            <FormItem label="姓名:">
              <Input v-model="person_info.name" disabled ></Input>
            </FormItem>
            <br/>
            <FormItem label="学/工号:">
              <Input v-model="person_info.userId" disabled></Input>
            </FormItem>
            <br/>
            <FormItem label="手机:">
              <Input v-model="person_info.phone" :disabled="disable_impl"></Input>
            </FormItem>
            <br/>
            <FormItem label="部门:">
              <Input v-model="person_info.department" disabled></Input>
            </FormItem>
            <br/>
            <FormItem label="邮箱:">
              <Input v-model="person_info.email" :disabled="disable_impl"></Input>
            </FormItem>
            <br/>
            <div style="text-align: center;">
              <Button type="primary" size="large" style="margin-left: 45px" v-if="disable_impl" @click="disable_impl=!disable_impl">修改</Button>
              <Button size="large" style="margin-left: 45px" v-if="!disable_impl" @click="cancel">取消</Button>
              <Button type="success" size="large" style="margin-left: 45px" :loading="loading" v-if="!disable_impl" @click="updatePersonInfo">保存</Button>
            </div>
          </Form>
        </TabPane>
        <TabPane label="部门信息">
          <Form :model="department_info" :label-width="80" style="width: 500px;" size="large">
            <FormItem label="部门:">
              <Input :value="department_info.departmentName" readonly></Input>
            </FormItem>
            <br/>
            <FormItem label="联系电话:">
              <Input :value="department_info.telphone" readonly></Input>
            </FormItem>
            <br/>
            <FormItem label="邮箱:">
              <Input :value="department_info.email" readonly></Input>
            </FormItem>
            <br/>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'managerInfo',
        data(){
            return{
                disable_impl: true,
                loading: false,
                person_info:{
                },
                department_info:{

                }
            }
        },
        mounted(){
            this.initPerson("获取个人信息成功！")
            this.initDepartment("获取部门信息成功！")
        },
        methods:{
            initPerson(index){
                let name = localStorage.getItem('username');
                let id = localStorage.getItem('userid');
                axios({
                    url: apiRoot + '/user/info?userId=' + id,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        this.person_info = res.data.data;
                        if(index != ''){
                            this.$Message.success(index)
                        }
                    }else{
                        this.$Message.error("初始化失败！");
                    }
                }).catch((err) => {
                    this.$Message.error('请检查网络连接!')
                })
            },
            initDepartment(index){
                axios({
                    url: apiRoot + '/user/departmentInfo',
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        this.department_info = res.data.data;
                        if(index != ''){
                            this.$Message.success(index)
                        }
                    }else{
                        this.$Message.error("初始化失败！");
                    }
                }).catch((err) => {
                    this.$Message.error('请检查网络连接!')
                })
            },
            updatePersonInfo(){
                this.loading = true;
                axios({
                    url: apiRoot + '/user/userInfoUpdate',
                    method: 'post',
                    data:{
                        userId: this.person_info.userId,
                        email: this.person_info.email,
                        phone: this.person_info.phone
                    }
                }).then((res) => {
                    if(res.data.code == 200){
                        this.initPerson("更新成功！");
                        this.disable_impl = true;
                        this.loading = false;
                    }else{
                        this.$Message.error(res.data.message)
                        this.initPerson('')
                        this.disable_impl = true;
                        this.loading = false;
                    }
                }).catch((err) => {
                    this.$Message.error("个人信息更新失败，请检查网络连接！");
                    this.initPerson('')
                    this.disable_impl = true;
                    this.loading = false;
                })
            },
            cancel(){
                this.disable_impl = true;
                this.initPerson("");
            }
        }
    }
</script>

<style  scoped lang="scss">
  @import "systemInfo";
</style>

<style scoped lang="scss">
  .wrapper {
    margin-top: 0px;
    margin-left: 0px;
    width: 100%;
  }
  .ivu-form-item-label{
    font-size: 24px
  }

  .ivu-tabs-tabpane{
    margin-top: calc(15vh - 0px);
    padding-left: calc(25vw);
  }

</style>
