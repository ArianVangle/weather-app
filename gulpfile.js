const gulp = require('gulp')
require('./gulp/dev')
require('./gulp/prod')

gulp.task(
	'default',
	gulp.series(
		'clean:dev',
		gulp.parallel('html:dev', 'js:dev', 'scss:dev', 'images:dev', 'fonts:dev', 'files:dev'),
		'fontFace:dev',
		gulp.parallel('watch:dev', 'server:dev')
	)
)
gulp.task(
	'prod',
	gulp.series(
		'clean:prod',
		gulp.parallel('html:prod', 'js:prod', 'scss:prod', 'images:prod', 'fonts:prod', 'files:prod'),
		'fontFace:prod',
		gulp.parallel('watch:prod', 'server:prod')
	)
)
