angular.module('angularPromiseButtons', [
]);

angular.module('angularPromiseButtons').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('promise-btn-d.html',
    "<button ng-transclude></button>"
  );

}]);

angular.module('angularPromiseButtons')
    .directive('promiseBtn', ['angularPromiseButtons', function (angularPromiseButtons)
    {
        'use strict';

        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {
                promiseBtn: '=',
                text:'@',
                promiseBtnSuccess:'@',
                promiseBtnError:'@',
                promiseBtnLoading:'@'
            },
            templateUrl: 'promise-btn-d.html',
            link: function (scope, el)
            {
                var cfg = angularPromiseButtons.config;

                var changeText = function(str){
                    if(str){
                        el.html('<span>'+str+'</span>');
                        el.append(cfg.spinnerTpl);
                    }
                };


                el.append(cfg.spinnerTpl);

                scope._baseHtml = el.html();

                var loading = function (pm)
                    {
                        el.removeClass(cfg.errorClass);
                        el.removeClass(cfg.successClass);

                        if(scope.promiseBtnLoading){
                            changeText(scope.promiseBtnLoading);
                        }else{
                            el.html(scope._baseHtml);
                        }

                        if (cfg.btnLoadingClass) {
                            el.addClass(cfg.btnLoadingClass);
                        }
                        if (cfg.disableBtn) {
                            el.attr('disabled', 'disabled');
                        }

                        pm.then(function(){
                            el.addClass(cfg.successClass);
                            el.removeClass(cfg.errorClass);
                            changeText(scope.promiseBtnSuccess);
                        }).catch(function(){
                            el.addClass(cfg.errorClass);
                            el.removeClass(cfg.successClass);
                            changeText(scope.promiseBtnError);
                        });

                    },
                    loadingFinished = function ()
                    {
                        if (cfg.btnLoadingClass) {
                            el.removeClass(cfg.btnLoadingClass);
                        }
                        if (cfg.disableBtn) {
                            el.removeAttr('disabled');
                        }
                    };

                scope.$watch(function ()
                {
                    return scope.promiseBtn;
                }, function (mVal)
                {
                    if (mVal && mVal.then) {
                        loading(mVal);
                        mVal.finally(loadingFinished);
                    }
                });
            }
        };
    }]);

angular.module('angularPromiseButtons')
    .provider('angularPromiseButtons', function angularPromiseButtonsProvider()
    {
        'use strict';

        // *****************
        // DEFAULTS & CONFIG
        // *****************

        var config = {
            spinnerTpl: '<span class="btn-spinner"></span>',
            disableBtn: true,
            btnLoadingClass: 'is-loading',
            btnLoadedClass:'loaded',
            successClass:'success',
            errorClass:'error'
        };


        // *****************
        // SERVICE-FUNCTIONS
        // *****************


        // *************************
        // PROVIDER-CONFIG-FUNCTIONS
        // *************************

        return {
            extendConfig: function (newConfig)
            {
                config = angular.extend(config, newConfig);
            },


            // ************************************************
            // ACTUAL FACTORY FUNCTION - used by the directive
            // ************************************************

            $get: function ()
            {
                return {
                    config: config
                };
            }
        };
    });
