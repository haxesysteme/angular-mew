(function(){
    'use strict';
    angular
        .module('angular-mew')
        .factory('HawkConfiguration', hawkConfiguration);

    hawkConfiguration.$inject = ['HawkAlgorithms', 'HawkErrors'];

    function hawkConfiguration(HawkAlgorithms, HawkErrors) {
        var settings = {
            algorithm: HawkAlgorithms[0],
            credentials: {
                id: undefined,
                secret: undefined
            },
            enabled: false,
            checkServerAuthorization: true
        };

        return {
            setEnabled: setEnabled,
            setAlgorithm: setAlgorithm,
            setCredentials: setCredentials,
            setCheckServerAuthorization: setCheckServerAuthorization,
            getSettings: function(){
                //return a copy form the settings so they can not be altered this way
                return JSON.parse(JSON.stringify(settings));
            }
        };

        function setCredentials(id, secret){
            settings.credentials.id = id;
            settings.credentials.secret = secret;
        }

        function setAlgorithm(algorithm) {
            if(HawkAlgorithms.indexOf(algorithm) == -1){
                throw HawkErrors.ALGORITHM;
            }
            settings.algorithm = algorithm;
        }

        function setEnabled(enabled) {
            settings.enabled = enabled;
        }

        function setCheckServerAuthorization(check) {
            settings.checkServerAuthorization = check;
        }
    }

})();