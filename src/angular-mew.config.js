(function () {
    'use strict';

    angular
        .module('angular-mew')
        .config(configuration);

    configuration.$inject = ['$httpProvider'];
    function configuration ($httpProvider){
        $httpProvider.interceptors.push('HawkInterceptor');
    }
})();