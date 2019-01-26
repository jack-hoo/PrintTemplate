<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-input placeholder="结构体"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="search">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="structs" highlight-current-row style="width: 100%;">
            <el-table-column prop="id" label="ID">
            </el-table-column>
            <el-table-column prop="structType" label="结构类型">
            </el-table-column>
            <el-table-column prop="velocityCode" label="模板变量">
            </el-table-column>
            <el-table-column prop="tempVar" label="临时变量">
            </el-table-column>
            <el-table-column prop="judge" label="判断式">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="新增结构" v-model="addStructVisible" :close-on-click-modal="false">
            <el-form :model="structToAdd" label-width="20%" :rules="addStructRules" ref="addForm"
                     @keyup.enter.native="addSubmit">
                <el-form-item label="结构类型">
                    <el-select v-model="structToAdd.structType" placeholder="请选择结构类型">
                        <el-option label="普通行" value="ROW"></el-option>
                        <el-option label="logo" value="LOGO"></el-option>
                        <el-option label="分割线" value="SPLIT"></el-option>
                        <el-option label="空行" value="EMPTY_LINE"></el-option>
                        <el-option label="循环结构" value="LOOP_STRUCT"></el-option>
                        <el-option label="if判断结构" value="IF_STRUCT"></el-option>
                        <el-option label="局部标题" value="STRUCT_TITLE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板变量">
                    <el-input v-model="structToAdd.velocityCode" auto-complete="off" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="局部变量">
                    <el-input v-model="structToAdd.tempVar" auto-complete="off" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="判断表达式">
                    <el-input v-model="structToAdd.judge" type="textarea" auto-complete="off"
                              style="width: 80%"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addStructVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改结构" v-model="editStructVisible" :close-on-click-modal="false">
            <el-form :model="structToEdit" label-width="20%" :rules="editStructRules" ref="editForm"
                     @keyup.enter.native="editSubmit">
                <el-form-item label="结构类型">
                    <el-select v-model="structToEdit.structType" placeholder="请选择结构类型">
                        <el-option label="普通行" value="ROW"></el-option>
                        <el-option label="logo" value="LOGO"></el-option>
                        <el-option label="分割线" value="SPLIT"></el-option>
                        <el-option label="空行" value="EMPTY_LINE"></el-option>
                        <el-option label="循环结构" value="LOOP_STRUCT"></el-option>
                        <el-option label="if判断结构" value="IF_STRUCT"></el-option>
                        <el-option label="局部标题" value="STRUCT_TITLE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板变量">
                    <el-input v-model="structToEdit.velocityCode" auto-complete="off" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="局部变量">
                    <el-input v-model="structToEdit.tempVar" auto-complete="off" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="判断表达式">
                    <el-input v-model="structToEdit.judge" type="textarea" auto-complete="off"
                              style="width: 80%"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editStructVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {addStruct, deleteStruct, getAllStructs, updateStruct} from "../api/api";

    export default {
        name: "TemplateStruct",
        data() {
            return {
                editStructRules: {},
                structToEdit: {},
                editStructVisible: false,
                structs: [],
                addStructVisible: false,
                structToAdd: {
                    structType: null,
                    velocityCode: null,
                    tempVar: null,
                    judge: null
                },
                addStructRules: {}

            }
        },
        methods: {
            handleDel(index, row) {
                deleteStruct(row.id).then(res => {
                    this.showMessage(res, () => {
                        this.getStructs()
                    })
                })
            },
            handleEdit(index, row) {
                this.structToEdit = row
                this.editStructVisible = true
            },
            search() {

            },
            handleAdd() {
                this.addStructVisible = true
            },
            getStructs() {
                getAllStructs().then(res => {
                    console.log(res)
                    this.structs = res.data
                })
            },
            addSubmit() {
                addStruct(this.structToAdd).then(res => {
                    this.showMessage(res, () => {
                        // console.log(res)
                        this.getStructs();
                    })

                })
            },
            editSubmit() {
                updateStruct(this.structToEdit).then(res => {
                    this.showMessage(res, () => {
                        // console.log(res)
                        this.editStructVisible = false;
                        this.getStructs();
                    })

                })
            },
            showMessage(response, successCallBack, errorCallback) {
                if (response.status == 0) {
                    successCallBack();
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                    errorCallback();
                }
            },
        },
        mounted() {
            this.getStructs();
        }

    }
</script>

<style scoped>

</style>