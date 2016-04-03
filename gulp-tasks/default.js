var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var sass = require('gulp-sass');
var sh = require('shelljs');

var sourcemaps = require('gulp-sourcemaps');
var templateCache = require('gulp-angular-templatecache');

// 추가
var clean = require('gulp-clean');
var rename = require('gulp-rename');

var bower_path = 'bower_components';
var lib_path = 'www/lib';
// 추가 끝
// 
var paths = {
  sass: ['scss/**/*.scss'],
  templatecache: ['www/views/**/*.html'],
  // 추가 공통 라이브러리
  bower_components: [
    bower_path + '/ionic/scss/**/*.scss',
    bower_path + '/ionic/fonts/*.*',
    bower_path + '/ionic/js/ionic.bundle.js',
    //bower_path + '/angular/angular.min.js',
    //bower_path + '/angular-animate/angular-animate.min.js',
    //bower_path + '/angular-sanitize/angular-sanitize.min.js',
    //bower_path + '/angular-ui-router/release/angular-ui-router.min.js',
    //bower_path + '/ionic/js/ionic-angular.min.js',
    bower_path + '/angular-resource/angular-resource.min.js',
    bower_path + '/underscore/underscore-min.js',
    bower_path + '/moment/min/moment.min.js',
    bower_path + '/angular-moment/angular-moment.min.js',
    bower_path + '/angular-slugify/dist/angular-slugify.min.js',
    bower_path + '/collide/collide.js',
    bower_path + '/ngCordova/dist/ng-cordova.min.js',
    bower_path + '/bourbon/app/assets/stylesheets/**/*.scss',
  // FullApp 전용 라이브러리
    bower_path + '/ngmap/build/scripts/ng-map.min.js',
    bower_path + '/ionic-contrib-tinder-cards/ionic.tdcards.css',
    bower_path + '/ionic-contrib-tinder-cards/ionic.tdcards.js',
    bower_path + '/angular-youtube-mb/dist/angular-youtube-embed.min.js'
  // mobp 전용 라이브러리
  ]
};

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('templatecache', function (done) {
  gulp.src(paths.templatecache)
    .pipe(templateCache({standalone:true, filename:'views.js', module:'mobp.views', root:'views/'}))
    .pipe(gulp.dest('./www/js/'))
    .on('end', done);
});

// js 라이브러리를 www/lib (lib_path) 아래 복사
gulp.task('bower', function () {
  gulp.src(paths.bower_components, { base: bower_path })
    .pipe(gulp.dest(lib_path));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.templatecache, ['templatecache']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
