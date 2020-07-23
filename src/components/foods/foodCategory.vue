<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!--头部-->
            <div slot="header" >
                <el-row :gutter="40">

                    <el-col :span="6"><el-button type="primary" @click="addDialogVisible=true;">添加分类</el-button></el-col>
                </el-row>
            </div>
            <el-table
                    :data="cateList"
                    border
                    style="width: 100%"
                    stripe

            >
                <el-table-column type="index" label="#">
                </el-table-column>
                <!--<el-table-column-->
                        <!--prop="id"-->
                        <!--label="id"-->
                <!--&gt;-->
                <!--</el-table-column>-->
                <el-table-column
                        prop="name"
                        label="分类名称">
                </el-table-column>
                <el-table-column
                        prop="desc"
                        label="分类描述">
                </el-table-column>
                <el-table-column
                        prop="addTime"
                        label="加入时间"
                >
                </el-table-column>
                <el-table-column
                        prop=""
                        label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="修改" placement="top"  :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="findCateById(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>

                </el-table-column>
            </el-table>
            <el-dialog
                    title="添加商品分类"
                    :visible.sync="addDialogVisible"
                    width="50%"
                    @close="addDialogClosed"
            >
                <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="分类名称" prop="name">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="分类描述" prop="desc">
                        <el-input v-model="addForm.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="加入时间" prop="addTime">
                        <el-date-picker
                                v-model="addForm.addTime"
                                align="right"
                                type="date"
                                placeholder="选择日期"
                                :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                               >
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
            </el-dialog>
            <el-dialog title="修改分类信息" :visible.sync="editDialogVisible">
                <el-form ref="editFormRef" :model="editForm" :rules="editFormRules"label-width="80px">
                    <el-form-item label="分类id" prop="id">
                        <el-input v-model="editForm.id" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="分类名称" prop="name">
                        <el-input v-model="editForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="desc">
                        <el-input v-model="editForm.desc"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleEdit">确 定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "foodCategory",
        data(){
            return {
                addDialogVisible:false,
                editDialogVisible:false,
                cateList:[],
                addForm: {
                    name:'',
                    desc:'',
                    addTime:'',
                },
                addRules:{
                    name:[
                        {
                            required:true ,message:"请输入分类名称",trigger:"blur"
                        },

                        { min: 1, max: 10, message: '长度在 2到 10个字符', trigger: 'blur' }
                    ],
                    addTime:[
                        {
                            // required:true,message:"请选择日期",trigger:"blur"
                            type: 'string', required: true, message: '请选择日期', trigger: 'change'
                        }
                    ]
                },
                editForm:{},
                editFormRules:{
                    name:[
                        {
                            required:true ,message:"请输入分类名称",trigger:"blur"
                        },

                        { min: 1, max: 10, message: '长度在 2到 10个字符', trigger: 'blur' }
                    ]
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                }
            }
            },
        created() {
            this.getCate();
        },
        methods:{
            async getCate()
            {
                const {data}= await this.$http.get("/getCate",{
                    params:{resId:this.resId}
                });
                if(data.code===1)
                {
                    this.cateList=data.msg;
                }
                else
                {
                    this.$message.error(data.msg);
                }
            },
            addCate(){
              this.$refs.addFormRef.validate(async (valid)=>{
                  if(valid==true)
                  {
                      const {data}= await this.$http.post("/addCate",{
                          resId:this.resId,
                          addForm:this.addForm
                      });
                      if(data.code===1)
                      {
                          this.$notify({
                              title: '成功',
                              message: data.msg,
                              type: 'success'
                          });
                          this.addDialogVisible=false;
                          this.getCate();
                      }
                      else
                      {
                          this.$notify.error({
                              title: '失败',
                              message: data.msg
                          });
                      }
                  }
                  else
                  {
                      this.$message.error("请按格式输入表单");
                  }
              })
            },
            async findCateById(id)
            {
                const  {data} = await this.$http.get("/findCateById",{
                    params:{id:id}
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
                        const {data} = await this.$http.post("/editCate", this.editForm);
                        if (data.code === 1) {
                            this.$message.success("修改成功");
                            this.getCate();
                            this.editDialogVisible = !this.editDialogVisible;
                        } else {
                            this.$message.error(data.msg);
                        }
                    } else {
                        this.$message.error("请按格式输入表单");
                    }
                })
            },
            removeCate(id){
                this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async  () => {
                    const {data}= await this.$http.get("/removeCate",{
                        params:{"id":id}
                    });
                    if(data.code==1)
                    {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getCate();
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
