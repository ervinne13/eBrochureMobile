var SalesOrderCtrl = function ($scope, $ionicActionSheet, $ionicPopup, $ionicHistory, $ionicLoading, SalesOrdersSrvc) {

    var hideSheet;

    $scope.salesOrder = SalesOrdersSrvc.getCurrentSalesOrder();
    $scope.remove = function (detail) {
        $scope.salesOrder.details.splice($scope.salesOrder.details.indexOf(detail), 1);
        $scope.salesOrder.total_item_qty -= detail.qty;
        $scope.salesOrder.total_amount -= detail.sub_total;
    };
    $scope.showActions = function () {

        if ($scope.isActionsShowing) {
            hideSheet();
        } else {
            hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: 'Checkout with Paypal'}
                ],
                titleText: 'Sales Order',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {

                    switch (index) {
                        case 0:
                            checkout($scope.salesOrder);
                            break;
                    }

                    return true;
                }
            });
        }
    };

    function checkout(salesOrder) {
        if (salesOrder.total_amount <= 0) {
            $ionicPopup.alert({
                title: 'Error',
                template: "Nothing to checkout"
            });
            return;
        }

        SalesOrdersSrvc.sendSalesOrder()
                .then(function (si) {
                    $ionicLoading.hide();
                    $ionicHistory.goBack();
                }, function (e) {
                    console.error(e);
                    $ionicLoading.hide();
                })

                ;
        $ionicLoading.show({
            template: 'Please wait...'
        }).then(function () {
            console.log("The loading indicator is now displayed");
        });

    }

}
;