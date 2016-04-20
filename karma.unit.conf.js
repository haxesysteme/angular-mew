// Karma configuration
// Generated on Tue Mar 29 2016 14:56:06 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/hawk/dist/browser.js',
      'dist/angular-mew.js',
      'src/*.spec.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    //  Custom launcher for Travis-CI
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    singleRun: true,
    concurrency: Infinity,
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    }
  });
  if(process.env.TRAVIS){
    config.browsers = ['Chrome_travis_ci'];
  }
};
