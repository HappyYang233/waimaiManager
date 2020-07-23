<template>
    <el-container class="home_container">
        <el-header >
            <div>
                <i class="el-icon-s-home"></i>
                天投超市后台管理系统</div>
            <el-button @click="loginOut" type="primary">
                {{username}}注销
            </el-button>
        </el-header>
        <el-container>
            <el-aside :width="iscollapse?'64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo"
                        background-color="#2C3E50"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        :unique-opened="true"
                        :collapse="iscollapse"
                        :collapse-transition="false"
                        router
                        :default-active="$route.path"
                >
                    <el-submenu :index="item.id+''"  v-for='item in menuList' :key="item.id">
                        <!--template是 子菜单的模板-->
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <el-menu-item v-if="child.path!='/address'" :index="child.path" v-for="child in item.children" :key="child.id">{{child.name}}</el-menu-item>

                    </el-submenu>

                </el-menu>
            </el-aside>
            <el-main><router-view></router-view></el-main>
        </el-container>
    </el-container>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "Home",
        data(){
            return {
                    menuList:[],
                    username:'',
                    iscollapse:false
            }
        },
        created(){
          this.menuList=this.leftMenu;
          console.log("1111111"+ this.menuList.toString());
          this.username=sessionStorage.getItem("username");

        },
        methods:{
            toggleCollapse(){
                this.iscollapse=!this.iscollapse;
            },
            loginOut(){
                this.$confirm('确定注销登录？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    window.sessionStorage.clear();
                    this.$message({
                        type: 'success',
                        message: '注销成功!'
                    });
                    sessionStorage.clear();
                    this.$router.push('/login');
                    window.location.reload();

                });

            }
        },
        computed:{
          ...mapState(['leftMenu'])
        }
    }
</script>

<style lang="less" scoped>
   .home_container{
       height: 100%;

   }
    .el-header{
        /*background-color: #373c41;*/
        background-color:#2C3E50;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 25px;
        color: #fff;
    }
    .el-aside{
        background-color: #2C3E50;
        .el-menu{
            border-right: none;

        }
        .toggle-button{
            background-color: #2C3E50;
            font-size: 10px;
            line-height: 24px;
            letter-spacing: 0.2em;
            text-align: center;
            color: #fff;
        }
    }
    .el-main{
        background-color: #eaedf2;
    }
</style>
