<template>
  <div class="uploader-box">
    <label>
      <input type="file" @change="uploadFile" />
      <div class="uploader-icon" v-show="!url">
        <i class="el-icon-upload"></i>
      </div>
      <div class="uploader-img" v-show="url || imgUrl">
        <img class="auto-img" :src="url || imgUrl" alt="" />
      </div>
    </label>
  </div>
</template>

<script>
import * as imageConversion from 'image-conversion' 
export default {
  name: "Uploader",
  props: {
    imgUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      url: "",
    };
  },
  methods: {
    uploadFile(e) {
      let self = this;
      let file = e.target.files[0];
      let fileReader = new FileReader();
      fileReader.onload = function () {
        let base64 = this.result;
        self.url = base64;
        self.$emit("before-upload", { content: base64 });
      };

      if (file) {
        fileReader.readAsDataURL(file);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.uploader-box {
  width: 140px;
  height: 140px;
  border: 1px dashed #dcdfe6;
  label {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    [type="file"] {
      display: none;
    }
    position: relative;
  }
  .uploader-icon {
    text-align: center;
    line-height: 140px;
    font-size: 28px;
    color: #dcdfe6;
    position: relative;
    z-index: 1;
  }

  .uploader-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    /deep/.auto-img {
      width: 140px;
      height: 140px;
    }
  }
}
</style>