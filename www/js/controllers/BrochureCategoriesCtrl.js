var BrochureCategoriesCtrl = function ($scope, $ionicPopup, $state, BrochureCategoriesSrvc) {

    $scope.loadCategories = function () {
        try {
            BrochureCategoriesSrvc.all()
                    .then(function (categories) {
                        $scope.categories = categories;
                        console.log(categories);
                    })
                    .catch(function (response) {
                        console.log(response);
                    });
        } catch (e) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: e.message
            });

            alertPopup.then(function (res) {
                if (e.message == "Server not set") {
                    console.log('will navigate to account');
                    $state.go('tab.account');
                }
            });

        }
    };

    $scope.loadCategories();

};