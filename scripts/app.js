'use strict';

var cartApp = angular.module('cartApp', ['ngRoute', 'cartApp.controllers', 'cartApp.services']);

cartApp.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/pricebooks', {
        templateUrl: '/partials/price-book.html',
        controller: 'priceBookController'
    }).when('/pricebooks/:pbId/products', {
        templateUrl: '/partials/product-list.html',
        controller: 'productListController'
    }).when('/pricebooks/:pbId/products/:id', {
        templateUrl: '/partials/product-details.html',
        controller: 'productDetailController'
    }).when('/cart', {
        templateUrl: '/partials/cart.html',
        controller: 'cartListController'
    }).otherwise({
        redirectTo: '/pricebooks'
    });

}]);