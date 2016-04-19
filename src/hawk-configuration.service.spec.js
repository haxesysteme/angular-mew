describe("HawkConfiguration", function(){
    var HawkConfiguration = undefined;
    var HawkAlgorithms = undefined;
    var HawkErrors = undefined;
    beforeEach(module('angular-mew'));
    beforeEach(inject(function (_HawkAlgorithms_, _HawkConfiguration_, _HawkErrors_) {
        HawkConfiguration = _HawkConfiguration_;
        HawkAlgorithms = _HawkAlgorithms_;
        HawkErrors = _HawkErrors_;
    }));

    it("should have default settings", function () {
        var settings = HawkConfiguration.getSettings();
        expect(settings.algorithm).toEqual(HawkAlgorithms[0]);
        expect(settings.checkServerAuthorization).toBe(true);
        expect(settings.enabled).toBe(false);
    });

    it("should be not possible to alter the settings trough the retrieved object using getSettings()", function () {
        var settings = HawkConfiguration.getSettings();
        settings.credentials.id = "this is altered";
        var settings2 = HawkConfiguration.getSettings();
        expect(settings2.credentials.id).toBeUndefined();
    });

    it("should be not able to toggle the interceptor between enabled and disabled", function () {
        var settings = HawkConfiguration.getSettings();
        expect(settings.enabled).toBe(false);
        HawkConfiguration.setEnabled(true);
        settings = HawkConfiguration.getSettings();
        expect(settings.enabled).toBe(true);
    });

    it("should be not able to toggle the server checking between enabled and disabled", function () {
        var settings = HawkConfiguration.getSettings();
        expect(settings.checkServerAuthorization).toBe(true);
        HawkConfiguration.setCheckServerAuthorization(false);
        settings = HawkConfiguration.getSettings();
        expect(settings.checkServerAuthorization).toBe(false);
    });

    it("should be not possible to change the algorithm to an unknown one", function () {
        expect(function () {
            HawkConfiguration.setAlgorithm(HawkAlgorithms[0]+'ThisDoesNotExist');
        }).toThrow(HawkErrors.ALGORITHM);
    });

    it("should be possible to change the algorithm to another available one", function () {
        var settings = HawkConfiguration.getSettings();
        expect(settings.algorithm).toEqual(HawkAlgorithms[0]);
        HawkConfiguration.setAlgorithm(HawkAlgorithms[HawkAlgorithms.length-1]);
        settings = HawkConfiguration.getSettings();
        expect(settings.algorithm).toEqual(HawkAlgorithms[HawkAlgorithms.length-1]);
    });

    it("should be possible to change the credentials", function () {
        var settings = HawkConfiguration.getSettings();
        expect(settings.credentials.id).toBeUndefined();
        expect(settings.credentials.key).toBeUndefined();
        HawkConfiguration.setCredentials("id1", "secret1");
        settings = HawkConfiguration.getSettings();
        expect(settings.credentials.id).toEqual("id1");
        expect(settings.credentials.secret).toEqual("secret1");
        HawkConfiguration.setCredentials("id2", "secret2");
        settings = HawkConfiguration.getSettings();
        expect(settings.credentials.id).toEqual("id2");
        expect(settings.credentials.secret).toEqual("secret2");

    });
});