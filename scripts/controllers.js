'use strict';

var controllers = angular.module('cartApp.controllers', ['cartApp.services']);

controllers.controller('productListController', ['$scope', '$routeParams', '$location', 'Products', 'Cart', function ($scope, $routeParams, $location, Products, Cart) {
    var pbId = $routeParams.pbId;

    Products.getProducts(pbId).success(function (result) {
        var products = result;
        for (var i = 0; i < products.length; i++) {
            products[i].inCart = Cart.isProductInCart(products[i].id);
        }
        $scope.products = products;
    });

    $scope.productDetails = function (productId) {
        $location.path('/pricebooks/' + pbId + '/products/' + productId);
    }

    //$scope.priceBook = Quote.getPriceBook();

    $scope.totalItems = Cart.getTotalNumberOfItems();

    //$scope.disableCart = ($scope.totalItems === 0);

    $scope.purchasedTotal = Cart.getCartValue();

    $scope.addToCart = function (product) {
        product.inCart = true;
        Cart.addLineItem({ 'Product': product, 'Quantity': 1, 'Discount': 0, 'PriceBook': pbId });
        $scope.totalItems = Cart.getTotalNumberOfItems();
        $scope.purchasedTotal = Cart.getCartValue();
    };

    $scope.removeFromCart = function (product) {
        product.inCart = false;
        Cart.removeLineItem(product.id);
        $scope.totalItems = Cart.getTotalNumberOfItems();
        $scope.purchasedTotal = Cart.getCartValue();
    };

    $scope.goToCart = function () {
        if ($scope.totalItems === 0) {
            return;
        }
        Cart.setPriceBook(pbId);
        $location.path('/cart');
    };
}]);

controllers.controller('cartListController', ['$scope', '$location', 'Cart', 'PriceBooks', function ($scope, $location, Cart, PriceBooks) {

    $scope.total = Cart.getCartValue();
    $scope.lineItems = Cart.getLineItems();
    $scope.priceBook = Cart.getPriceBook();
    $scope.numberOfItems = 0;

    updateTotalItems(); 

    function updateTotalItems() {
        var numItems = 0;
        for (var i = 0; i < $scope.lineItems.length; i++) {
            numItems += $scope.lineItems[i].Quantity;
        }
        $scope.numberOfItems = numItems;
    }

    $scope.updateTotal = function () {

        $scope.total = Cart.getCartValue();
        updateTotalItems();

    };

    $scope.removeFromCart = function (line) {

        Cart.removeLineItem(line.Product.ProductId);
        $scope.total = Cart.getCartValue();
        $scope.lineItems = Cart.getLineItems();
        updateTotalItems();

    };

    $scope.submitOrder = function () {
        $scope.disableSubmit = true;
        $scope.submitMsg = "Order submitted successfuly";
        $scope.submitSuccess = true;

        Cart.clearCart();
        setTimeout(function () { $location.path('/pricebooks'); }, 2000);
    };

}]);

controllers.controller('priceBookController', ['$scope', '$location', 'PriceBooks', function ($scope, $location, PriceBooks) {

    PriceBooks.getAllPriceBooks().success(function (result) {
        $scope.pricebooks = result;
        $scope.selectedPriceBook = null;
    });

    $scope.selectPriceBook = function () {
        $location.path('/pricebooks/' + $scope.selectedPriceBook.id + '/products');
    };
}]);

controllers.controller('productDetailController', ['$scope', '$routeParams', 'Products', function ($scope, $routeParams, Products) {
    var pbId = $routeParams.pbId;
    var productId = $routeParams.id;

    Products.getProducts(pbId).success(function (result) {
        for (var i = 0; i < result.length; i++) {
            if (result[i].id == productId) {
                $scope.product = result[i];
                break;
            }
        }
    });
}]);