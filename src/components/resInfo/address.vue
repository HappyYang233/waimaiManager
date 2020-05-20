<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>食堂信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>地址管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!--头部-->
            <div slot="header" >
                <el-row :gutter="40">
                    <el-col :span="10"> <el-input placeholder="请输入用户名" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input></el-col>
                    <el-col :span="6"><el-button type="primary" @click="addDialogVisible=true">添加地址</el-button></el-col>
                </el-row>
            </div>
            <el-table
                    :data="addressList"
                    border
                    style="width: 100%"
                    stripe
            >
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="id"
                >
                </el-table-column>
                <el-table-column
                        prop="addressInfo"
                        label="地址详情"
                >
                </el-table-column>

                <el-table-column
                        prop=""
                        label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="修改" placement="top"  :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAddress(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAddress(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog
                title="添加地址"
                :visible.sync="addDialogVisible"
                width="30%"
                @close="addDialogClosed"
        >
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="地址详情" prop="addressInfo">
                    <el-input v-model="addForm.addressInfo"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addAddress">确 定</el-button>
  </span>
        </el-dialog>
        <el-dialog title="收货地址" :visible.sync="editDialogVisible">
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRules"label-width="80px">
                <el-form-item label="食堂id" prop="id">
                    <el-input v-model="editForm.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="食堂地址" prop="addressInfo">
                    <el-input v-model="editForm.addressInfo"></el-input>
                </el-form-item>

            </el-form>
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
        name: "address",
        data(){
            return {
                addressList:[],
                editDialogVisible:false,
                addDialogVisible:false,
                addForm:{
                    addressInfo:'',
                },
                addFormRules:{
                    addressInfo:[
                        {
                            required:true ,message:"请输入地址",trigger:"blur"
                        }
                    ]
                },
                editForm:[],
                editFormRules:{
                    addressInfo:[
                        {
                            required:true ,message:"请输入地址",trigger:"blur"
                        }
                        ]
                }
            }
        },
        created() {
            this.getAddressList();
        },
        methods:{
            async  getAddressList(){
                let resId=this.resId;
                const  {data} = await this.$http.get("/getAddressList",{
                    params:{'resId':resId}
                });
                if(data.code===1)
                {
                    this.addressList=data.msg;

                }
                else
                {
                    this.$message.error(data.msg);
                }
            },
            addAddress(){
                this.$refs.addFormRef.validate(async (valid)=>{
                    if(valid==true)
                    {

                        const  {data}= await this.$http.post("/addAddress",
                            {
                                resId:this.resId,
                                addForm:this.addForm
                            }
                        );
                        if(data.code===1)
                        {
                            this.$message.success("添加地址成功");
                            this.addDialogVisible=false;
                            this.getAddressList();
                        }
                        else
                        {
                            this.$message.error("添加地址失败");
                        }
                    }
                    else
                    {
                        this.$message.error("请按格式输入表单");
                    }
                })
            },
          async  editAddress(id){
               const  {data}=await  this.$http.get("/findAddressById",{
                   params:{'id':id}
               });
              if(data.code===1)
              {
                  this.editForm=data.msg;
                  this.editDialogVisible=!this.editDialogVisible;
              }
              else {
                  this.$message.error(data.msg);
              }
            },
            handleEdit(){
                this.$refs.editFormRef.validate(async valid => {
                    if (valid == true) {
                        const {data} = await this.$http.post("/editAddress", this.editForm);
                        if (data.code === 1) {
                            this.$message.success("修改成功");
                            this.getAddressList();
                            this.editDialogVisible = !this.editDialogVisible;
                        } else {
                            this.$message.error("修改失败");
                        }
                    } else {
                        this.$message.error("请按格式输入表单");
                    }
                })
            },
            removeAddress(id){
                this.$confirm('此操作将永久删除该地址, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async  () => {
                    const {data}= await this.$http.get("/removeAddress",{
                        params:{"id":id}
                    });
                    if(data.code==1)
                    {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getResList();
                    }
                    else{
                        this.$message.error("删除失败");
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            addDialogClosed(){
                this.$refs.addFormRef.resetFields();
            }
        },
        computed:{
            ...mapState(['resId'])
        }
    }
</script>

<style scoped>

</style>
