'use strict';

var cartServices = angular.module('cartApp.services', []);

cartServices.service('PriceBooks', ['$http', function ($http) {

    return {
        getAllPriceBooks : function () {
            return $http.get('/content/pricebooks.json');
        }
    };
}]);

cartServices.service('Products', ['$http', function ($http) {

    return {

        getProducts: function (pricebook) {
            var validPriceBooks = [1, 2, 3];
            pricebook = parseInt(pricebook, 10);
            var file = (validPriceBooks.indexOf(pricebook) !== -1) ? 'products-' + pricebook : 'empty'
            
            return $http.get('/content/' + file + '.json');
        }

    };
}]);

cartServices.factory('Cart', ['$http', function ($http) {

    var lineItems = [];
    var priceBook = {};
    var theFactory = {};

    theFactory.setPriceBook = function (pb) {
        priceBook = pb;
    };

    theFactory.getPriceBook = function () {
        return priceBook;
    };

    theFactory.getLineItems = function () {
        return lineItems;
    };

    theFactory.addLineItem = function (lineItem) {
        var productId = lineItem.Product.id;
        var index;

        for (var i = 0; i < lineItems.length; i++) {
            if (lineItems[i].Product.id === productId) {
                index = i;
                break;
            }
        }

        if (index === 0 || index > 0) {
            lineItems[index].Quantity++;
        } else {
            lineItems.push(lineItem);
        }

    };

    theFactory.removeLineItem = function (productId) {
        var index;

        for (var i = 0; i < lineItems.length; i++) {
            if (lineItems[i].Product.id === productId) {
                index = i;
                break;
            }
        }

        if (index < 0 || index > lineItems.length) {
            return;
        }

        lineItems.splice(index, 1);
    };

    theFactory.isProductInCart = function (id) {
        for (var i = 0; i < lineItems.length; i++) {
            if (lineItems[i].Product.id === id) {
                return true;
            }
        }
        return false;
    };

    theFactory.getTotalNumberOfItems = function () {
        return lineItems.length;
    };

    theFactory.getCartValue = function () {
        var total = 0;

        for (var i = 0; i < lineItems.length; i++) {
            total += lineItems[i].Product.price * lineItems[i].Quantity * (1 - (lineItems[i].Discount) / 100);
        }

        return total;
    };

    theFactory.clearCart = function () {
        lineItems = [];
        priceBook = {};
    };

    return theFactory;
}]);
