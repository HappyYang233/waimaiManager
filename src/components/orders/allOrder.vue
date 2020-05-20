<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>所有订单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!--头部-->
            <div slot="header" >
                <el-row :gutter="40">

                    <el-col :span="6"><el-button type="primary" @click="addDialogVisible=true;">打印订单</el-button></el-col>
                </el-row>
            </div>
            <el-table
                    :data="orderList"
                    border
                    style="width: 100%"
                    stripe
            >
                <el-table-column type="index" label="#" >
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="订单编号"
                >
                </el-table-column>
                <el-table-column
                        prop="num"
                        label="当日编号"
                >
                </el-table-column>
                <el-table-column
                        prop="list"
                        label="订单菜品" min-width="180">
                    <template slot-scope="scope">
                        <div v-for=" item in scope.row.list">
                            {{item.foodName}} *数量:{{item.num}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="addTime"
                        label="下单时间">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="收获地址"
                >
                </el-table-column>
                <el-table-column
                        prop="getName"
                        label="收货人名字"
                >
                </el-table-column>
                <el-table-column
                    prop="getMobile"
                    label="收货人电话"
            >
            </el-table-column>

                <el-table-column
                        prop="status"
                        label="状态">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.status==0?'待完成':scope.row.status==1?'已完成':'已取消'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="openId"
                        label="下单用户"
                >
                </el-table-column>
                <el-table-column
                        prop=""
                        label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeOrder(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>

                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pageNum"
                    :page-sizes="[queryInfo.pageSize, 10]"
                    :page-size="queryInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "allOrder",
        data(){
            return {
                queryInfo:{
                    pageNum:1,
                    pageSize:3,
                    query:""
                },
                orderList:[],
                total:0
            }
        },
        created() {
            this.getOrderList();
        },
        methods:{
            async getOrderList(){
                this.queryInfo.resId=this.resId;
                let {data} = await  this.$http.get("/findOrderByPage",{
                    params:this.queryInfo
                });
                if(data.code===1)
                {
                    this.orderList=data.msg.list;
                    this.total=data.msg.total;
                }
                else
                {
                    this.$message.error(data.msg);
                }
            },
            async removeOrder(id){
                this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async  () => {
                    const {data}= await this.$http.get("/removeOrder",{
                        params:{"id":id}
                    });
                    if(data.code==1)
                    {
                        this.$message({
                            type: 'success',
                            message: '删除订单成功!'
                        });
                        this.getOrderList();
                    }
                    else{
                        this.$message.error(data.msg);
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSizeChange(newSize){
                this.queryInfo.pageSize=newSize;
                this.getOrderList();
            },
            handleCurrentChange(newPageNum){
                this.queryInfo.pageNum=newPageNum;
                this.getOrderList();
            }
        },
        computed:{
                ...mapState(['resId'])
        }
    }
</script>

<style scoped>

</style>
