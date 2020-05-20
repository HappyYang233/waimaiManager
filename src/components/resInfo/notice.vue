<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>食堂信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>公告管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-input
                    type="textarea"
                    :rows="5"
                    placeholder="请输入内容"
                    v-model="notice"
                    disabled
            >
            </el-input>
            <div class="edit-btnBox">
                <el-tooltip class="item" effect="dark" content="修改" placement="top"  :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialogVisible=true"></el-button>
                </el-tooltip>
            </div>

        </el-card>
        <el-dialog title="公告" :visible.sync="editDialogVisible">
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRules"label-width="80px">

                <el-form-item label="公告" prop="notice">
                    <el-input v-model="editForm.notice" type="textarea" rows="8"></el-input>
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
        name: "notice",
        data(){
            return {
                editDialogVisible:false,
                notice:'sdasdasdasdasd',
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
