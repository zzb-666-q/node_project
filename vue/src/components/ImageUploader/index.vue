<template>
  <div class="component-upload-image">
    <el-upload multiple :action="uploadImgUrl" list-type="picture-card" :on-success="handleUploadSuccess"
      :headers="headers" :before-upload="handleBeforeUpload" :limit="limit" :on-error="handleUploadError"
      :on-exceed="handleExceed" ref="imageUpload" :on-remove="handleDelete" :show-file-list="true" :file-list="fileList"
      :on-preview="handlePictureCardPreview" :class="{ hide: this.fileList.length >= this.limit }">
      <!-- :http-request="uploadPicture" -->
      <!-- :data="fileData" -->
      <i class="el-icon-plus"></i>
    </el-upload>

    <!-- 上传提示 -->
    <div class="el-upload__tip" slot="tip" v-if="showTip">
      请上传
      <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
      <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
      的文件
    </div>

    <el-dialog :visible.sync="dialogVisible" title="预览" width="800" append-to-body>
      <img :src="dialogImageUrl" style="display: block; max-width: 100%; margin: 0 auto" />
    </el-dialog>
  </div>
</template>

<script>
import * as imageConversion from 'image-conversion'
import { getToken } from "@/utils/auth";
import { uploadImages } from "@/apis/product";


export default {
  props: {
    value: [String, Object, Array],
    // 图片数量限制
    limit: {
      type: Number,
      default: 1,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["png", "jpg", "jpeg"],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      number: 0,
      uploadList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      hideUpload: false,
      baseUrl: process.env.VUE_APP_BASE_API + '/',
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/uploadImages', // 上传的图片服务器地址
      headers: {
        // Authorization: "Bearer " ,
      },
      fileList: [],
      fileData: {
        path: ''
      }
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          // 首先将值转为数组
          const list = Array.isArray(val) ? val : this.value.split(',');
          // 然后将数组转为对象数组
          this.fileList = list.map(item => {
            if (typeof item === "string") {
              if (item.indexOf(this.baseUrl) === -1) {
                item = { name: this.baseUrl + item, url: this.baseUrl + item };
              } else {
                item = { name: item, url: item };
              }
            }
            return item;
          });
        } else {
          this.fileList = [];
          return [];
        }
      },
      deep: true,
      immediate: true
    },


  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
  },
  methods: {
    // 上传前loading加载
    handleBeforeUpload(file) {

      return new Promise((resolve, reject) => {
        //   fileReader.onload = function () {
        //   let base64 = this.result;
        //   self.url = base64;
        //   self.fileData.path = base64;
        //   console.log('self.fileData', self.fileData)
        //   self.$emit("before-upload", { content: base64 });
        // };
        // if (file) {
        //   fileReader.readAsDataURL(file);
        // }
        let isImg = false;

        if (this.fileType.length) {
          let fileExtension = "";
          if (file.name.lastIndexOf(".") > -1) {
            fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
          }
          isImg = this.fileType.some(type => {
            if (file.type.indexOf(type) > -1) return true;
            if (fileExtension && fileExtension.indexOf(type) > -1) return true;
            return false;
          });
        } else {
          isImg = file.type.indexOf("image") > -1;
        }

        if (!isImg) {
          this.$message.error(`文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`);
          return false;
        }
        if (this.fileSize) {
          const isLt = file.size / 1024 / 1024 < this.fileSize;
          if (!isLt) {
            this.$message.error(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
            return false;
          }
        }
        imageConversion.compressAccurately(file, 1500).then(res => {
          this.$message.success('图片压缩成功！');
          resolve(res)
        }).catch(() => {
          this.$message.error('图片压缩失败，请联系管理员进行查看！');
          reject();
        })

        // this.$modal.loading("正在上传图片，请稍候...");
        this.number++;
        // return
      })



    },
    handleBeforeUpload2(file) {
      // let self = this;
      // let fileReader = new FileReader();
      // fileReader.onload = function () {
      //   let base64 = this.result;
      //   self.url = base64;
      //   console.log('base64', base64)
      //   self.$emit("before-upload", { content: base64 });
      // };
      // if (file) {
      //   fileReader.readAsDataURL(file);
      // }

      let isImg = false;

      if (this.fileType.length) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        isImg = this.fileType.some(type => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
      } else {
        isImg = file.type.indexOf("image") > -1;
      }

      if (!isImg) {
        this.$message.error(`文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`);
        return false;
      }
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }


      // this.$modal.loading("正在上传图片，请稍候...");
      this.number++;
      // return



    },


    // 文件个数超出
    handleExceed() {
      // this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`);
      this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`);

    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.uploadList.push({ name: res.result.fileName, url: res.result.fileName });
        this.uploadedSuccessfully();
      } else {
        this.number--;
        // this.$modal.closeLoading();
        this.$message.error(res.result.msg);
        this.$refs.imageUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除图片
    handleDelete(file) {
      const findex = this.fileList.map(f => f.name).indexOf(file.name);
      if (findex > -1) {
        this.fileList.splice(findex, 1);
        this.$emit("input", this.listToString(this.fileList));
      }
    },
    // 上传失败
    handleUploadError() {
      this.$message.error("上传图片失败，请重试");
      // this.$modal.closeLoading();
    },
    // 上传结束处理
    async uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        // this.fileList = this.fileList.concat(this.uploadList);
        // this.fileList = await this.todd(this.fileList);
        let fileList = await this.todd(this.uploadList);
        this.fileList = this.fileList.concat(fileList);
        this.uploadList = [];
        this.number = 0;
        this.$emit("input", this.listToString(this.fileList));

        // this.$modal.closeLoading();
      }
    },
    todd(options) {
      return new Promise((resolve, reject) => {

        options.map(item => {
          if (typeof item.name === "string") {
            if (item.name.indexOf(this.baseUrl) === -1) {
              item.name = this.baseUrl + item.name;
              item.url = this.baseUrl + item.url;
            } else {
              // item.name = item.name ;
              // item.url = item.name ;
            }
          }
          resolve(item)
        });
      });


    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      console.log('list', list)
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        if (list[i].url) {
          strs += list[i].url.replace(this.baseUrl, "") + separator;
        }
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : '';
    },


  }
};
</script>
<style scoped lang="less">
// .el-upload--picture-card 控制加号部分
::v-deep.hide .el-upload--picture-card {
  display: none;
}

// 去掉动画效果
::v-deep .el-list-enter-active,
::v-deep .el-list-leave-active {
  transition: all 0s;
}

::v-deep .el-list-enter,
.el-list-leave-active {
  opacity: 0;
  transform: translateY(0);
}
</style>

