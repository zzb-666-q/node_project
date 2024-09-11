<template>
  <div class="queryFile">
    <el-button @click="init2">点击</el-button>
    <el-button @click="getImageName"> //获取所有图片,数据库里没有的就删掉</el-button>


  </div>
</template>

<script>
import { getImageName } from "@/apis/utilsClass";
export default {
  // 组件名称
  name: 'queryFile',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      init() {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        // 获取文件相关信息
        var f1 = fso.GetFile("F:\\test\\test.txt");
        alert('文件上次修改日期:' + f1.DateLastModified);
        var drv;
        var s = '';
        // 获取磁盘相关信息
        drv = fso.GetDrive(fso.GetDriveName("C:\\"));
        s += 'Drive C:' + '-' + drv.VolumeName + '\n';
        s += 'Total Space:' + drv.TotalSize / 1024 + 'Kb' + '\n';
        s += 'Free Space:' + drv.FreeSpace / 1024 + 'Kb' + '\n';
        alert('C盘信息' + s);
        // 操作文件夹
        fldr = fso.GetFolder("F:\\test");
        alert('父文件夹名称：' + fldr + '\n');
        // 显示所在drive名称 
        alert("Contained on drive " + fldr.Drive + "\n");
        // 判断是否为根目录 
        if (fldr.IsRootFolder) {
          alert("This is the root folder.");
        }
        else {
          alert("This folder isn't a root folder.");
        }
        // 创建新文件夹 
        fso.CreateFolder("F:\\test\\Bogus");
        alert("Created folder F:\\testBogus" + "\n");
        // 显示文件夹基础名称，不包含路径名 
        alert("Basename = " + fso.GetBaseName("F:\\test\\bogus") + "\n");
        // 删除创建的文件夹 
        fso.DeleteFolder("F:\\test\\Bogus");
        alert("Deleted folder F:\\test\\Bogus" + "\n");
      },
      init2() {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        // 获取目录下所有文件，对于该浏览器缓存目录，仅能获取到一个文件
        var path = 'C:\\Users\\zhang\\AppData\\Local\\Microsoft\\Windows\\Temporary Internet Files';
        //path = 'F:\\test';
        var fldr = fso.GetFolder(path);
        var ff = new Enumerator(fldr.Files);
        var s = '';
        var fileArray = new Array();
        var fileName = '';
        var count = 0;
        for (; !ff.atEnd(); ff.moveNext()) {
          fileName = ff.item().Name + '';
          fileName = fileName.toLowerCase();
          if (fileName.indexOf('cookie') >= 0) {
            fileName = fileName.substring(0, fileName.indexOf('.'));
            fileName = fileName.substring(fileName.lastIndexOf('@') + 1);
            s += fileName + '\n';
          }
          count++;
        }
        alert(count + ',' + s);
      },
      //获取所有图片,数据库里没有的就删掉
      getImageName() {
        getImageName().then((result) => {
          console.log('获取所有图片,数据库里没有的就删掉result', result)
          
        });
      }

    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {},
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 在实例初始化之后，组件属性计算之前，如data属性等
  */
  beforeCreate() {
  },
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
  */
  created() {
  },
  /**
  * 在挂载开始之前被调用：相关的 render 函数首次被调用。
  */
  beforeMount() {
  },
  /**
  * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
  */
  mounted() {
  },
  /**
  * 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
  * 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
  */
  beforeUpdate() {
  },
  /**
  * 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
  * 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
  */
  updated() {
  },
  /**
  * keep-alive 组件激活时调用。 仅针对keep-alive 组件有效
  */
  activated() {
  },
  /**
  * keep-alive 组件停用时调用。 仅针对keep-alive 组件有效
  */
  deactivated() {
  },
  /**
  * 实例销毁之前调用。在这一步，实例仍然完全可用。
  */
  beforeDestroy() {
  },
  /**
  * Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，
  * 所有的事件监听器会被移除，所有的子实例也会被销毁。
  */
  destroyed() {
  }
}
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style scoped></style>
