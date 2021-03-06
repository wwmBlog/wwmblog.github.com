module.exports = function(grunt) {

  // HOW TO BUILD
  // 1. Specify every build options in this GruntFile.js
  // 2. Load necessary tasks to finish the building.

  grunt.initConfig({
      "seajs_build" : {
        options : { 
          outputPath    : "build"
        , seajsBasePath : "js" // a path that points to the same location as `Sea.js's base`
                               // relative to GruntFile.js

        // Following options' value is their default value
        , path       : "."
                // a folder that is relative to `seajsBasePath`, files within the folder will be added ID.
        , scheme     : null
                // `scheme` type:
                //   String, {{filename}} is replace by the file path, relative to `seajsBasePath`.
                //   Function : function( FILENAME ) { return ID; }
                //   Falsy, the ID is FILENAME.
        , alias      : null
                // Use `alias` to map PATH (relative to `seajsBasePath`) to ID, if :
                // 1. The dependency is not found within the TARGET's path.
                // 2. The dependency's path is not relative path.
                // Otherwise, use `scheme` to determine the ID
        , recursive  : true
                // If true, add ID for files in subfolder.
        , buildType  : "exclude_merge"
                // Possible values :
                // "all"
                //   Build and output all files in TARGET, then output the merged file.
                // "merge_only"
                //   Only merged file ( specified in `TARGET's files` ) will be created in `outputPath`
                // "exclude_merge"
                //   Output the merged file. Then output those not merged files.
      }

      // Target `main`
      // A build_cmd TARGET does :
      // 1. use `scheme` and `alias` to add ID for each CMD module file within `path`
      // 2. concat CMD into one file.
      , main : { 
          options : { path : "." }

        // `files` is used to determine what files should be merge to one file.
        // See https://github.com/gruntjs/grunt/wiki/Configuring-tasks#files
        // Parameters : 
        //   `src`  is relative to GruntFile
        //   `dest` is relative to options.outputPath
        //   `concatDeps` ( default:false ): If true, include all dependencies into one file, recursively.
        , files : [
            { 
              src        : "js/main.js"
            , dest       : "js/main.js"
            , filter     : "isFile"
            , concatDeps : true
          }
        ]
      }
    }
    , uglify : {
          minify  : {
          expand  : true
        , cwd     : "build/js"
        , src     : ['*.js', '**/*.js'] 
        , dest    : 'build/js'
        , ext     : '.js'
      }
    }
    , cssmin : { 
        options : { report : "min" }
      , minify  : {
          expand : true
        , cwd    : "css/"
        , src    : ['*.css']
        , dest   : 'css/'
        , ext    : '.css'
      }
    }
    , concat : {
        options : { separator: '\n;' }
      , build : {
          src  : ['build/js/libs/*.js']
        , dest : 'build/js/libs.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-seajs-build');

  grunt.registerTask("wwm_obscure", function(){

    var c = grunt.file.read("build/js/main.js")
                .replace(/html\((["'])([^\x00-\x80]{3}|\d{11})/g, function(m, m1, m2){
      if ( m2.match(/\d{11}/) ) {
        return "html(" + m1 + (m2.match(/\d{1,4}/g).join(m1 + "+" + m1));
      } else {
        var unicode = '';
        for ( var i = 0; i < m2.length; ++i ) {
          var theU = m2.charCodeAt(i).toString(16).toUpperCase();
          while (theU.length < 4) { theU = '0' + theU; }
          unicode += "\\u" + theU;
        }
        return "html(" + m1 + unicode;
      }
      return m;
    })
    grunt.file.write("build/js/main.js", c);

  });

  grunt.registerTask("default", ['seajs_build', 'uglify', 'wwm_obscure', 'concat', 'cssmin']);
}
