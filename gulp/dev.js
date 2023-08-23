const server = require('browser-sync')
const gulp = require('gulp')
const fileInclude = require('gulp-file-include')
const sass = require('gulp-sass')(require('sass'))
const clean = require('gulp-clean')
const fs = require('fs')
const sourceMaps = require('gulp-sourcemaps')
const mediaQueries = require('gulp-group-css-media-queries')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const webpack = require('webpack-stream')
const babel = require('gulp-babel')
const imagemin = require('gulp-imagemin')
const changed = require('gulp-changed')
const sassGlob = require('gulp-sass-glob')
const replace = require('gulp-replace')
const fonter = require('gulp-fonter-unx')
const ttf2woff2 = require('gulp-ttf2woff2')
//!======================================HTML==============================
gulp.task('html:dev', () => {
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
		.pipe(gulp.dest('./build/'))

		.pipe(server.stream())
})

//!======================================SCSS==============================
gulp.task('scss:dev', () => {
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
		.pipe(mediaQueries())
		.pipe(sourceMaps.write())
		.pipe(replace(/@img\//g, './../img/'))
		.pipe(gulp.dest('./build/css'))
		.pipe(server.stream())
})

//!======================================JS==============================
gulp.task('js:dev', () => {
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
		.pipe(gulp.dest('./build/js'))
		.pipe(server.stream())
})

//!======================================IMAGES==============================
gulp.task('images:dev', () => {
	return (
		gulp
			.src('./src/img/**/*')
			// .pipe(changed('./build/img/'))
			// .pipe(imagemin({ verbose: true }))
			.pipe(gulp.dest('./build/img/'))
	)
})

//!======================================FONTS==============================
gulp.task('fonts:dev', () => {
	return gulp
		.src('./src/fonts/*.otf')
		.pipe(
			fonter({
				formats: ['woff'],
			})
		)
		.pipe(gulp.dest('./build/fonts/'))
		.pipe(gulp.src('./src/fonts/*.otf'))
		.pipe(
			fonter({
				formats: ['ttf'],
			})
		)
		.pipe(ttf2woff2())
		.pipe(gulp.dest('./build/fonts/'))
		.pipe(gulp.src('./src/fonts/*.ttf'))
		.pipe(
			fonter({
				formats: ['woff'],
			})
		)
		.pipe(gulp.dest('./build/fonts/'))
		.pipe(gulp.src('./src/fonts/*.ttf'))
		.pipe(ttf2woff2())
		.pipe(gulp.dest('./build/fonts/'))
})
gulp.task('fontFace:dev', () => {
	let fontsFile = `./src/scss/base/fonts.scss`
	fs.readdir('./build/fonts', function (err, fontsFiles) {
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
gulp.task('files:dev', () => {
	return gulp.src('./src/files/**/*').pipe(gulp.dest('./build/files'))
})

//!======================================SERVER==============================
gulp.task('server:dev', (done) => {
	server.init({
		server: {
			baseDir: `./build`,
		},
		notify: false,
		port: 8000,
	})
})

//!======================================CLEAN==============================
gulp.task('clean:dev', (done) => {
	if (fs.existsSync('./build/')) {
		return gulp.src('./build/', { read: false }).pipe(clean())
	} else done()
})

//!======================================CLEAN-FOLDERS==============================
gulp.task('cleanHTML:dev', () => {
	return gulp.src('./build/*.html', { read: false }).pipe(clean())
})
gulp.task('cleanImages:dev', (done) => {
	if (fs.existsSync('./build/')) {
		return gulp.src('./build/img/', { read: false }).pipe(clean())
	} else done()
})
gulp.task('cleanFonts:dev', () => {
	return gulp.src('./build/fonts/*', { read: false }).pipe(clean())
})
gulp.task('cleanSCSS:dev', () => {
	return gulp.src('./build/css/*', { read: false }).pipe(clean())
})
gulp.task('cleanJS:dev', () => {
	return gulp.src('./build/js/*', { read: false }).pipe(clean())
})

gulp.task('watch:dev', () => {
	gulp.watch('./src/scss/**/*.scss', gulp.parallel('cleanSCSS:dev', 'scss:dev'))
	gulp.watch('./src/**/*.html', gulp.series('cleanHTML:dev', 'html:dev'))
	gulp.watch('./src/img/**/*', gulp.series('cleanImages:dev', 'images:dev'))
	gulp.watch('./src/fonts/**/*', gulp.series('cleanFonts:dev', 'fonts:dev', 'fontFace:dev'))
	gulp.watch('./src/files/**/*', gulp.parallel('files:dev'))
	gulp.watch('./src/js/**/*', gulp.parallel('cleanJS:dev', 'js:dev'))
})
