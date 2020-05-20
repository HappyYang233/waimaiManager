<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
            <el-breadcrumb-item>当日订单</el-breadcrumb-item>
        </el-breadcrumb>
            <el-select v-model="foodType" placeholder="请选择类型" @change="getOrderList">
                <el-option label="午餐" value=0>
                </el-option>
                <el-option label="晚餐" value=1>
                </el-option>
        </el-select>
        <el-card class="box-card" style="margin-top: 20px">
            <div slot="header" class="clearfix">
                <span>当日订单</span>
                <el-button  style="float: right" type="primary" @click="printOrder" >打印订单</el-button>
            </div>
            <el-table id="table"
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
                        width="80px"
                >
                </el-table-column>
                <el-table-column
                        prop="num"
                        label="当日编号"
                        width="80px"
                >
                </el-table-column>
                <el-table-column
                        prop="foodType"
                        label="用餐类型"
                        width="80px"
                >
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.foodType==0?'午餐':'晚餐'}}
                        </div>
                    </template>
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
        </el-card>
    </div>
</template>
<script>

    import {mapState} from 'vuex'
    export default {
        name: "todayOrder",
        data(){
            return {
                foodType:'',
                orderList:[],
                date:''
            }
        },
        created() {
        },
        methods:{
            async getOrderList(){
                const date = new Date().Format("yyyy-MM-dd");
                this.date=date;
                let {data} = await  this.$http.get("/findOrderByDate",{
                    params:{
                        resId:this.resId,
                        date:date,
                        foodType:this.foodType
                    }
                });
                if(data.code===1)
                {
                    this.orderList=data.msg;
                }
                else
                {
                    this.$message.error(data.msg);
                }
            },
            printOrder(){
                this.orderList.forEach(x1=>{
                    let list = x1.list;
                    let  string ='';
                    list.forEach(x2=>{
                        string = string+x2.foodName.toString()+'  *'+x2.num+"\n"
                    });
                    x1.string=string;
                    console.log(string);
                });
                // const  list =this.orderList[0].list;
                // console.log(list);
                // let  string ='';
                //     list.forEach(x=>{
                //     string = string+x.foodName.toString()+'  *'+x.num+"\n"
                // })
                // console.log(string);
                // printJS('table', 'html')
                printJS({
                    printable: this.orderList,
                    properties: [
                        {field:'num',displayName:'编号'},
                        {field:'foodType',displayName:'用餐类型'},
                        {field:'string',displayName:'订单菜品'},
                        {field:'addTime',displayName:'下单时间'},
                        {field:'address',displayName:'收获地址'},
                        {field:'getName',displayName:'收货人名字'},
                        {field:'getMobile',displayName:'收货人电话'}
                    ],
                    type: 'json',
                    gridHeaderStyle: 'color: red;  border: 2px solid #3971A5;',
                    gridStyle: 'border: 2px solid #3971A5;',
                    header: '<h3 class="custom-h3">订单表</h3>',
                })
            }
        },
        computed:{
            ...mapState(['resId'])
        }
    }
</script>

<style scoped>

</style>
