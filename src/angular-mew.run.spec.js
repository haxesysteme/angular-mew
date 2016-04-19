describe("angular-mew", function(){
    describe("when Hawk isn't defined on the window", function() {
        it("should throw an error when Hawk isn't available", function () {
            expect(function () {
                module('angular-mew', function ($provide) {
                    $provide.constant('Hawk', null);
                });
                inject(function ($rootScope) {
                    $rootScope.$apply();
                });
            }).toThrow("Hawk library isn't available");
        });
    });
});