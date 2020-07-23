<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单统计</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>收益统计</span>

            </div>
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-card shadow="always">
                        <div slot="header" class="clearfix onedayMoney" >
                            <span>总营业额</span>
                            <el-date-picker style="visibility: hidden"
                                    v-model="value1"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <div style="text-align: center">
                            <i class="el-icon-money"  style="font-size: 40px"></i> {{allMoney}} 元
                        </div>

                </el-card></el-col>
                <el-col :span="8">
                    <el-card shadow="always">
                        <div slot="header" class="clearfix onedayMoney" >
                            <span>当日营业额</span>
                            <el-date-picker
                                    v-model="time"
                                    align="right"
                                    type="date"
                                    placeholder="选择日期"
                                    value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                    @change="getOneDayMoney">
                        </el-date-picker>
                        </div>
                        <div style="text-align: center"> <i class="el-icon-money" style="font-size: 40px"></i> {{oneMoney}} 元</div>
                </el-card></el-col>
            </el-row>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>图标统计</span>

            </div>
            <el-tabs type="border-card">
                <!--<el-tab-pane label="送货地点统计">-->
                    <!--<div id="address" style="width: 600px;height:400px;"></div>-->
                <!--</el-tab-pane>-->
                <el-tab-pane label="近七日订单量统计">
                    <div id="sales" style="width: 600px;height:400px;"></div>
                </el-tab-pane>

            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import echarts from "echarts"
    export default {
        name: "statisticsOrder",
        data(){
            return {
                allMoney:0,
                oneMoney:0,
                time:'',
                optionAddress :{
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 10,
                        data: [],
                    },
                    series: [
                        {
                            name: '取餐地址',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: true
                            },
                            data: [

                            ]
                        }
                    ]
                },
                optionSales: {
                    xAxis: {
                        type: 'category',
                        data: [],
                        "axisLabel":{
                            interval: 0
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [],
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(220, 220, 220, 0.8)'
                        },
                        label:{
                            show:true,
                            position:'top'
                        }
                    }]
                },
            }
        },
        created(){
          this.time= new Date().Format("yyyy-MM-dd");
          this.getOneDayMoney();
          this.getAllMoney();
        },
       mounted() {
            this.initAddressOption();
            // 指定图表的配置项和数据
           this.initSalesOption();
        },
        methods:{
            async initSalesOption(){
                var myChart = echarts.init(document.getElementById('sales'));
                const {data} = await this.$http.get("/countSales",{
                    params:{resId:this.resId}
                });
                if(data.code===1)
                {
                    let curTime = new Date();
                    let temp=curTime;
                    let daylist=[];
                    daylist.push(curTime.Format("yyyy-MM-dd"));
                    for(let i=0;i<6;i++)
                    {
                        // var preTime = new Date(temp.getTime() - 24*60*60*1000);
                        let preTime=new Date(temp.getTime()- 24*60*60*1000);
                        temp=preTime;
                        daylist.push(preTime.Format("yyyy-MM-dd"));
                    }
                    daylist=daylist.reverse();
                    let seriesList=[0,0,0,0,0,0,0];
                    let returnList=data.msg||[];
                    daylist.forEach((item,index)=>{
                        returnList.forEach(x=>{
                            if(item===x.addTime)
                            {
                                seriesList[index]=x.num;
                            }
                        })
                    });
                    console.log(daylist);
                    console.log(seriesList);
                    this.optionSales.xAxis.data=daylist;
                    this.optionSales.series[0].data=seriesList;
                    myChart.setOption(this.optionSales);
                }


            },
            async initAddressOption(){
                var myChart = echarts.init(document.getElementById('address'));
                const  {data} = await this.$http.get("/countAddress",{
                    params:{resId:this.resId}
                });
                if(data.code===1)
                {
                    let initlist = data.msg;
                    let seriesData = [];
                    let legendData=[]
                    initlist.forEach((item,index)=>{
                        let temp={};
                        temp.value=item.num;
                        temp.name=item.address;
                        console.log(temp);
                       seriesData[index]=temp;
                        legendData.push(item.address);
                    });
                    console.log(seriesData.toString()+'\n'+legendData);
                    this.optionAddress.legend.data=legendData;
                    this.optionAddress.series[0].data=seriesData;
                    myChart.setOption(this.optionAddress);
                }
                else
                {

                }
            },
         async  getOneDayMoney()
         {
             const {data} = await this.$http.get("/getOneDayMoney",{
                 params:{"time":this.time,"resId":this.resId}
             });
             if(data.code===1){
                 this.oneMoney=data.msg;
             }
             else if(data.code==-0)
             {
                 this.oneMoney=data.msg;
             }
             else {
                 this.$message.error("获取当日销售额失败");
             }

         },
         async getAllMoney(){
             const {data} = await this.$http.get("/getAllMoney",{
                 params:{"resId":this.resId}
             });
             if(data.code===1){
                 this.allMoney=data.msg;
             }
             else if(data.code==-0)
             {
                 this.allMoney=data.msg;
             }
             else {
                 this.$message.error("获取当日销售额失败");
             }
         }
        },
        computed:{
            ...mapState(['resId'])
        }
    }
</script>

<style lang="less" scoped>
    .el-card{
        margin-bottom: 20px;
    }
    .onedayMoney{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
