var gulp 				= require('gulp'),
	less 				= require('gulp-less'),
	browserSync 		= require('browser-sync'),
	autoprefixer 		= require('gulp-autoprefixer'),
	imagemin			= require('gulp-imagemin'),
	concat				= require('gulp-concat'),
	uglify 				= require('gulp-uglify'),
	csso 				= require('gulp-csso'),
	spritesmith			= require('gulp.spritesmith'),
	gcmq 				= require('gulp-group-css-media-queries'),
	pug 				= require('gulp-pug');

require('events').EventEmitter.defaultMaxListeners = 0;

gulp.task('default', ['less', 'pug', 'imagemin'], function(){
	//return true;
});

gulp.task('less', function(){
	return gulp.src('./src/less/style.less')
		.pipe(less())
		.pipe(gcmq())
		.pipe(autoprefixer(['last 10 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
		.pipe(gulp.dest('./public/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('pug', function(){
	return gulp.src('./src/index.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('./public'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: './public',
		},
		notify: false
	});
});

gulp.task('imagemin', function(){
	return gulp.src('./src/img/**/*')
		.pipe(imagemin({
			interlaced: true,
		    progressive: true,
		    optimizationLevel: 5,
		    svgoPlugins: [{removeViewBox: true}]
		}))
		.pipe(gulp.dest('./public/img/'));
});

var icons = 'icons';
gulp.task('imagesprite', function () {
  return gulp.src('./src/img/' + icons + '/*.png')
  	.pipe(spritesmith({
  		algorithms: 'binary-tree',
	    imgName: icons + '.png',
	    cssFormat: 'css',
	    cssName: icons + '.css',
	    imgPath: '../img/' + icons + '.png',
	    padding: 10,
	  }))
	  .pipe(gulp.dest('./src/img/'));
});

gulp.task('jsmin', function() {
  return gulp.src([
  		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/slick-carousel/slick/slick.min.js',
		'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
		'./src/js/**/*.js'
	])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('cssmin', function() {
  return gulp.src([
  		'node_modules/magnific-popup/dist/magnific-popup.css',
  		'./src/css/**/*.css'
  	])
    .pipe(concat('libs.min.css'))
    .pipe(csso())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', ['pug', 'less', 'imagemin', 'browser-sync'], function(){
	gulp.watch('./src/less/**/*.less', ['less']);
	gulp.watch('./src/**/*.pug', ['pug']);
	//gulp.watch('./public/*.html', browserSync.reload);
	gulp.watch('./public/js/*.js', browserSync.reload);
});

gulp.task('less-watch', ['less', 'browser-sync'], function(){
	gulp.watch('./src/less/**/*.less', ['less']);
});



var smartgrid = require('smart-grid');
 
/* It's principal settings in smart grid project */
var settings = {
    outputStyle: 'less', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: "30px", /* gutter width px || % */
    container: {
        maxWidth: '1170px', /* max-width оn very large screen */
        fields: '15px' /* side fields */
    },
    breakPoints: {
        lg: {
            'width': '1170px', /* -> @media (max-width: 1100px) */
            'fields': '15px' /* side fields */
        },
        md: {
            'width': '960px',
            'fields': '15px'
        },
        sm: {
            'width': '780px',
            'fields': '15px'
        },
        xs: {
            'width': '560px',
            'fields': '15px'
        },
        xxs: {
            'width': '425px',
            'fields': '15px'
        }
        /* 
        We can create any quantity of break points.
 
        some_name: {
            some_width: 'Npx',
            some_offset: 'N(px|%)'
        }
        */
    }
};

gulp.task('smartgrid', function() {
  return smartgrid('./src/less', settings);
});
 
