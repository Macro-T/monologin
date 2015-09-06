'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;

var configuracion = require('./config.json');

/**
 *
 * Tareas Comunes de Vigilancia
 *
 */

/**
 * Funcion Encargada de Vigilar cambios en el Directorio
 * @param  {NO PARAMETROS} )
 * @return {NO DEVUELVE VALOR} Solo vigila
 */
gulp.task('watch', function (){
  gulp.watch(['./**/*.html'], ['reload']);
  gulp.watch([configuracion.styles.sassDir, configuracion.styles.scssDir],  ['styles', 'inject', 'reload']);
  gulp.watch([configuracion.scripts.jsDir],  ['jshint', 'inject']);
  gulp.watch(['./bower.json'],  ['bowerInject']);
  gulp.watch([configuracion.templates.tplDir],  ['reload'/*, 'templates'*/]);
});

gulp.task('reload', function (){
  gulp.src('./**/*.html')
          .pipe(plugins.connect.reload());
});


/**
 * Funciones basicas que pueden ser llamadas por Consola via GULP [nombre de la funcion]
 */
gulp.task('default', ['bowerInject', 'inject', 'styles', 'watch', 'serve']);
gulp.task('build', ['templates', 'compress', 'copy', 'serveDist']);


/**
 *
 *  Inicio de las tareas de Desarrollo
 *
 */

gulp.task('styles', function (){
  gulp.src(configuracion.styles.sassDir)
          .pipe(plugins.sass(configuracion.styles.option.sass).on('error', plugins.sass.logError))
          .pipe(plugins.autoprefixer(configuracion.styles.option.autoprefixer))
          .pipe(gulp.dest(configuracion.styles.dest));
});

gulp.task('jshint', function (){
  return gulp.src(configuracion.scripts.jsDir)
                    .pipe(plugins.jshint('.jshintrc'))
                    .pipe(plugins.jshint.reporter('jshint-stylish'))
                    .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('inject', function (){
  var target = gulp.src(configuracion.templates.main),
        sources = gulp.src([configuracion.scripts.jsDir, configuracion.styles.cssDir]);

  return target
              .pipe(plugins.inject(sources, configuracion.inject.injectOptions))
              .pipe(gulp.dest('./'))
              .pipe(plugins.notify({message: 'Contenido Injectado Exitosamente'}));
});

gulp.task('bowerInject', function (){
  gulp.src(configuracion.templates.main)
          .pipe(wiredep(configuracion.inject.wiredepOptions))
          .pipe(gulp.dest('./'));
});

/**
 * Creacion del Servidor de Desarrollo
 */

gulp.task('serve', function () {
  plugins.connect.server(configuracion.server.dev);
  plugins.notify({message: 'Servidor iniciado en http://localhost:' + configuracion.server.dev.port});
});
