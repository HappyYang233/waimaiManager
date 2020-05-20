<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>菜品管理</el-breadcrumb-item>
            <el-breadcrumb-item>菜品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!--头部-->
            <div slot="header" >
                <el-row :gutter="40">
                    <el-col :span="10"> <el-input placeholder="请输入用户名" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input></el-col>
                    <el-col :span="6"><el-button type="primary" @click="addDialogVisible=true;">添加菜品</el-button></el-col>
                </el-row>
            </div>
            <el-table
                    :data="foodList"
                    border
                    style="width: 100%"
                    stripe
            >
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="id"
                        width="80px"
                >
                </el-table-column>
                <el-table-column
                        prop="foodName"
                        label="菜品名称"
                >
                </el-table-column>
                <el-table-column
                        prop="cateName"
                        label="菜品所属分类">
                </el-table-column>
                <el-table-column
                        prop="foodType"
                        label="菜品类型"
                        width="80px"
                >
                    <template slot-scope="scope">
                        <div>{{scope.row.foodType==0?'午餐':'晚餐'}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="foodImageUrl"
                        label="菜品图片"
                >
                    <template slot-scope="scope">
                        <!--<img :src="scope.row.resImageUrl" min-width="120" height="70">-->
                        <div class="img-box">
                            <el-image
                                    style="width: 100px; height: 100px"
                                    :src="scope.row.foodImageUrl"
                                    fit="fit"></el-image>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="菜品价格">
                </el-table-column>
                <el-table-column
                        prop="totalSales"
                        label="总销量">
                </el-table-column>
                <el-table-column
                        prop="addTime"
                        label="加入时间">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="商品上下架"
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
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pageNum"
                    :page-sizes="[3, 10]"
                    :page-size="queryInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
                title="添加菜品"
                :visible.sync="addDialogVisible"
                width="30%"
                @close="addDialogClosed"
        >
            <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="菜品名" prop="foodName">
                    <el-input v-model="addForm.foodName"></el-input>
                </el-form-item>
                <el-form-item label="菜品分类" prop="cateId">
                    <el-select v-model="addForm.cateId" placeholder="请选择分类">
                        <el-option :label="item.name" :value="item.id"
                                                 v-for="item in cateList"
                    ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜品类型" prop="foodType">
                    <el-select v-model="addForm.foodType" placeholder="请选择类型">
                        <el-option label="午餐" value="午餐">
                        </el-option>
                        <el-option label="晚餐" value="晚餐">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜品描述" prop="desc">
                    <el-input v-model="addForm.desc"></el-input>
                </el-form-item>
                <el-form-item label="菜品图片链接" prop="foodImageUrl">
                    <el-input v-model.number="addForm.foodImageUrl"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model.number="addForm.price"></el-input>
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
    <el-button type="primary" @click="addFood">确 定</el-button>
  </span>
        </el-dialog>
        <el-dialog title="收货地址" :visible.sync="editDialogVisible">
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRules"label-width="80px">
                <el-form-item label="菜品名称" prop="foodName">
                    <el-input v-model="editForm.foodName" ></el-input>
                </el-form-item>
                <el-form-item label="菜品分类" prop="">
                    <el-select v-model="editForm.cateId" placeholder="请选择分类">
                        <el-option :label="item.name" :value="item.id"
                                   v-for="item in cateList"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜品类型" prop="foodType">
                    <el-select v-model="editForm.foodType" placeholder="请选择类型">
                        <el-option label="午餐" value="午餐">
                        </el-option>
                        <el-option label="晚餐" value="晚餐">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜品描述" prop="desc">
                    <el-input v-model.number="editForm.desc"></el-input>
                </el-form-item>
                <el-form-item label="菜品图片url" prop="foodImageUrl">
                    <el-input v-model="editForm.foodImageUrl"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model.number="editForm.price"></el-input>
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
        name: "foodList",
        data(){
            return {
                queryInfo:{
                    pageNum:1,
                    pageSize:3,
                    query:""
                },
                total:0,
                foodList:[],
                cateList:[],
                addDialogVisible:false,
                editDialogVisible:false,
                addForm:{
                    foodName:'',
                    cateId:'',
                    foodType:'',
                    desc:'',
                    foodImageUrl:'',
                    price:'',
                    addTime:''
                },
                addRules:{
                    foodName:[
                        {required:true ,message:"请输入菜品名",trigger:"blur"}
                    ],
                    cateId:[
                        {required:true ,message:"请选择菜品分类",trigger:"change"}
                    ],
                    foodType:[
                        {required:true ,message:"请选择菜品类型",trigger:"change"}
                    ],
                    foodImageUrl:[
                        {required: true ,message: "请输入图片链接", trigger: "blur"}
                    ],
                    price:[
                        { type: 'number', message: '价格必须为数字值'},
                        {
                            required: true ,message: "请输入价格", trigger: "blur"
                        }
                    ],
                    addTime:[
                        {
                            // required:true,message:"请选择日期",trigger:"blur"
                            type: 'string', required: true, message: '请选择日期', trigger: 'change'
                        }
                    ]
                },
                editForm:{},
                editFormRules: {
                    foodName:[
                        {required:true ,message:"请输入菜品名",trigger:"blur"}
                    ],
                    cateId:[
                        {required:true ,message:"请选择菜品分类",trigger:"change"}
                    ],
                    foodType:[
                        {required:true ,message:"请选择菜品类型",trigger:"change"}
                    ],
                    foodImageUrl:[
                        {required: true ,message: "请输入图片链接", trigger: "blur"}
                    ],
                    price:[
                        { type: 'number', message: '价格必须为数字值'},
                        {
                            required: true ,message: "请输入价格", trigger: "blur"
                        }
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
            this.getFoodList();
        },
        methods:{
            async getFoodList(){
                let {data} = await  this.$http.post("/findFoodByPage",{
                        form:this.queryInfo,
                        resId:this.resId
                });
                if(data.code===1)
                {
                    // this.foodList=data.msg.list;
                    this.total=data.msg.food.total;
                    let cateList=data.msg.cate;
                    this.cateList=data.msg.cate;
                    let foodList= data.msg.food.list;
                    foodList.forEach(item1=>{
                        cateList.forEach(item2=>{
                            if(item1.cateId===item2.id){
                                item1.cateName=item2.name;
                            }
                        });
                    });
                    this.foodList=foodList;
                }
                else {
                    this.$message.error(data.msg);
                }
            },
            addFood(){
                this.$refs.addFormRef.validate(async (valid)=>{
                    if(valid==true)
                    {
                        if(this.addForm.foodType=="午餐")
                        {
                            this.addForm.foodType=0;
                        }
                        else
                            this.addForm.foodType=1;
                        this.addForm.resId=this.resId;
                        const {data}= await this.$http.post("/addFood",
                            this.addForm
                        );
                        if(data.code===1)
                        {
                            this.$notify({
                                title: '成功',
                                message: data.msg,
                                type: 'success'
                            });
                            this.addDialogVisible=false;
                            this.getFoodList();
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
                });


            },
            async findFoodById(id)
            {
                const {data}= await this.$http.get("/findFoodById",{
                    params:{"id":id}
                });
                if(data.code===1)
                {
                    if(data.msg.foodType==0)
                        data.msg.foodType="午餐"
                    else{
                        data.msg.foodType="晚餐"
                    }
                    this.editForm=data.msg;
                    this.editDialogVisible=!this.editDialogVisible;
                }
                else {
                    this.$message.error(data.msg);
                }
            },
            handleEdit()
            {
                this.$refs.editFormRef.validate(async valid => {
                    if (valid == true) {
                        if(this.editForm.foodType=="午餐")
                        {
                            this.editForm.foodType=0;
                        }
                        else
                            this.editForm.foodType=1;
                        const {data} = await this.$http.post("/editFood", this.editForm);
                        if (data.code === 1) {
                            this.$message.success("修改成功");
                            this.getFoodList();
                            this.editDialogVisible = !this.editDialogVisible;
                        } else {
                            this.$message.error(data.msg);
                        }
                    } else {
                        this.$message.error("请按格式输入表单");
                    }
                })
            },
            async removeFood(id)
            {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async  () => {
                    const {data}= await this.$http.get("/removeFood",{
                        params:{"id":id}
                    });
                    if(data.code==1)
                    {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getFoodList();
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
          async  switchChange(e,id,index)
            {
                console.log(e,'  ',id,'  ', index);
              const  {data} = await this.$http.get("/changeFoodStatus",
                  {
                      params:{id:id,
                              status:e

                      }
                  }
              );
              if(data.code==1)
              {
                  this.$notify({
                      title: '成功',
                      message: data.msg,
                      type: 'success'
                  });
              }
              else
              {
                  this.$notify({
                      title: '失败',
                      message: data.msg,
                      type: 'error'
                  });
                  if(e===1)
                  this.foodList[index].status=0;
                  else {
                      this.foodList[index].status=1;
                  }
              }
            },
            handleSizeChange(newSise){
                this.queryInfo.pageSize=newSise;
                this.getFoodList();
            },
            handleCurrentChange(newPageNum){
                this.queryInfo.pageNum=newPageNum;
                this.getFoodList();
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
