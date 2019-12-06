<template>
  <div class="wrapper">
    <div class="content">
      <Form :model="person_info" :label-width="80" style="width: 500px;" size="large">
        <FormItem label="部门:">
          <Input v-model="department_info.departmentName" disabled ></Input>
        </FormItem>
        <br/>
        <FormItem label="手机:">
          <Input v-model="department_info.telphone" :disabled="disable_impl"></Input>
        </FormItem>
        <br/>
        <FormItem label="邮箱:">
          <Input v-model="department_info.email" :disabled="disable_impl"></Input>
        </FormItem>
        <br/>
        <div>
          <Button type="primary" size="large" style="margin-left: 45px" v-if="disable_impl" @click="disable_impl=!disable_impl">修改</Button>
          <Button type="success" size="large" style="margin-left: 45px" v-if="!disable_impl" @click="updatePersonInfo">保存</Button>
        </div>
      </Form>
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
                department_info:{
                },

            }
        },
        mounted(){
            this.init("获取部门信息成功！")
        },
        methods:{
            init(index){
                let name = localStorage.getItem('username');
                let id = localStorage.getItem('userid');
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
                axios({
                    url: apiRoot + '/manager/departmentUpdate',
                    method: 'post',
                    data:{
                        id: this.department_info.id,
                        email: this.department_info.email,
                        telphone: this.department_info.telphone
                    }
                }).then((res) => {
                    if(res.data.code == 200){
                        this.init("更新成功！");
                    }else{
                        this.$Message.error(res.data.message)
                        this.init("");
                    }
                }).catch((err) => {
                    this.$Message.error("部门信息更新失败，请检查网络连接！");
                    this.init("");
                })
                this.disable_impl = true;
            }
        }
    }
</script>

<style  scoped lang="scss">
  @import "departmentInfo";
</style>

<style scoped lang="scss">
  .wrapper {
    margin-top: calc(15vh - 0px);
    margin-left: calc(25vw);
    width: 100%;
    text-align: center;
  }
  .ivu-form-item-label{
    font-size: 24px
  }
</style>
