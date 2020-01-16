const { src, dest, parallel, series, watch } = require('gulp');
const pug             = require('gulp-pug');
const less            = require('gulp-less');
const browserSync     = require('browser-sync');
const autoprefixer    = require('gulp-autoprefixer');
const imagemin        = require('gulp-imagemin');
const concat          = require('gulp-concat');
const uglify          = require('gulp-uglify');
const csso            = require('gulp-csso');
const spritesmith     = require('gulp.spritesmith');
const gcmq            = require('gulp-group-css-media-queries');
const cleanCSS        = require('gulp-clean-css');
const notify          = require("gulp-notify");
const sourcemaps      = require('gulp-sourcemaps');
const rename          = require('gulp-rename');



const options = {
  folder: './build',
  // folder: './public/wp-content/themes/homyroom',
  sprite: 'numbers',
};

const pathToProject = options.folder;


//  PUG -> HTML
function html() {
  return src(pathToProject+'/assets/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .on("error", notify.onError({
      message: "Pug-Error: <%= error.message %>",
      title: "Pug"
    }))
    .pipe(dest(pathToProject))
    // .pipe(browserSync.reload({ stream: true }));
    .on('end', browserSync.reload);
}


//  LESS -> CSS
function css() {
  return src(pathToProject +'/assets/less/*.less')
    .pipe(sourcemaps.init())
      .pipe(less())
      .on("error", notify.onError({
        message: "Less-Error: <%= error.message %>",
        title: "Less"
      }))
      .pipe(autoprefixer(['last 3 versions', '> 1%', 'ie 10'], {cascade: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(dest(pathToProject +'/css'))
    .pipe(browserSync.reload({ stream: true }));
}


//  COMPRESS style.css
function cssmin(){
  return src(pathToProject +'/css/style.css')
    .pipe(less())
    .on("error", notify.onError({
      message: "Less-Error: <%= error.message %>",
      title: "Less"
    }))
    .pipe(autoprefixer(['last 3 versions', '> 1%', 'ie 10'], {cascade: true}))
    .pipe(gcmq())
    .pipe(cleanCSS({compatibility: 'ie10', format: 'keep-breaks'}))
    // .pipe(csso())
    // .pipe(rename('style.min.css'))
    .pipe(dest(pathToProject +'/css'));
}


//  BROWSER-SYNC
function browserS(){
  browserSync({
    server: {
      baseDir: pathToProject,
    },
    notify: false
  });
}


//  BUILDING libs.min.js
function jslibs() {
  return src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/slick-carousel/slick/slick.min.js',
      'node_modules/lity/dist/lity.min.js',
      // 'node_modules/imagesloaded/imagesloaded.pkgd.min.js',
      'node_modules/vanilla-lazyload/dist/lazyload.min.js',
      pathToProject +'/assets/libs/**/*.js',
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(dest(pathToProject +'/js'));
}


//  BUILDING libs.min.css
function csslibs(){
  return src([
      'node_modules/lity/dist/lity.min.css',
      pathToProject +'/assets/libs/**/*.css',
    ])
    .pipe(concat('libs.min.css'))
    .pipe(csso())
    .pipe(dest(pathToProject +'/css'));
}


//  COMPRESS images
function imageMin(){
  src(pathToProject +'/img/**/sprite.svg' )
    .pipe(dest(pathToProject +'/imgmin/svg'));

  return src(pathToProject +'/img/**/*', {ignore: '/**/sprite.svg'} )
    .pipe(imagemin({
      interlaced: true,
        progressive: true,
        optimizationLevel: 5,
        // svgoPlugins: [{removeViewBox: true}]
    }))
    .pipe(dest(pathToProject +'/imgmin/'));
}

function imagesprite() {
  return src(pathToProject +'/img/' + options.sprite + '/*.png')
    .pipe(spritesmith({
      algorithms: 'binary-tree',
      imgName: options.sprite + '.png',
      cssFormat: 'css',
      cssName: options.sprite + '.css',
      imgPath: '../img/' + options.sprite + '.png',
      padding: 10,
    }))
    .pipe(dest(pathToProject +'/img/'));
};


//  WATCHING files
// function watches(){
  // csslibs();
  // jslibs();

  watch(pathToProject+'/assets/less/**/*.less', css);
  watch(pathToProject+'/assets/**/*.pug', html);
  watch(pathToProject+'/assets/libs/*.js', jslibs);
  watch(pathToProject+'/assets/libs/*.css', csslibs);
  watch(pathToProject+'/js/*.js').on('change',  browserSync.reload);

  // browserS();
// }


function watchesLess(){
  // csslibs();
  // jslibs();

  watch(pathToProject+'/assets/less/**/*.less', { ignoreInitial: false }, css);
  watch(pathToProject+'/**/*.html').on('change',  browserSync.reload);
  watch(pathToProject+'/js/*.js').on('change',  browserSync.reload);

  // browserS();
}



exports.css = css;
exports.html = html;

exports.watches = series(parallel(html,css), parallel(browserS));
exports.watches2 = series(parallel(html,cssmin), parallel( browserS));
exports.watchesLess = watchesLess;

exports.imagesprite = imagesprite;

exports.imageMin = imageMin;
exports.cssmin = series(css, cssmin);

exports.csslibs = csslibs;
exports.jslibs = jslibs;

exports.default = parallel(html, css, jslibs);