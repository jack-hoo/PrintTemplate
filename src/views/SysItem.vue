<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-input placeholder="元素名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="items" row-key="id" highlight-current-row style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="id" label="ID" width="150">
            </el-table-column>
            <el-table-column prop="itemCode" label="元素编码" width="180">
            </el-table-column>
            <el-table-column prop="itemName" label="元素名称" width="120">
            </el-table-column>
            <el-table-column prop="itemType" label="元素类型" width="120">
            </el-table-column>
            <el-table-column prop="typeName" label="元素分组" width="100">
            </el-table-column>
            <el-table-column prop="tableType" label="显示类型" width="100">
            </el-table-column>
            <el-table-column prop="value" label="元素显示值" width="200"></el-table-column>
            <el-table-column prop="dataType" label="数据类型"></el-table-column>
            <el-table-column prop="sort" label="排序" sortable></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="false">批量删除</el-button>
            <!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                           :total="total" style="float:right;">
            </el-pagination>-->
        </el-col>
        <!--编辑界面-->
        <el-dialog title="编辑元素" v-model="editItemVisible" :close-on-click-modal="false">
            <el-form :model="editItem" label-width="20%" :rules="editItemsRules" ref="addForm" @keyup.enter.native="editSubmit">
                <el-form-item label="元素名称" prop="itemName">
                    <el-input v-model="editItem.itemName" auto-complete="off"  style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="元素Code" prop="itemCode">
                    <el-input v-model="editItem.itemCode" auto-complete="off" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="元素显示值" prop="value">
                    <el-input v-model="editItem.value" auto-complete="off" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="显示类型">
                    <el-select v-model="editItem.tableType" placeholder="请选择元素显示类型">
                        <el-option label="普通的单个元素" value="ITEM"></el-option>
                        <el-option label="可选项" value="OPTION"></el-option>
                        <el-option label="表头元素" value="TABLE_HEAD"></el-option>
                        <el-option label="表体元素" value="TABLE_BODY"></el-option>
                        <el-option label="带字的不可编辑的分割线" value="TABLE_LINE"></el-option>
                        <el-option label="带字的不可编辑的分割线" value="OTHER"></el-option>
                    </el-select>
                    <el-select v-if="chooseParent" filterable v-model="editItem.parentId" placeholder="请选择父元素"
                               style="width: 49%">
                        <el-option v-for="item in items" :label="item.itemName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="元素类型">
                    <el-select v-model="editItem.itemType" placeholder="请选择元素类别">
                        <el-option label="基础元素" value="IT_BASIC"></el-option>
                        <el-option label="订单信息" value="IT_ORDER_INFO"></el-option>
                        <el-option label="商品信息" value="IT_INSTANCE_INFO"></el-option>
                        <el-option label="结算信息" value="CLEAN_INFO"></el-option>
                        <el-option label="其它元素" value="IT_OTHER"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="元素分组">
                    <el-select v-model="editItem.typeName" placeholder="请选择分组名称" style="">
                        <el-option v-for="typename in typeNames" :key="typename" :label="typename"
                                   :value="typename"></el-option>
                    </el-select>
                    <el-input v-model="editItem.typeName" auto-complete="off" placeholder="请输入分组名称"
                              style="width: 49%"></el-input>
                </el-form-item>

                <el-form-item label="数据类型">
                    <el-select v-model="editItem.dataType" placeholder="请选择元素的数据类型">
                        <el-option label="整数" value="INT"></el-option>
                        <el-option label="小数" value="DOUBLE"></el-option>
                        <el-option label="字符串" value="STRING"></el-option>
                        <el-option label="时间" value="DATE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="editItem.sort" auto-complete="off" style="width: 80%"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editItemVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" >提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增元素" v-model="addItemVisible" :close-on-click-modal="false">
            <el-form :model="addItem" label-width="20%" :rules="addItemsRules" ref="addForm" @keyup.enter.native="addSubmit">
                <el-form-item label="元素名称" prop="itemName">
                    <el-input v-model="addItem.itemName" auto-complete="off" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="元素Code" prop="itemCode">
                    <el-input v-model="addItem.itemCode" auto-complete="off" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="元素显示值" prop="value">
                    <el-input v-model="addItem.value" auto-complete="off" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="显示类型">
                    <el-select v-model="addItem.tableType" placeholder="请选择元素显示类型">
                        <el-option label="普通的单个元素" value="ITEM"></el-option>
                        <el-option label="可选项" value="OPTION"></el-option>
                        <el-option label="表头元素" value="TABLE_HEAD"></el-option>
                        <el-option label="表体元素" value="TABLE_BODY"></el-option>
                        <el-option label="带字的不可编辑的分割线" value="TABLE_LINE"></el-option>
                        <el-option label="其它元素，分隔符，空行等" value="OTHER"></el-option>
                    </el-select>
                    <el-select v-if="chooseParent" filterable v-model="addItem.parentId" placeholder="请选择父元素"
                               style="width: 49%">
                        <el-option v-for="item in items" :label="item.itemName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="元素类型">
                    <el-select v-model="addItem.itemType" placeholder="请选择元素类别">
                        <el-option label="基础元素" value="IT_BASIC"></el-option>
                        <el-option label="订单信息" value="IT_ORDER_INFO"></el-option>
                        <el-option label="商品信息" value="IT_INSTANCE_INFO"></el-option>
                        <el-option label="结算信息" value="CLEAN_INFO"></el-option>
                        <el-option label="其它元素" value="IT_OTHER"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="元素分组">
                    <el-select v-model="addItem.typeName" placeholder="请选择分组名称" style="">
                        <el-option v-for="typename in typeNames" :key="typename" :label="typename"
                                   :value="typename"></el-option>
                    </el-select>
                    <el-input v-model="addItem.typeName" auto-complete="off" placeholder="请输入分组名称"
                              style="width: 49%"></el-input>
                </el-form-item>

                <el-form-item label="数据类型">
                    <el-select v-model="addItem.dataType" placeholder="请选择元素的数据类型">
                        <el-option label="整数" value="INT"></el-option>
                        <el-option label="小数" value="DOUBLE"></el-option>
                        <el-option label="字符串" value="STRING"></el-option>
                        <el-option label="时间" value="DATE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="addItem.sort" auto-complete="off" style="width: 80%"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addItemVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" >提交</el-button>
            </div>
        </el-dialog>
    </section>


</template>

<script>
    import {addSysItem, deleteSysItem, getSysItems, getTypeNames, updateSysItem} from "../api/api";
    import Sortable from 'sortablejs'

    export default {
        name: "SysItem",
        computed: {
            chooseParent: function () {
                let tableType = this.addItem.tableType;
                return tableType == 'OPTION'
            }
        },
        data() {
            return {
                items: [],
                addItemVisible: false,
                typeNames: [],
                addItem: {
                    itemCode: null,
                    itemName: null,
                    itemType: null,
                    typeName: null,
                    tableType: null,
                    dataType: null,
                    value: null,
                    sort: null,
                    parentId: null
                },
                addItemsRules: {},
                editItemVisible: false,
                editItem: {},
                editItemsRules: {}
            }
        },
        methods: {
            getItems() {
                getSysItems().then(res => {
                    console.log(res)
                    this.items = res.data
                })
            },
            getUsers() {

            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editItemVisible = true;
                this.editItem = Object.assign({}, row);
            },
            handleDel(index, row) {
                deleteSysItem(row.id).then(res => {
                    this.showMessage(res,()=>{
                        this.getItems();
                    })
                })
            },
            handleAdd() {
                this.addItemVisible = true
            },
            batchRemove() {

            },
            editSubmit() {
                updateSysItem(this.editItem).then(res => {
                    this.showMessage(res, () => {
                        this.getItems();
                        this.editItemVisible = false
                    })
                })
            },
            addSubmit() {
                addSysItem(this.addItem).then(res => {
                    this.showMessage(res, () => {
                        this.getItems();
                        this.getTypeNames();
                        this.addItem.sort= parseInt(this.addItem.sort) + 1;
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
            //行拖拽
            /*rowDrop() {
                const tbody = document.querySelector('.el-table__body-wrapper tbody')
                const _this = this
                Sortable.create(tbody, {
                    onEnd({ newIndex, oldIndex }) {
                        const currRow = _this.tableData.splice(oldIndex, 1)[0]
                        _this.tableData.splice(newIndex, 0, currRow)
                    }
                })
            }*/
            getTypeNames() {
                getTypeNames().then(res => {
                    this.typeNames = res.data;
                })
            }
        },
        mounted() {
            // this.rowDrop();
            this.getItems();
            this.getTypeNames();
        }
    }
</script>

<style>
</style>