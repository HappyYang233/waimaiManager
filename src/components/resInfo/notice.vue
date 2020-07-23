<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商户信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>公告管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <!--头部-->
            <div slot="header" >
                <el-row :gutter="40">
                    <!--<el-col :span="10"> <el-input placeholder="请输入用户名" class="input-with-select">-->
                    <!--<el-button slot="append" icon="el-icon-search"></el-button>-->
                    <!--</el-input></el-col>-->
                    <el-col :span="6"><el-button type="primary" @click="addDialogVisible=true;">添加公告</el-button></el-col>
                </el-row>
            </div>
            <el-table
                    :data="notice"
                    border
                    style="width: 100%"
                    stripe
            >
                <el-table-column type="index" label="#">
                </el-table-column>
                <!--<el-table-column-->
                <!--prop="id"-->
                <!--label="id"-->
                <!--width="80px"-->
                <!--&gt;-->
                <!--</el-table-column>-->
                <el-table-column
                        prop="content"
                        label="公告内容"
                >
                </el-table-column>
                <el-table-column
                        prop="addTime"
                        label="发布时间">
                </el-table-column>
                <!--<el-table-column-->
                <!--prop="foodType"-->
                <!--label="商品类型"-->
                <!--width="80px"-->
                <!--&gt;-->
                <!--<template slot-scope="scope">-->
                <!--<div>{{scope.row.foodType==0?'午餐':'晚餐'}}</div>-->
                <!--</template>-->
                <!--</el-table-column>-->

                <el-table-column
                        prop="status"
                        label="公告上下架"
                >
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.status==0?'下架':'上架'" placement="top">
                            <el-switch
                                    v-model="scope.row.status"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    :inactive-value="1"
                                    :active-value="0"
                                    @change="switchChange($event,scope.row.id,scope.$index)">
                            </el-switch>
                        </el-tooltip>
                    </template>

                </el-table-column>
                <el-table-column
                        prop=""
                        label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="修改" placement="top"  :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="findFoodById(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeFood(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>

                </el-table-column>
            </el-table>
            <!--<el-pagination-->
                    <!--@size-change="handleSizeChange"-->
                    <!--@current-change="handleCurrentChange"-->
                    <!--:current-page="queryInfo.pageNum"-->
                    <!--:page-sizes="[3, 10]"-->
                    <!--:page-size="queryInfo.pageSize"-->
                    <!--layout="total, sizes, prev, pager, next, jumper"-->
                    <!--:total="total">-->
            <!--</el-pagination>-->
        </el-card>
        <el-dialog
                title="添加公告"
                :visible.sync="addDialogVisible"
                width="30%"
                @close="addDialogClosed"
        >
            <!--<el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">-->
                <!--<el-form-item label="公告内容" prop="content">-->
                    <!--<el-input v-model="addForm.foodName"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="加入时间" prop="addTime">-->
                    <!--<el-date-picker-->
                            <!--v-model="addForm.addTime"-->
                            <!--align="right"-->
                            <!--type="date"-->
                            <!--placeholder="选择日期"-->
                            <!--:picker-options="pickerOptions"-->
                            <!--value-format="yyyy-MM-dd" format="yyyy-MM-dd"-->
                    <!--&gt;-->
                    <!--</el-date-picker>-->
                <!--</el-form-item>-->
                <!--&lt;!&ndash;<el-form-item label="商品类型" prop="foodType">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-select v-model="addForm.foodType" placeholder="请选择类型">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-option label="午餐" value="午餐">&ndash;&gt;-->
                <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
                <!--&lt;!&ndash;<el-option label="晚餐" value="晚餐">&ndash;&gt;-->
                <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->

            <!--</el-form>-->
            <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addFood">确 定</el-button>
  </span>
        <!--</el-dialog>-->
        <!--<el-dialog title="修改商品信息" :visible.sync="editDialogVisible">-->
            <!--<el-form ref="editFormRef" :model="editForm" :rules="editFormRules"label-width="80px">-->
                <!--<el-form-item label="商品名称" prop="foodName">-->
                    <!--<el-input v-model="editForm.foodName" ></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="商品分类" prop="">-->
                    <!--<el-select v-model="editForm.cateId" placeholder="请选择分类">-->
                        <!--<el-option :label="item.name" :value="item.id"-->
                                   <!--v-for="item in cateList"-->
                        <!--&gt;</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--&lt;!&ndash;<el-form-item label="商品类型" prop="foodType">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-select v-model="editForm.foodType" placeholder="请选择类型">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-option label="午餐" value="午餐">&ndash;&gt;-->
                <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
                <!--&lt;!&ndash;<el-option label="晚餐" value="晚餐">&ndash;&gt;-->
                <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                <!--<el-form-item label="商品描述" prop="desc">-->
                    <!--<el-input v-model.number="editForm.desc"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="商品图片url" prop="foodImageUrl">-->
                    <!--<el-input v-model="editForm.foodImageUrl"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="价格" prop="price">-->
                    <!--<el-input v-model.number="editForm.price"></el-input>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "notice",
        data(){
            return {
                editDialogVisible:false,
                notice: [
                    {content:"欢迎光临",addTime:"2020-7-10",status:"0"}
                ],
                editForm:{
                    notice:''
                },

                editFormRules:{
                    notice:[
                        {
                            min: 0, max: 200, message: '长度在 2到 200个字符', trigger: 'blur'
                        }
                    ]
                }
            }
        },
        created() {
            this.getNotice();
        },
        methods:{
            async getNotice()
            {
                const  {data} = await this.$http.get("/findResById",{
                    params:{id:this.resId}
                });
                if(data.code===1)
                {
                    this.notice=data.msg.notice;
                    this.editForm.notice=this.notice;

                }
                else {
                    this.$message.error("获取公告失败");
                }
            },
            handleEdit(){
                const h = this.$createElement;
                this.$refs.editFormRef.validate(async (valid)=>{
                    if(valid==true)
                    {
                        const {data}=await this.$http.get("/editNotice",{
                            params:{resId:this.resId,notice:this.editForm.notice}
                        });
                        if(data.code===1)
                        {
                            // this.$message.success(data.msg);
                            this.$notify({
                                title: '公告修改',
                                message: h('i', { style: 'color: teal'},data.msg)
                            });
                            this.getNotice();
                            this.editDialogVisible=false;
                        }
                        else
                        {
                            this.$notify({
                                title: '公告修改',
                                message: h('i', { style: 'color: teal'},data.msg)
                            });
                            // this.$message.error(data.msg);
                        }
                    }
                    else {
                        this.$message.error("请按格式输入表单");
                    }
                })
            }
        },
        computed:{
            ...mapState(['resId'])
        }
    }
</script>

<style lang="less" scoped>
    .edit-btnBox{
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;

    }
</style>
