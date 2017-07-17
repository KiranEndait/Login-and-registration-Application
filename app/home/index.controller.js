(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(ProductService) {
        var vm = this;

        vm.product = null;

        initController();

        function initController() {
            // get current user
            ProductService.GetCurrent().then(function (product) {
                vm.product = product;
            });
        }
    }

})();