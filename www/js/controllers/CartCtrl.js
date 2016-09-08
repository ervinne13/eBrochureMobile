var CartCtrl = function ($rootScope, $scope, SalesOrdersSrvc, BrochureProductsSrvc) {

    $scope.currentSalesOrder = SalesOrdersSrvc.getCurrentSalesOrder();
    $scope.salesOrders = [];
    $scope.productsMap = {};


    $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                console.log(toState);
                $scope.currentSalesOrder = SalesOrdersSrvc.getCurrentSalesOrder();
                if (toState.name == "tab.cart") {
                    loadSalesOrders();
                }
            });

    function loadSalesOrders() {
        SalesOrdersSrvc.salesOrders()
                .then(function (salesOrders) {
                    $scope.salesOrders = [];

                    for (var i = 0; i < salesOrders.length; i++) {
                        var order = salesOrders[i];
                        if (!order) {
                            order = salesOrders.item(i);
                        }

                        if (order.id) {
                            order.doc_no = "SI-" + pad(order.id, 8);
//                            $scope.salesOrders.push(order.concat({
//                                doc_no: "SI-" + pad(order.id, 8)
//                            }));
                            $scope.salesOrders.push(order);
                        }
                    }
                    console.log($scope.salesOrders);
                }, function (err) {
                    console.error(err);
                });
    }

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    loadSalesOrders();

};