<template>
  <el-card>
    <!-- 1. 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 2.温馨提示 -->
    <el-row>
      <el-alert show-icon center class="el-alert" title="添加商品信息" type="success"></el-alert>
    </el-row>
    <!-- 3.步骤条 -->
    <el-steps :active="1*active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="基本信息"></el-step>
      <el-step title="商品步骤"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-form :model="addGoodsForm" class="el-form" :label-position="labelPosition">0
      <el-tabs
        @tab-click="tabChange()"
        v-model="active"
        :tab-position="tabPosition"
        style="margin-top:20px"
      >
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addGoodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addGoodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addGoodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addGoodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              expand-trigger="hover"
              :options="options"
              v-model="selectOptions"
              :props="defaultProp"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品步骤">
          <!-- 显示的是该三级分类的商品参数 -->
          <el-form-item :label="item.attr_name" v-for="(item, index) in arrDyparams" :key="index">
            <!-- 复选框数组 -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                border
                v-for="(item1, index) in item.attr_vals"
                :key="index"
                :label="item1"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item, index) in arrOnlyparams" :key="index">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <!-- baseUrl axios发的请求 -->
            <el-upload
              :action="uploadURL"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <!-- 表单元素 -->
            <el-button @click="addGoods()" type="primary">点我-添加商品</el-button>
            <!-- 富文本 -->
            <quill-editor v-model="addGoodsForm.goods_introduce" class="editor"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

   
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  data() {
    return {
      active: "1",
      tabPosition: "left",
      labelPosition: "top",
      // 增加商品信息
      addGoodsForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        // 商品分类
        goods_cat: [],
        // pics上传图片临时路径 [{pics: url}]
        pics: [],
        // 动态参数和静态参数 -> 数组
        attrs: []
      },

      // 级联元素
      options: [],
      selectOptions: [3557, 3558, 3559],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },

      // 动态参数的数据数组
      arrDyparams: [],

      // 静态参数的数据数组
      arrOnlyparams: [],

      // 图片上传地址
      uploadURL: "https://www.liulongbin.top:8888/api/private/v1/upload",

      // 图片头部
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoodCate();
  },
  components: {
    quillEditor
  },
  methods: {
    // 添加商品 -> 发送请求
    async addGoods() {
      // goods_cat -> 分类
      this.addGoodsForm.goods_cat = this.selectOptions.join(",");

      // pics[] {pic:?} 在上传和移除图片是 进行赋值 [].findIndex()

      // attrs[] [{attr_id: ?, attr_value: ?}]
      // 动态参数数组
      // 遍历 + 取值 + 就在一个新数组中
      let arr1 = this.arrDyparams.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });

      let arr2 = this.arrOnlyparams.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });

      this.addGoodsForm.arrts = [...arr1, ...arr2]

      // 在发送请求之前 处理this.form中的未处理数据
      const res = await this.$http.post(`goods`, this.addGoodsForm);
      console.log(res);
      // 完成创建返回商品列表页
      this.$router.push({name: 'goods'})
    },
    handleRemove(file) {
      // file.respones.data.tmp_path
      // console.log(file);
      console.log("移除");

      // 从this.form.pics 移除当前x掉的图片
      // 先获取当前图片的索引
      // findIndex((item)=> {})遍历 把符合条件的元素的索引进行返回

      // [{pic: 图片路径}],[{pic: 图片路径2}]
      let Index = this.addGoodsForm.pics.findIndex(item => {
        return item.pics === file.response.data.tmp_path;
      });
      this.addGoodsForm.pics.splice(Index, 1);
      console.log(this.addGoodsForm.pics);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleSuccess(file) {
      this.addGoodsForm.pics.push({
        pics: file.data.tem_path
      });
    },
    // 点击不同的tab时触发该方法
    async tabChange() {
      // 如果点击的是第二个tab同时 三级分类要有值
      if (this.active === "2") {
        if (this.selectOptions.length !== 3) {
          // 提示
          this.$message.warning("请先选择商品的三级分类");
          return;
        }
        // 获取数据  步骤数据
        // categories/:id/attributes
        // id -> 分类id
        const res = await this.$http.get(
          `categories/${this.selectOptions[2]}/attributes?sel=many`
        );
        console.log(res);
        // attr_name 和 attr_vals
        this.arrDyparams = res.data.data;
        // this.arrDyparams每个对象.attr_vals字符串->数组->v-for
        this.arrDyparams.forEach(item => {
          // 并不是所有的三级分类都有动态参数 -> [] ->v-for 报错
          // if (item.attr_vals.length !== 0) {
          //   item.attr_vals = item.attr_vals.trim().split(',')
          // }
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
      } else if (this.active === "3") {
        if (this.selectOptions.length !== 3) {
          // 提示
          this.$message.warning("请先选择商品的三级分类");
          return;
        }
        // 获取静态参数的数据
        const res = await this.$http.get(
          `categories/${this.selectOptions[2]}/attributes?sel=only`
        );
        console.log(res);
        this.arrOnlyparams = res.data.data;
      }
    },
    //联级选择器 @change触发
    handleChange() {},
    // 获取三级分类的信息
    async getGoodCate() {
      const res = await this.$http.get("categories?type=3");
      // console.log(res);
      this.options = res.data.data;
    }
  }
};
</script>

<style  scoped>
.el-alert {
  margin-top: 20px;
}

.el-form {
  height: 400px;
  overflow: auto;
}

.editor {
  margin-top: 20px;
}

.ql-editor {
  min-height: 300px;
}
</style>