<template>
  <div class="new-product">
    <div class="form-box">
      <el-form ref="productForm" :inline="true" :model="productData" label-width="80px" :rules="rules">
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="productData.name" placeholder="商品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品类型" prop="type">
              <el-select v-model="productData.type" placeholder="商品类型">
                <el-option :label="item.name" :value="item.typeId" v-for="(item, index) in typeData"
                  :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="productData.price" placeholder="商品价格" type></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="商品图片" prop="smallImg">
              <div>
                <!-- <Uploader @before-upload="UploaderImage($event, 'smallImg')" :img-url="productData.smallImg" /> -->
                <ImageUploader @input="uploadImg($event, 'smallImg')" :value.sync="productData.smallImg"></ImageUploader>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品状态" prop="status">
              <el-radio-group v-model="productData.status">
                <el-radio :label="0">上架</el-radio>
                <el-radio :label="1">下架</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="商品描述" prop="desc">
              <el-input type="textarea" v-model="productData.desc" maxlength="100" style="width: 100%;" resize="none"
                placeholder="商品描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <div class="btn" style="width:120px;margin:0 auto;">
            <el-form-item>
              <el-button type="primary" @click="postProduct('productForm')">
                发布商品
              </el-button>
            </el-form-item>
          </div>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import Uploader from "../components/Uploader.vue";
import { getType, getProductById, postProduct } from "@/apis/product";

export default {
  name: "NewProduct",

  components: {
    Uploader,
  },
  props: {
    productIds: {
      type: String,
    },
  },

  data() {
    return {
      productData: {
        name: "",
        price: "",
        type: "",
        smallImg: "",
        largeImg: "",
        status: "",
        desc: "",
      },

      rules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,40}$/,
            message: "商品名称支持中英文组合(1-40位)",
            trigger: "blur",
          },
        ],
        type: [
          { required: true, message: "请选择商品类型", trigger: "change" },
        ],
        price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          {
            pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
            message: "请输入正确的数值(至多2位小数)",
            trigger: "blur",
          },
        ],
        smallImg: [{ required: true, message: "请上传商品图片" }],
        // largeImg: [{ required: true, message: "请上传详情图片" }],
        status: [
          { required: true, message: "请选择商品状态", trigger: "change" },
        ],
      },

      smallImgType: "",
      largeImgType: "",
      typeData: [],
    };
  },

  created() {
    if (this.productIds) {
      this.getProductById();
    }
    this.getProductType();
  },
  computed: {
    productId: {
      get() {
        return this.productIds;
      },
      set(val) {
        this.$emit("update:productIds", val);
      },
    },
  },
  watch: {
    productId: function (fee) {
      if (fee) {
        this.getProductById();
      } else {
        this.productData = [];
        this.copyProductData = [];
      }
    },
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    uploadImg(content, key) {
      this.productData[key] = content;
      this.$refs["productForm"].clearValidate(key);
    },
    UploaderImage(content, key) {

      this[key + "Type"] = content.content.split(";")[0].split(/\//)[1];
      // console.log(this[key + "Type"]);
      this.productData[key] = content.content.replace(
        /^data:image\/[A-Za-z]+;base64,/,
        ""
      );
      this.$refs["productForm"].clearValidate(key);

      console.log(this.productData);
    },

    //获取商品类型
    getProductType() {
      getType().then(res => {
        this.typeData = res.data.result;
      })
    },

    //根据商品id查询商品数据
    getProductById() {
      let params = {
        productId: this.productIds,
      }
      getProductById(params).then(res => {
        this.productData = { ...res.data.result[0] };
        this.copyProductData = { ...res.data.result[0] };
        console.log('this.productData ', this.productData)
      })
    },

    //发布商品
    postProduct(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.productId) {
            //编辑商品
            this.editProduct();
          } else {
            //创建商品
            this.createProduct();
          }
        }
      });
    },
    //编辑商品
    editProduct() {
      //判断用户是否修改商品数据

      //保存已修改的数据
      let modifyData = {};

      for (let key in this.productData) {
        if (this.productData[key] !== this.copyProductData[key]) {
          modifyData[key] = this.productData[key];
        }
      }

      //判断空对象
      //Object.keys(modifyData).length === 0
      //JSON.stringify(modifyData) === '{}'
      if (Object.keys(modifyData).length === 0) {
        return;
      }

      let data = {
        ...modifyData,
        productId: this.productId,
      };

      if (this.smallImgType) {
        data.smallImgType = this.smallImgType;
      }

      if (data.largeImgType) {
        data.largeImgType = this.largeImgType;
      }

      this.axios({
        method: "post",
        url: "/editProduct",
        data,
      })
        .then((result) => {
          if (result.data.code === 200) {
            this.$router.go(-1);
          }
        })
        .catch((err) => { });
    },
    //创建商品
    createProduct() {
      postProduct({ ...this.productData }).then(res => {
        this.$emit("success");
      })
    },
  },
};
</script>

<style lang="less" scoped>
.new-product {
  // height: 900px;
  text-align: left;
  width: 80%;
  margin: 0 auto;

  .form-box {

    // width: 400px;
    /deep/ .el-textarea__inner {
      height: 100px;
    }
  }
}
</style>