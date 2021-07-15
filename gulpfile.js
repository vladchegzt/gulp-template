'use strict';

const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const sass = require('gulp-sass');
const fileinclude = require('gulp-file-include');
const concat = require('gulp-concat');
const eslint = require("gulp-eslint");
const del = require('del');

const dir = {
    dist: {
        html: 'dist/pages/',
        fonts: 'dist/fonts',
        js: 'dist/js/',
        css: 'css/',
        img: 'dist/img/'
    },
    src: {
        html: 'app/pages/**/[^_]*.html',
        fonts: 'app/fonts/**/*.**',
        js: 'app/js/**/*.js',
        style: 'sass/main.scss',
        img: 'app/img/**/*.*'
    },
    watch: {
        style: 'sass/**/*.scss',
        html: '**/*.html',
        js: 'js/**/*.js',
        img: 'img/**/*.*'
    }
};

// BrowserSync
function serverInit(done) {
    browsersync.init({
        server: {
            baseDir: "./",
            directory: true
        },
        notify: false,
        open: true,
        port: 3070,
    });
    done();
}

// BrowserSync Reload
function serverReload(done) {
    browsersync.reload();
}

function css() {
    return gulp
        .src(dir.src.style)
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(dir.dist.css))
        .pipe(browsersync.stream());
}


function watchFiles() {
    gulp.watch(dir.watch.style, css);
    gulp.watch(dir.watch.html).on('change', serverReload);
    gulp.watch(dir.watch.js).on('change', serverReload);
    gulp.watch(dir.watch.img).on('change', serverReload);
}

// define complex tasks
// const build = gulp.series(css, serverInit, gulp.parallel(css, images, fonts, html, scripts, watchFiles));
const build = gulp.series(css, serverInit, gulp.parallel(css, watchFiles));
const watch = gulp.parallel(watchFiles, serverInit);

// export tasks
module.exports.css = css;
module.exports.watch = watch;
module.exports.default = build;