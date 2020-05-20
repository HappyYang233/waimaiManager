<template>
    <div class="container">
        <div class="title">
            食堂外卖管理系统
        </div>
       <div class="login_box">
           <div class="avatar_box">
               <img src="../assets/logo.png" alt="">
           </div>
           <el-form  ref="loginForm" label-width="80px" class="login_form" :rules="rules" :model="form">
            <el-form-item label="用户名" prop="username">
                <el-input prefix-icon="iconfont icon-user" v-model="form.username" clearable></el-input>
            </el-form-item>
             <el-form-item label="密码" prop="password">
                <el-input show-password prefix-icon="el-icon-lock" v-model="form.password" clearable></el-input>
            </el-form-item>
            <el-form-item class="login_btn" >
                <el-button type="primary"@click="handleLogin">登录</el-button>
                <el-button type="info" @click="handleReset">重置</el-button>
            </el-form-item>

           </el-form>
       </div>
    </div>
</template>
<script>
    import {initRouter} from '../router/index'
export default {
    data() {
        return {
            form:{
                username:'liuhui',
                password:'123456'
            },
            rules:{
                username:[
                    { required: true, message: '请输入账号', trigger: 'blur' }

                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        handleReset(){
            console.log(this);
            this.$refs.loginForm.resetFields();

        },
        handleLogin(){
            this.$refs.loginForm.validate(async (x)=>{
                if(x==true){
                    console.log(this);
                   let {data} =await this.$http.post(
                        "/login",
                        this.form
                    );
                    if(data.code==31){
                        this.$message.error("用户名错误");
                    }
                    else if(data.code==32)
                    {
                        this.$message.error("密码错误");
                    }
                    else if(data.code ==33)
                    {
                        // this.$http.defaults.baseURL="https://www.easy-mock.com/mock/5ebb1a21d3f8d30def6c4938";
                        // let res =await  this.$http.get("/example/getLeftMenu");
                        let msg = data.msg;
                        let token = msg.token;
                        console.log(msg);
                        this.$message.success("登陆成功");
                        sessionStorage.setItem("Token",token);
                        this.$store.commit("setUsername",msg.username);
                        this.$store.commit("setLeftMenu",msg.left);
                        this.$store.commit("setResId",msg.resId);
                        initRouter();
                        this.$router.push("/home");

                    }
                    else{
                        sessionStorage.clear();
                        this.$message.error("请求失败，请重试");
                    }


                }
                else{
                    console.log(x);
                }
            })
        }
    },

}
</script>
<style lang="less" scoped>
.container{
    background-color:#2b4b6b;
    height: 100%;
    .title{
        font-size: 50px;
        text-align: center;
        height: 150px;
        line-height: 150px;
        color: #303133;
    }
   .login_box{
        height: 300px;
        width: 450px;
        border-radius: 3px;
        background-color: #fff;
        position:absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        ;
        .avatar_box{
            padding: 10px;
            border-radius: 50%;
            background-color: #fff;
            box-shadow: 0 0 10px #ddd;
            border:1px solid #eee;
            position:absolute;
            height: 130px;
            width: 130px;
            left: 50%;
            transform: translate(-50%,-50%);

            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
        .login_form{
            position: absolute;
            width: 100%;
            padding: 0 20px;
            bottom: 0;
            box-sizing: border-box;
            .login_btn{
                display: flex;
                justify-content: flex-end;
            }
        }

    }

}
</style>
