<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>食堂用户</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!--头部-->
            <div slot="header" >
                <el-row :gutter="40">
                    <el-col :span="10"> <el-input placeholder="请输入用户名" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input></el-col>
                    <el-col :span="6"><el-button type="primary" @click="addDialogVisible=true">添加用户</el-button></el-col>
                </el-row>
            </div>
            <el-table
                    :data="userList"
                    border
                    style="width: 100%"
                    stripe
                    border
            >
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="id"
                >
                </el-table-column>
                <!--<el-table-column-->
                        <!--prop="userName"-->
                        <!--label="用户账号"-->
                <!--&gt;-->
                <!--</el-table-column>-->
                <el-table-column
                        prop="trueName"
                        label="姓名"
                >
                </el-table-column>
                <el-table-column
                        prop="resName"
                        label="食堂名称"
                >
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="联系电话">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱">
                </el-table-column>
                <el-table-column
                        prop="sex"
                        label="性别">
                </el-table-column>
                <el-table-column
                        prop="addTime"
                        label="注册时间">
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="权限">
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
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="findAdminById(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            </el-card>
        <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="30%"
                @close="addDialogClosed"
        >
            <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="addForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="再次输入密码" prop="checkPassword">
                    <el-input v-model="addForm.checkPassword"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                    <el-input v-model.number="addForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="真实名字" prop="trueName">
                    <el-input v-model="addForm.trueName"></el-input>
                </el-form-item>
                <el-form-item label="所属食堂" prop="resName">
                    <el-select v-model="addForm.resName" placeholder="请选择食堂">
                        <el-option :label="item.resName" :value="item.resName"
                            v-for="item in resList"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="addForm.sex" placeholder="请选择性别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addAdmin">确 定</el-button>
  </span>
        </el-dialog>
        <el-dialog title="收货地址" :visible.sync="editDialogVisible">
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRules"label-width="80px">
                <el-form-item label="用户id" prop="id">
                    <el-input v-model="editForm.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户真实名字" prop="trueName">
                    <el-input v-model="editForm.trueName"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="用户电话" prop="mobile">
                    <el-input v-model.number="editForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex" >
                    <el-select v-model="editForm.sex" placeholder="请选择性别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限" prop="type" >
                    <el-select v-model="editForm.type" placeholder="请选择权限">
                        <el-option label="管理员" value="1"></el-option>
                        <el-option label="超级管理员" value="0"></el-option>
                    </el-select>
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
        name: "admin",
        data(){
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.addForm.checkPassword !== '') {
                        this.$refs.addFormRef.validateField('checkPassword');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.addForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                userList:[],
                resList:[],
                model:true,
                addDialogVisible:false,
                addForm:{
                    userName:'',
                    password:'',
                    checkPassword:'',
                    mobile:'',
                    email:'',
                    sex:'',
                    trueName:'',
                    resName:''
                },
                addRules:{
                    trueName:[
                        {
                            required:true ,message:"请输入真实姓名",trigger:"blur"
                        },

                        { min: 2, max: 10, message: '长度在 2到 10个字符', trigger: 'blur' }

                    ],
                    userName:[
                        {
                            required:true ,message:"请输入用户名",trigger:"blur"
                        },

                        { min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }

                    ],
                    password:[
                        {
                            required: true ,message: "请输入密码",trigger: "blur"
                        },
                        { validator: validatePass, trigger: 'blur' },
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }

                    ],
                    checkPassword:[
                        { validator: validatePass2, trigger: 'blur' },
                        {
                            required: true ,message: "请输入密码",trigger: "blur"
                        },

                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }

                    ],
                    mobile:[
                        {
                            required: true ,message: "请输入手机号码", trigger: "blur"
                        },
                        // {
                        //     mix: 11, max: 11, message: "手机号码位数不正确" ,trigger:'blur'
                        // },
                        { type: 'number', message: '手机号必须为数字值'}
                    ],
                    email:[
                        {
                            required: true ,message: "请输入邮箱",trigger: "blur"
                        },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    sex:[
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ]
                },
                editDialogVisible:false,
                editForm:{},
                editFormRules:{
                    trueName:[
                        {
                            required:true ,message:"请输入真实姓名",trigger:"blur"
                        },

                        { min: 2, max: 10, message: '长度在 2到 10个字符', trigger: 'blur' }

                    ],
                    type:[
                        { required: true, message: '请选择权限', trigger: 'change' }
                    ]
                    ,
                    mobile:[
                        {
                            required: true ,message: "请输入手机号码", trigger: "blur"
                        },

                        { type: 'number', message: '手机号必须为数字值'}
                    ],
                    email:[
                        {
                            required: true ,message: "请输入邮箱",trigger: "blur"
                        },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    sex:[
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ]
                },
            }
        },
        created() {
            this.getUserList();
            this.getResList();
        },
        methods:{
           async getUserList(){
                const {data} = await  this.$http.get("/findAllAdmin");
                if(data.code===1)
                {
                    this.userList=data.msg;
                }
                else {
                    this.$message.error("获取人员列表失败");
                }
            },
            async getResList(){
               const {data} = await this.$http.get("findAllRes");
               if(data.code===1)
               {
                    this.resList=data.msg;
               }
               else {
                   this.$message.error("获取食堂列表失败");
               }
            },
            addAdmin(){
               this.$refs.addFormRef.validate(async (valid)=>{
                   if(valid==true)
                   {
                       const  {data}= await this.$http.post("/addAdmin",
                       this.addForm);
                       if(data.code===1)
                       {
                           this.$message.success("添加用户成功");
                           this.addDialogVisible=false;
                           this.getUserList();
                       }
                       else
                       {
                           this.$message.error("添加用户失败");
                       }
                   }
                   else
                   {
                       this.$message.error("请按格式输入表单");
                   }
               })
            },
         async   findAdminById(id){
                const {data}= await this.$http.get("/findAdminById",{
                    params:{"id":id}
                });
                if(data.code===1)
                {
                    data.msg.mobile =Number(data.msg.mobile);
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
                        const {data} = await this.$http.post("/editAdmin", this.editForm);
                        if (data.code === 1) {
                            this.$message.success("修改成功");
                            this.getUserList();
                            this.editDialogVisible = !this.editDialogVisible;
                        } else {
                            this.$message.error("修改失败");
                        }
                    } else {
                        this.$message.error("请按格式输入表单");
                    }
                })
            },
                    removeUser(id){
                    this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async  () => {
                        const {data}= await this.$http.get("/removeAdmin",{
                            params:{"id":id}
                        });
                        if(data.code==1)
                        {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getUserList();
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

<style scoped>

</style>
