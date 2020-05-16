<template>
    <el-container class="home_container">
        <el-header >
            <div>
                <i class="el-icon-s-home"></i>
                川师食堂外卖后台管理系统</div>
            <el-button @click="loginOut" type="primary">
                {{username}}注销
            </el-button>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo"
                        background-color="#323744"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        :unique-opened="true"
                >
                    <el-submenu :index="item.id+''"  v-for='item in menuList' :key="item.id">
                        <!--template是 子菜单的模板-->
                        <template slot="title">
                            <i class="el-icon-s-operation"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <el-menu-item :index="child.id+''" v-for="child in item.children" :key="child.id">{{child.name}}</el-menu-item>

                    </el-submenu>

                </el-menu>
            </el-aside>
            <el-main>Main</el-main>
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
                    username:''
            }
        },
        created(){
          this.menuList=this.leftMenu;
          this.username=sessionStorage.getItem("username");
        },
        methods:{
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
        background-color: #373c41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 25px;
        color: #fff;
    }
    .el-aside{
        background-color: #323744;
        .el-menu{
            border-right: none;
        }
    }
    .el-main{
        background-color: #eaedf2;
    }
</style>
