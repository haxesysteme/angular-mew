describe("angular-mew", function(){
    beforeEach(module('angular-mew'));
    it("should exist as a module", function(){
       var mod = angular.module("angular-mew");
        expect(mod).toBeDefined();
    });
});