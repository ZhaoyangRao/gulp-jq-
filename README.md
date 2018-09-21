# >Author
  >raocy
  
# gulp-flow
> 利用gulp及其插件搭建的前端工作流平台，一键自动化生产工具
>

### 

>第一步安装Nodejs环境 https://nodejs.org/en/  

>建议淘宝镜像 cnpm  =>   npm install -g cnpm --registry=https://registry.npm.taobao.org

### 构建项目命令 具体指令请参考gulpfile.js的配置  具体gulp知识参考 https://www.gulpjs.com.cn/

   # 下载依赖  
     cnpm install
     
   # 自动初始化构建项目结构 
     gulp create 
     
   # 启动项目 目录位置为 './src'  创建index.html   
     gulp server
     
   # 项目打包(css压缩,less编译，js编译es6转es5，js压缩，图片无损压缩，html压缩，打包)
     gulp build  生成product.zip包

### 目录结构
    
├── README.md                // 说明文件
├── node_modules    //依赖
├── src    //业务层
│   ├── css 
│   ├── img
│   ├── js
│   ├── less
│   ├── html
│   ├── static //各种外部的UI库文件，无需压缩的目录 例如jq,bs,layui,echart等
│   ├── index.html  入口
├── gulpfile.js  //gulp配置
├── package.json 

#### 基础技术栈
 ├──gulp   https://www.gulpjs.com.cn/ 
 ├──layui  https://www.layui.com/doc/ layui 兼容人类正在使用的全部浏览器（IE6/7除外），可作为 PC 端后台系统与前台界面的速成开发方案。
 ├──underscorejs  https://underscorejs.org/  一个JavaScript实用库，提供了一整套函数式编程的实用功能
### 基本规范
 小驼峰命名=>例如：homeWork
 各文件夹放各文件夹后缀的文件