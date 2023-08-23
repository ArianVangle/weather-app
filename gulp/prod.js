const server = require('browser-sync')
const gulp = require('gulp')

//HTML
const fileInclude = require('gulp-file-include')
const htmlclean = require('gulp-htmlclean')
const webpHTML = require('gulp-webp-html')
//SCSS
const sass = require('gulp-sass')(require('sass'))
const sassGlob = require('gulp-sass-glob')
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const sourceMaps = require('gulp-sourcemaps')
const webpCss = require('gulp-webp-css')
const mediaQueries = require('gulp-group-css-media-queries')
const clean = require('gulp-clean')
const fs = require('fs')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const webpack = require('webpack-stream')
const babel = require('gulp-babel')
//IMAGES
const webp = require('gulp-webp')
const imagemin = require('gulp-imagemin')
const changed = require('gulp-changed')
const replace = require('gulp-replace')
const fonter = require('gulp-fonter-unx')
const ttf2woff2 = require('gulp-ttf2woff2')

//!======================================HTML==============================
gulp.task('html:prod', () => {
	return gulp
		.src('./src/html/pages/**/*.html')
		.pipe(
			plumber({
				errorHandler: notify.onError({
					title: 'HTML',
					message: 'Error <%= error.message %> ',
					sound: true,
				}),
			})
		)
		.pipe(
			fileInclude({
				prefix: '@@',
				basepath: '@file',
			})
		)
		.pipe(replace(/@img\//g, 'img/'))
		.pipe(replace(/@js\//g, 'js/'))
		.pipe(replace('.js', '.bundle.js'))
		.pipe(htmlclean())
		.pipe(webpHTML())
		.pipe(gulp.dest('./dist/'))
	// .pipe(server.stream())
})

//!======================================SCSS==============================
gulp.task('scss:prod', () => {
	return gulp
		.src('./src/scss/main.scss')
		.pipe(
			plumber({
				errorHandler: notify.onError({
					title: 'SCSS',
					message: 'Error <%= error.message %> ',
					sound: true,
				}),
			})
		)
		.pipe(sourceMaps.init())
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(replace(/@img\//g, './../img/'))
		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ['Last 3 versions'],
				cascade: true,
			})
		)
		.pipe(mediaQueries())
		.pipe(sourceMaps.write())
		.pipe(csso())
		.pipe(webpCss())
		.pipe(gulp.dest('./dist/css'))
	// .pipe(server.stream())
})

//!======================================JS==============================
gulp.task('js:prod', () => {
	return gulp
		.src('./src/js/**/*.js')
		.pipe(
			plumber({
				errorHandler: notify.onError({
					title: 'JS',
					message: 'Error <%= error.message %> ',
					sound: true,
				}),
			})
		)
		.pipe(babel())
		.pipe(webpack(require('./../webpack.config.js')))
		.pipe(replace(/@img\//g, './../img/'))
		.pipe(gulp.dest('./dist/js'))
	// .pipe(server.stream())
})

//!======================================IMAGES==============================
gulp.task('images:prod', () => {
	return gulp
		.src('./src/img/**/*')
		.pipe(changed('./dist/img/'))
		.pipe(webp())
		.pipe(gulp.dest('./dist/img/'))
		.pipe(gulp.src('./src/img/**/*'))
		.pipe(imagemin({ verbose: true }))
		.pipe(gulp.dest('./dist/img/'))
})

//!======================================FONTS==============================
gulp.task('fonts:prod', () => {
	return gulp
		.src('./src/fonts/*.otf')
		.pipe(
			fonter({
				formats: ['woff'],
			})
		)
		.pipe(gulp.dest('./dist/fonts/'))
		.pipe(gulp.src('./src/fonts/*.otf'))
		.pipe(
			fonter({
				formats: ['ttf'],
			})
		)
		.pipe(ttf2woff2())
		.pipe(gulp.dest('./dist/fonts/'))
		.pipe(gulp.src('./src/fonts/*.ttf'))
		.pipe(
			fonter({
				formats: ['woff'],
			})
		)
		.pipe(gulp.dest('./dist/fonts/'))
		.pipe(gulp.src('./src/fonts/*.ttf'))
		.pipe(ttf2woff2())
		.pipe(gulp.dest('./dist/fonts/'))
})
gulp.task('fontFace:prod', () => {
	let fontsFile = `./src/scss/base/fonts.scss`
	fs.readdir('./dist/fonts', function (err, fontsFiles) {
		fs.writeFile(fontsFile, '', cb)
		if (fontsFiles) {
			let newFileOnly
			for (let i = 0; i < fontsFiles.length; i++) {
				let fontFileName = fontsFiles[i].split('.')[0]
				if (newFileOnly !== fontFileName) {
					let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName
					let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName
					if (fontWeight.toLowerCase() === 'thin') {
						fontWeight = 100
					} else if (fontWeight.toLowerCase() === 'extralight') {
						fontWeight = 200
					} else if (fontWeight.toLowerCase() === 'light') {
						fontWeight = 300
					} else if (fontWeight.toLowerCase() === 'medium') {
						fontWeight = 500
					} else if (fontWeight.toLowerCase() === 'semibold') {
						fontWeight = 600
					} else if (fontWeight.toLowerCase() === 'bold') {
						fontWeight = 700
					} else if (fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
						fontWeight = 800
					} else if (fontWeight.toLowerCase() === 'black') {
						fontWeight = 900
					} else {
						fontWeight = 400
					}
					fs.appendFile(
						fontsFile,
						`
	@font-face {
		font-family: ${fontName};
		font-display: swap;
		src: url('../fonts/${fontFileName}.woff2') format('woff2'), url('../fonts/${fontFileName}.woff') format('woff');
		font-weight: ${fontWeight};
		font-style: normal;
	}`,
						cb
					)
					newFileOnly = fontFileName
				}
			}
		}
	})
	return gulp.src(`./src/`)
	function cb() {}
})

//!======================================FILES==============================
gulp.task('files:prod', () => {
	return gulp.src('./src/files/**/*').pipe(gulp.dest('./dist/files'))
})

//!======================================SERVER==============================
gulp.task('server:prod', (done) => {
	server.init({
		server: {
			baseDir: `./dist`,
		},
		notify: false,
		port: 1000,
	})
})

//!======================================CLEAN==============================
gulp.task('clean:prod', (done) => {
	if (fs.existsSync('./dist/')) {
		return gulp.src('./dist/', { read: false }).pipe(clean())
	} else done()
})

gulp.task('watch:prod', () => {
	gulp.watch('./src/scss/**/*.scss', gulp.parallel('scss:prod'))
	gulp.watch('./src/**/*.html', gulp.series('html:prod'))
	gulp.watch('./src/img/**/*', gulp.series('images:prod'))
	gulp.watch('./src/fonts/**/*', gulp.series('fonts:prod'))
	gulp.watch('./src/files/**/*', gulp.parallel('files:prod'))
	gulp.watch('./src/js/**/*', gulp.parallel('js:prod'))
})
