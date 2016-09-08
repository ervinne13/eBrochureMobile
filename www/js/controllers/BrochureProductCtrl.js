var BrochureProductCtrl = function ($scope, $stateParams, $ionicPopup, $ionicHistory, BrochureProductsSrvc, SalesOrdersSrvc, LocalStorage) {

    var categoryId = $stateParams.categoryId;
    var productId = $stateParams.productId;

    $scope.orderQty = 1;
    $scope.server = LocalStorage.get('SERVER');
    $scope.showAddToCartOptions = function () {

        $ionicPopup.show({
            title: 'New Order',
            subTitle: 'How many will you order?',
            template: '<input type="number" ng-model="orderQty">',
            scope: $scope,
            buttons: [
                {text: 'Cancel'},
                {
                    text: '<b>Order</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.orderQty) {
                            //don't allow the user to close unless he enters qty
                            e.preventDefault();
                        } else {
                            $scope.addSalesOrder($scope.orderQty);
                            $ionicHistory.goBack();
                        }
                    }
                }
            ]
        });

    };

    $scope.addSalesOrder = function (qty) {
        SalesOrdersSrvc.addSalesOrder($scope.product, qty)

                ;
    };

    BrochureProductsSrvc.get(productId)
            .then(function (product) {
                $scope.product = product;
                console.log($scope.product);
            }, function (err) {
                console.error(err);
            });

};