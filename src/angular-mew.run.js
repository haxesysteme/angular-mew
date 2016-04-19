(function () {
    'use strict';
    angular
        .module('angular-mew')
        .run(run);

    run.$inject = ['Hawk', 'HawkErrors', 'HawkConfiguration'];
    function run(Hawk, HawkErrors, HawkConfiguration) {
        if (Hawk == null) {
            throw HawkErrors.HAWK_UNAVAILABLE;
        }
        // HawkConfiguration.setEnabled(true);
        // HawkConfiguration.setCredentials('dh37fgj492je', 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn');
        // HawkConfiguration.setAlgorithm('sha256');
    }
})();