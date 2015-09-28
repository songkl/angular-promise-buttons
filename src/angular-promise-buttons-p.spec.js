describe('promise-buttons directive with config', function ()
{
    'use strict';

    var provider;

    beforeEach(module('angularPromiseButtons', function (angularPromiseButtonsProvider)
    {
        provider = angularPromiseButtonsProvider;
    }));

    var scope,
        $timeout,
        $rootScope,
        $compile,
        fakeFact,
        html;


    beforeEach(inject(function (_$rootScope_, _$compile_, _$timeout_, _$q_)
    {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $timeout = _$timeout_;
        var $q = _$q_;

        scope = $rootScope.$new();

        fakeFact = {
            success: function ()
            {
                var defer = $q.defer();
                $timeout(function ()
                {
                    defer.resolve();
                });
                return defer.promise;
            },
            error: function ()
            {
                var defer = $q.defer();
                $timeout(function ()
                {
                    defer.reject();
                });
                return defer.promise;
            },
            endless: function ()
            {
                var defer = $q.defer();
                return defer.promise;
            }
        };
    }));

    describe('a simple success promise on click', function ()
    {
        var element;

        beforeEach(function ()
        {
            html = '<button class="btn" ng-click="asyncCall()" promise-btn="promise">Success after delay</button>';
            scope.asyncCall = function ()
            {
                scope.promise = fakeFact.success();
            };
        });

        it('should have a customizable spinner-tpl', function ()
        {
            provider.extendConfig({
                spinnerTpl: '<span class="CLASS-SPANNER"></span>'
            });
            element = $compile(html)(scope);
            scope.$digest();

            expect(angular.element(element.find('span')[1]).hasClass('btn-spinner'))
                .toBeFalsy();
            expect(angular.element(element.find('span')[1]).hasClass('CLASS-SPANNER'))
                .toBeTruthy();

        });

        it('disabling the buttons can be deactivated', function ()
        {
            provider.extendConfig({
                disableBtn: false
            });
            element = $compile(html)(scope);
            scope.$digest();

            scope.asyncCall = function ()
            {
                scope.promise = fakeFact.error();
            };

            element.triggerHandler('click');
            scope.$digest();
            expect(element.hasClass('is-loading')).toBeTruthy();
            expect(element.attr('disabled')).toBeUndefined();
        });

        it('is-loading class can be deactivated', function ()
        {
            provider.extendConfig({
                btnLoadingClass: false
            });
            element = $compile(html)(scope);
            scope.$digest();

            scope.asyncCall = function ()
            {
                scope.promise = fakeFact.error();
            };

            element.triggerHandler('click');
            scope.$digest();
            expect(element.hasClass('is-loading')).toBeFalsy();
            expect(element.attr('disabled')).toBe('disabled');
        });

        it('has a settable loading class', function ()
        {
            var customClass = 'CUSTOM';
            provider.extendConfig({
                btnLoadingClass: customClass
            });
            element = $compile(html)(scope);
            scope.$digest();

            scope.asyncCall = function ()
            {
                scope.promise = fakeFact.error();
            };

            element.triggerHandler('click');
            scope.$digest();
            expect(element.hasClass('CUSTOM')).toBeTruthy();
        });
    });
});
