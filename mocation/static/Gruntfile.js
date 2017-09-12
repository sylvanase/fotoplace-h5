module.exports = function(grunt) {


	// 项目配置
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {
			compile: {
				options: {
					sassDir: 'sass',
					cssDir: 'css/sharepage',
					imagesDir: 'images',
					relativeAssets: true,
					environment: 'development' //'development' //production
				}
			},
			publish: {
				options: {
					sassDir: 'sass',
					cssDir: 'css/sharepage',
					imagesDir: 'images/sharepage',
					httpPath: "/static/",
					httpImagesPath: '/static/images',
					httpGeneratedImagesPath: '/static/images',
					environment: 'production' //'development' //production
				}
			}
		},
		cssmin: {
			minify: {
				expand: true,
				cwd: 'css/sharepage',
				src: ['*.css', '!*.min.css'],
				dest: 'css/min'
					//ext: '.min.css'
			}
		},
		watch: {
			sass: {
				files: ['sass/*.scss'],
				tasks: ['compass'],
				options: {
					spawn: true
				}
			}
		}
	});

	//加载插件
	grunt.loadNpmTasks('grunt-contrib-watch'); //代码变化监控
	grunt.loadNpmTasks('grunt-contrib-compass'); //解析sass
	grunt.loadNpmTasks('grunt-contrib-cssmin'); //压缩css

	//任务列表
	grunt.registerTask('default', ['compass:compile']);
	grunt.registerTask('publish', ['cssmin:minify']);
}