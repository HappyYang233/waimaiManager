<template>
    <div>
        <el-button @click="loginOut">
            注销
        </el-button>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data(){
            return {

            }
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
                    this.$router.push('/login');

                });

            }
        }
    }
</script>

<style scoped>

</style>
