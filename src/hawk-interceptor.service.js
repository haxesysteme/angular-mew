(function () {
    'use strict';
    angular
        .module('angular-mew')
        .factory('HawkInterceptor', hawkInterceptor);

    hawkInterceptor.$inject = ['$location', '$log', '$q', 'Hawk', 'HawkAlgorithms', 'HawkConfiguration', 'HawkErrors'];

    function hawkInterceptor($location, $log, $q, Hawk, HawkAlgorithms, HawkConfiguration, HawkErrors) {
        return {
            'request': request,
            'response': response
        };

        function getCredentials(config) {
            var hawkSettings = HawkConfiguration.getSettings();
            var credentials = {
                key: hawkSettings.credentials.secret,
                id: hawkSettings.credentials.id,
                algorithm: hawkSettings.algorithm
            };

            if (typeof config.hawk.credentials !== "undefined") {
                credentials.key = config.hawk.credentials.key;
                credentials.id = config.hawk.credentials.id;
            }

            if (typeof config.hawk.algorithm !== "undefined") {
                if (HawkAlgorithms.indexOf(config.hawk.algorithm) == -1) {
                    throw HawkErrors.ALGORITHM;
                }
                credentials.algorithm = config.hawk.algorithm;
            }

            return credentials;
        }

        function isDisabled(config) {
            var hawkSettings = HawkConfiguration.getSettings();
            var isDisabledViaConfig = typeof config.hawk.enabled !== "undefined" && !config.hawk.enabled;
            if (!hawkSettings.enabled) {
                if (typeof config.hawk.enabled === "undefined" || isDisabledViaConfig) {
                    return true;
                }
            }else if(isDisabledViaConfig) {
                return true;
            }
            return false
        }

        function request(config) {
            var addedHawkConfig = false;
            if(typeof config.hawk === "undefined"){
                config.hawk = {};
                addedHawkConfig = true;
            }
            if(isDisabled(config)) {
                if (addedHawkConfig){
                    delete config.hawk;
                }
                return config;
            }

            $log.debug('intercepting http request');
            var hawkOptions = {
                credentials: getCredentials(config)
            };
            if (hawkOptions.credentials.key == null || hawkOptions.credentials.id == null) {
                return $q.reject({
                    reason: HawkErrors.MISSING_CREDENTIALS,
                    config: config
                });
            }

            var url = config.url;
            if(typeof url === 'string') {
                if (!url.match(Hawk.utils.uriRegex)){
                    var prefix = $location.protocol()+'://';
                    prefix += $location.host();
                    var port = $location.port();
                    if(port !== 80) {
                        prefix += ':'+port;
                    }
                    url = prefix + url;
                }
                var urlParams = config.paramSerializer(config.params);
                if (urlParams.length)
                    url = url + '?' + urlParams;
            }

            var header = Hawk.client.header(url, config.method, hawkOptions);
            if (typeof header.err !== "undefined") {
                return $q.reject({
                    reason: HawkErrors.HEADER_GENERATION + ": \"" + header.err + "\"",
                    config: config
                });
            }
            config.headers.Authorization = header.field;
            config.hawk.artifacts = header.artifacts;
            return config;
        }

        function response(response) {
            var addedHawkConfig = false;
            if(typeof response.config.hawk === "undefined"){
                response.config.hawk = {};
                addedHawkConfig = true;
            }
            var hawkSettings = HawkConfiguration.getSettings();

            if(response.config.hawk.hasOwnProperty('checkServerAuthorization')){
                hawkSettings.checkServerAuthorization = response.config.hawk.checkServerAuthorization;
            }

            if (isDisabled(response.config) || !hawkSettings.checkServerAuthorization) {
                if (addedHawkConfig){
                    delete response.config.hawk;
                }
                return response;
            }
            $log.debug('intercepting http response');
            // Add getResponseHeader as an alternative for the headers function (Hawk uses this function)
            response.getResponseHeader = response.headers;
            var options = {};
            var header = response.headers('Server-Authorization');
            if (typeof response.data !== 'undefined' && header.indexOf('hash="')> -1){
                options.payload = response.data;
            }
            var isValid = Hawk.client.authenticate(response, getCredentials(response.config), response.config.hawk.artifacts, options);
            if (!isValid) {
                return $q.reject({
                    reason: HawkErrors.RESPONSE_VALIDATION,
                    response: response
                });
            }
            return response;
        }
    }
})();