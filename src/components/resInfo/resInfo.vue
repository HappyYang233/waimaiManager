<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>食堂信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>基本信息管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!--头部-->
            <div slot="header" >
                <el-row :gutter="40">
                    <el-col :span="10"> <el-input placeholder="请输入用户名" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input></el-col>
                    <el-col :span="6"><el-button type="primary" @click="addDialogVisible=true;">添加食堂</el-button></el-col>
                </el-row>
            </div>
            <el-table
                    :data="resList"
                    border
                    style="width: 100%"
                    stripe
                    v-loading="loading"
            >
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="id"
                >
                </el-table-column>
                <el-table-column
                        prop="resName"
                        label="食堂名称"
                >
                </el-table-column>
                <el-table-column
                        prop="contactName"
                        label="联系人">
                </el-table-column>
                <el-table-column
                        prop="contactMobile"
                        label="联系人电话">
                </el-table-column>
                <el-table-column
                        prop="resImageUrl"
                        label="食堂首页图片"
                >
                    <template slot-scope="scope">
                        <!--<img :src="scope.row.resImageUrl" min-width="120" height="70">-->
                        <div class="img-box">
                        <el-image
                                style="width: 100px; height: 100px"
                                :src="scope.row.resImageUrl"
                                fit="fit"></el-image>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="model"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        prop=""
                        label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="修改" placement="top"  :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="findResById(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRes(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>

                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog
                title="添加食堂"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed"
        >
            <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="食堂名称" prop="resName">
                    <el-input v-model="addForm.resName"></el-input>
                </el-form-item>
                <el-form-item label="联系人姓名" prop="contactName">
                    <el-input v-model="addForm.contactName"></el-input>
                </el-form-item>
                <el-form-item label="联系人手机号码" prop="contactMobile">
                    <el-input v-model.number="addForm.contactMobile"></el-input>
                </el-form-item>
                <el-form-item label="食堂图片url" prop="resImageUrl">
                    <el-input v-model="addForm.resImageUrl"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRes">确 定</el-button>
  </span>
        </el-dialog>
        <el-dialog title="收货地址" :visible.sync="editDialogVisible">
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRules"label-width="80px">
                <el-form-item label="食堂名称" prop="id">
                    <el-input v-model="editForm.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="食堂名称" prop="resName">
                    <el-input v-model="editForm.resName"></el-input>
                </el-form-item>
                <el-form-item label="联系人姓名" prop="contactName">
                    <el-input v-model="editForm.contactName"></el-input>
                </el-form-item>
                <el-form-item label="联系人手机号码" prop="contactMobile">
                    <el-input v-model.number="editForm.contactMobile"></el-input>
                </el-form-item>
                <el-form-item label="食堂图片url" prop="resImageUrl">
                    <el-input v-model="editForm.resImageUrl"></el-input>
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
    export default {
        name: "resInfo",
        data(){
            return {
                loading:true,
                resList:[],
                model:true,
                addDialogVisible:false,
                addForm: {
                    resName:'',
                    contactName:'',
                    contactMobile:'',
                    resImageUrl:''
                },
                addRules:{
                    contactName:[
                        {
                            required:true ,message:"请输入联系人姓名",trigger:"blur"
                        },

                        { min: 2, max: 10, message: '长度在 2到 10个字符', trigger: 'blur' }

                    ],
                    resName:[
                        {
                            required:true ,message:"请输入食堂名字",trigger:"blur"
                        },

                        { min: 3, max: 15, message: '长度在 1到 10个字符', trigger: 'blur' }

                    ],

                    contactMobile:[
                        {
                            required: true ,message: "请输入手机号码", trigger: "blur"
                        },
                        // {
                        //     mix: 11, max: 11, message: "手机号码位数不正确" ,trigger:'blur'
                        // },
                        { type: 'number', message: '手机号必须为数字值'}
                    ],
                    resImageUrl:[
                        {
                            required: true ,message: "请输入图片链接", trigger: "blur"
                        }
                    ]
                },
                editDialogVisible:false,
                editForm:{},
                editFormRules:{
                    contactName:[
                        {
                            required:true ,message:"请输入联系人姓名",trigger:"blur"
                        },

                        { min: 2, max: 10, message: '长度在 2到 10个字符', trigger: 'blur' }

                    ],
                    resName:[
                        {
                            required:true ,message:"请输入食堂名字",trigger:"blur"
                        },

                        { min: 3, max: 15, message: '长度在 1到 10个字符', trigger: 'blur' }

                    ],

                    contactMobile:[
                        {
                            required: true ,message: "请输入手机号码", trigger: "blur"
                        },
                        // {
                        //     mix: 11, max: 11, message: "手机号码位数不正确" ,trigger:'blur'
                        // },
                        { type: 'number', message: '手机号必须为数字值'}
                    ],
                    resImageUrl:[
                        {
                            required: true ,message: "请输入图片链接", trigger: "blur"
                        }
                    ]
                },
            }
        },
        created() {
            this.getResList();
        },
        methods:{
            async getResList()
            {
                const {data}= await this.$http.get("/findAllRes");
                if(data.code===1)
                {
                    this.resList=data.msg;
                    this.loading=false;
                }
                else
                {
                    this.$message.error(data.msg);
                }
            },
            addRes(){
                this.$refs.addFormRef.validate(async (valid)=>{
                    if(valid==true)
                    {
                        const  {data}= await this.$http.post("/addRes",
                            this.addForm);
                        if(data.code===1)
                        {
                            this.$message.success("添加食堂成功");
                            this.addDialogVisible=false;
                            this.getResList();
                        }
                        else
                        {
                            this.$message.error("添加食堂失败");
                        }
                    }
                    else
                    {
                        this.$message.error("请按格式输入表单");
                    }
                })
            },
            async   findResById(id){
                const {data}= await this.$http.get("/findResById",{
                    params:{"id":id}
                });
                if(data.code===1)
                {
                    data.msg.contactMobile =Number(data.msg.contactMobile);
                    this.editForm=data.msg;
                    this.editDialogVisible=!this.editDialogVisible;
                }
                else {
                    this.$message.error(data.msg);
                }
            },
            handleEdit() {
                this.$refs.editFormRef.validate(async valid => {
                    if (valid == true) {
                        const {data} = await this.$http.post("/editRes", this.editForm);
                        if (data.code === 1) {
                            this.$message.success("修改成功");
                            this.getResList();
                            this.editDialogVisible = !this.editDialogVisible;
                        } else {
                            this.$message.error(data.msg);
                        }
                    } else {
                        this.$message.error("请按格式输入表单");
                    }
                })
            },
            removeRes(id){
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async  () => {
                    const {data}= await this.$http.get("/removeRes",{
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
        }

    }
</script>

<style lang="less" scoped>
        /*img{*/
            /*width: 100%;*/
            /*height: 100%;*/
        /*}*/
        .img-box{
            display: flex;
            justify-content: center;
            align-items: center;
            el-image{

            }
        }


</style>
