<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-input placeholder="模板名字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="search">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="templates" highlight-current-row style="width: 100%;">
            <el-table-column prop="code" label="模板code"></el-table-column>
            <el-table-column prop="name" label="模板名称"></el-table-column>
            <el-table-column prop="sortCode" label="模板排序"></el-table-column>
            <el-table-column prop="tmplType" label="模板类型"></el-table-column>
            <el-table-column prop="typeName" label="模板类型名称"></el-table-column>
            <el-table-column prop="typeSort" label="类型排序"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">更新</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    <el-button type="warning" size="small" @click="selectItems(scope.$index, scope.row)">编辑元素
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="新增模板" v-model="addTempVisible" :close-on-click-modal="false">
            <el-form :model="tempToAdd" label-width="20%" ref="tempToAddForm" @keyup.enter.native="addSubmit">
                <el-form-item label="模板code">
                    <el-input v-model="tempToAdd.code"></el-input>
                </el-form-item>
                <el-form-item label="模板名称">
                    <el-input v-model="tempToAdd.name"></el-input>
                </el-form-item>
                <el-form-item label="模板排序">
                    <el-input-number v-model="tempToAdd.sortCode"></el-input-number>
                </el-form-item>
                <el-form-item label="模板类型">
                    <el-input v-model="tempToAdd.tmplType"></el-input>
                </el-form-item>
                <el-form-item label="类型名称">
                    <el-input v-model="tempToAdd.typeName"></el-input>
                </el-form-item>
                <el-form-item label="类型排序">
                    <el-input v-model="tempToAdd.typeSort" type="number"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addTempVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑模板" v-model="editTempVisible" :close-on-click-modal="false">
            <el-form :model="tempToEdit" label-width="20%" ref="tempToAddForm" @keyup.enter.native="addSubmit">
                <el-form-item label="模板code">
                    <el-input v-model="tempToEdit.code"></el-input>
                </el-form-item>
                <el-form-item label="模板名称">
                    <el-input v-model="tempToEdit.name"></el-input>
                </el-form-item>
                <el-form-item label="模板排序">
                    <el-input-number v-model="tempToEdit.sortCode"></el-input-number>
                </el-form-item>
                <el-form-item label="模板类型">
                    <el-input v-model="tempToEdit.tmplType"></el-input>
                </el-form-item>
                <el-form-item label="类型名称">
                    <el-input v-model="tempToEdit.typeName"></el-input>
                </el-form-item>
                <el-form-item label="类型排序">
                    <el-input-number v-model="tempToEdit.typeSort" type="number"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editTempVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="元素选择" v-model="rowToAddVisible" :close-on-click-modal="false">
            <el-form :model="rowToAdd" label-width="20%" ref="rowToAddForm" @keyup.enter.native="addRowSubmit">
                <el-form-item label="模板宽度">
                    <el-input-number v-model="rowToAdd.tmplWidth"></el-input-number>
                </el-form-item>
                <el-form-item label="结构类型">
                    <el-select v-model="rowToAdd.rowType" placeholder="选择要添加的行类型">
                        <el-option label="普通行" value="ROW"></el-option>
                        <el-option label="logo" value="LOGO"></el-option>
                        <el-option label="分割线" value="SPLIT"></el-option>
                        <el-option label="空行" value="EMPTY_LINE"></el-option>
                        <el-option label="循环结构" value="LOOP_STRUCT"></el-option>
                        <el-option label="if判断结构" value="IF_STRUCT"></el-option>
                        <el-option label="局部标题" value="STRUCT_TITLE"></el-option>
                    </el-select>
                    <el-select filterable
                               v-if="rowToAdd.rowType == 'LOOP_STRUCT' || rowToAdd.rowType == 'IF_STRUCT'"
                               placeHolder="选择行结构内容"
                               v-model="rowToAdd.structId">
                        <el-option v-for="struct in allStructs" :label="struct.judge || struct.velocityCode" :value="struct.id">

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="rowToAdd.rowType != 'LOOP_STRUCT' && rowToAdd.rowType != 'IF_STRUCT'"  label="添加行内元素">
                    <el-button type="success" @click.native="addItemClick">添加元素</el-button>
                    <span v-for="item in rowToAdd.items">
                        {{item.item.itemName}},
                    </span>
                    <el-button type="danger"  @click="clearItems" style="float: right">清空元素</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="rowToAddVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addRowSubmit">提交</el-button>
            </div>
        </el-dialog>


        <el-dialog title="编辑元素属性" v-model="editItemVisible" :close-on-click-modal="false">
            <el-form :model="itemToAdd" label-width="20%" ref="itemEditForm" @keyup.enter.native="addItemSubmit">
                <el-form-item label="选择元素">
                    <el-select filterable v-model="itemToAdd.item" placeholder="选择行内元素" @change="selectChange">
                        <el-option  v-for="item in allItems"  :label="item.itemName" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="元素对齐方式">
                    <el-select v-model="itemToAdd.align" placeholder="选择元素对齐方式">
                        <el-option label="居中" value="CENTER"></el-option>
                        <el-option label="居左" value="LEFT"></el-option>
                        <el-option label="居右" value="RIGHT"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="元素高度">
                    <el-select v-model="itemToAdd.height" placeholder="选择元素高度">
                        <el-option label="2倍" value="2"></el-option>
                        <el-option label="3倍" value="3"></el-option>
                        <el-option label="4倍" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="元素宽度">
                    <el-select v-model="itemToAdd.width" placeholder="选择元素宽度">
                        <el-option label="2倍" value="2"></el-option>
                        <el-option label="3倍" value="3"></el-option>
                        <el-option label="4倍" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="元素占位宽度">
                    <el-input-number v-model="itemToAdd.itemWidth">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="模板变量">
                    <el-input v-model="itemToAdd.velocityCode" placeholder="请输入模板变量"></el-input>
                </el-form-item>
                <el-form-item label="自有条件">
                    <el-select v-model="itemToAdd.itemStructId" placeholder="选择元素自身条件判断">
                        <el-option v-for="struct in allStructs" :label="struct.judge || struct.velocityCode" :value="struct.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editItemVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editItemSubmit">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {addRowToTemp, addTempl, delTempl, getAllStructs, getAllTempls, getSysItems, updateTempl} from "../api/api";

    export default {
        name: "Template",
        data() {
            return {
                editItemVisible: false,
                templates: [],
                addTempVisible: false,
                editTempVisible: false,
                tempToAdd: {},
                tempToEdit: {},
                rowToAddVisible: false,
                rowToAdd: {
                    tmplWidth: 32,
                    rowType: null,
                    structId: null,
                    tmplCode: null,
                    items: [
                        // {
                        //     sysItemId: null,
                        //     itemWidth: null,
                        //     align: null,
                        //     dHigh: null,
                        //     dWidth: null,
                        //     velocityCode: null,
                        //     itemStructId:null
                        //     itemCode:null
                        // }
                    ]
                },
                itemToAdd: {},
                itemsSelected: [],
                allItems:[],
                allStructs:[]
            }
        },
        methods: {
            clearItems() {
                this.rowToAdd.items = []
            },
            addItemClick() {
                this.editItemVisible = true;
                this.itemToAdd = {};
            },
            selectChange(item) {
                console.log(item)
                this.itemToAdd.sysItemId = item.id
                this.itemToAdd.itemCode = item.itemCode
            },
            editItemSubmit() {
                this.rowToAdd.items.push(this.itemToAdd);
                this.editItemVisible = false;
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });
            },
            addItemSubmit() {

            },
            addRowSubmit() {
                addRowToTemp(this.rowToAdd).then(res => {
                    this.showMessage(res,()=>{
                        this.rowToAdd = {
                            tmplWidth: 32,
                            rowType: null,
                            structId: null,
                            tmplCode: null,
                            items: []
                        }
                    })
                })
            },
            search() {

            },
            handleAdd() {
                this.addTempVisible = true;
            },
            addSubmit() {
                console.log(this.tempToAdd)
                addTempl(this.tempToAdd).then(res => {
                    this.showMessage(res, () => {
                        this.addTempVisible = false
                        this.getAllTemplate();
                    })

                })
            },
            editSubmit() {
                updateTempl(this.tempToEdit).then(res => {
                    this.showMessage(res, () => {
                        this.editTempVisible = false
                        this.getAllTemplate();
                    })
                })
            },
            handleEdit(index, row) {
                this.editTempVisible = true;
                this.tempToEdit = row
            },
            handleDel(index, row) {
                delTempl(row.id).then(res => {
                    this.showMessage(res, () => {
                        this.getAllTemplate();
                    })
                })
            },
            selectItems(index, row) {
                /*this.$router.push({
                    path: '/select_items',
                    params:{
                        templateId:row.id
                    }
                })*/
                this.rowToAddVisible = true
                this.getItems();
                this.getStructs();
                this.rowToAdd.tmplCode = row.code
            },
            //获取数据接口
            getAllTemplate() {
                getAllTempls().then(res => {
                    console.log(res)
                    this.templates = res.data
                })
            },
            getItems() {
                getSysItems().then(res => {
                    console.log(res)
                    this.allItems = res.data
                })
            },
            getStructs() {
                getAllStructs().then(res => {
                    console.log(res)
                    this.allStructs = res.data
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
            this.getAllTemplate();
        }
    }
</script>

<style scoped>

</style>