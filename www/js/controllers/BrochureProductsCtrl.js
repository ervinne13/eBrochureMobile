var BrochureProductsCtrl = function ($scope, $stateParams, BrochureCategoriesSrvc, BrochureProductsSrvc, LocalStorage) {

    var categoryId = $stateParams.categoryId;

    $scope.server = LocalStorage.get('SERVER');
    $scope.category = BrochureCategoriesSrvc.get($stateParams.categoryId);

    function loadProducts() {
        BrochureProductsSrvc.all(categoryId)
                .then(function (products) {
                    $scope.products = products;
                    console.log(products);
                })
                .catch(function (response) {
                    console.log(response);
                });
    }

    loadProducts();

};