const gulp = require('gulp');
const path = require('path');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const less = require('gulp-less');
const minifyCSS = require('gulp-minify-css');
const rename = require("gulp-rename");
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const runSequence = require('gulp-sequence').use(gulp);
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require("gulp-babel");    // 用于ES6转化ES5
/*项目的目录结构*/
const dirs = {
  src: './src',
  css: './src/css',
  less: './src/less',
  js: './src/js',
  imgs: './src/imgs',
  html:'./src/html'
};

/*要处理的文件名*/
const files = {
  lessFiles: './src/less/*.less',
  cssFiles: './src/css/*.css',
  jsFiles: './src/js/*.js',
  imgFiles:'./src/imgs/*.*',
}

// ------------------开发阶段------------------------------------------------------
gulp.task('start', ['create']); //项目初始化的第一个命令
gulp.task('dev-watch', ['server']); //开始编写项目后开启服务器实时更新

// ------------------生产阶段------------------------------------------------------
gulp.task('prefixer', ['autoprefixer']); //给css文件添加浏览器私有前缀 files.cssFiles ==>> .src/css/
gulp.task('min-css', ['minify-css']); //压缩css文件 files.cssFiles ==>> dist/css/
gulp.task('js-handl', ['js-concat-compress']); //合并计算文件  dirs.js/**/*.js ==>> ./dist/js/concated.js
gulp.task('img-handl', ['img-handl']) //处理图片，对图片进行无损的压缩

//-------------------一键生成项目文件-----------------------------------------------

gulp.task('build',runSequence('clean-dist','compile-less','autoprefixer','minify-css','js-concat-compress','html','img-handl','move','zip')),


/*_________________上面为配置项_____________________________________________________*/
/*1、生成项目目录*/
gulp.task('create', () => {
  const mkdirp = require('mkdirp'); //创建文件夹
  for (let i in dirs) {
    mkdirp(dirs[i], err => {
      err ? console.log(err) : console.log('mkdir-->' + dirs[i]);;
    });
  }
});

// 本地服务器功能，自动刷新（dev）
gulp.task('server', ['compile-less'],()=>{
  browserSync.init({
    server: './src'
  });
  // 代理
  //    browserSync.init({
//        proxy: "你的域名或IP"
//    });
  gulp.watch(dirs.less+'/**/*.less', ['compile-less']);
  gulp.watch('./src/**/*.html').on('change',reload);
  gulp.watch(dirs.js+'/**/*.js').on('change', reload);
  gulp.watch(dirs.css+'/**/*.css').on('change', reload);
});

/*清除dist目录*/
gulp.task('clean-dist',()=>{
  const clean = require('gulp-clean');
  return gulp.src('./dist', {read: false}).pipe(clean());
});

// 压缩css(生产环境)
gulp.task('minify-css', function () {
  return gulp.src(dirs.css+'/**/*.css')
    .pipe(minifyCSS({/*keepBreaks: true*/}))
    .pipe(rename(path=>path.basename += '.min'))
    .pipe(gulp.dest('./dist/css/'))
});

/*css处理*/
//编译less
gulp.task('compile-less', () => {
  return gulp.src(files.lessFiles)
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(less())
  .pipe(gulp.dest(dirs.css + '/'))
  .pipe(reload({stream: true}));
})

//添加浏览器私有前缀（生产环境）
gulp.task('autoprefixer', () => {
  const postcss = require('gulp-postcss');
  const sourcemaps = require('gulp-sourcemaps');
  const autoprefixer = require('autoprefixer');
  return gulp.src(files.cssFiles)
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dirs.css+'/'))
});

//压缩html
gulp.task('html', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
   return gulp.src('./src/**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/'));
});

// js文件--合并--压缩(生产环境)
gulp.task('js-concat-compress', (cb)=>{
  let name = '';
  return gulp.src(dirs.js+'/**/*.js')
   //将ES6代码转译为可执行的JS代码
  .pipe(babel({
            presets: ["es2015"]               
        }))
  .pipe(rename(path=>{path.basename += '';name=path.basename;}))
  .pipe(concat('bundle.js'))//合并后的文件名
  .pipe(uglify())  //压缩js到一行
  .pipe(rename(path=>{
    path.basename = name+'.'+path.basename+'.min';
  }))
  .pipe(gulp.dest('dist/js/')); 
});

// 图片无损压缩
gulp.task('img-handl',()=>{
  const imagemin = require('gulp-imagemin');
  return gulp.src(files.imgFiles)
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/imgs/'))
});

//无需打包的文件，比如layui,直接移动到dist文件夹
gulp.task('move',()=>{
  return gulp.src('src/static/**/*')
		.pipe(gulp.dest('./dist/layui/'))
});

// 项目打包(生产环境)
gulp.task('zip',()=>{
  const zip = require('gulp-zip');
  return gulp.src(['dist/**/*'])
  .pipe(zip('product.zip'))
  .pipe(gulp.dest('./'))
});