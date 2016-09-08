
var AccountCtrl = function ($scope, $ionicActionSheet, LocalStorage) {

    var hideSheet;

    $scope.isActionsShowing = false;
    $scope.settings = {
        enableFriends: true,
        server: LocalStorage.get('SERVER', ''),
        email: LocalStorage.get('EMAIL', ''),
        name: LocalStorage.get('NAME', ''),
        contact: LocalStorage.get('CONTACT', ''),
        address: LocalStorage.get('ADDRESS', ''),
        server_error: "cannot connect to server"
    };

    function save() {
        LocalStorage.set('SERVER', $scope.settings.server);
        LocalStorage.set('EMAIL', $scope.settings.email);
        LocalStorage.set('NAME', $scope.settings.name);
        LocalStorage.set('CONTACT', $scope.settings.contact);
        LocalStorage.set('ADDRESS', $scope.settings.address);
    }

    $scope.showActions = function () {

        if ($scope.isActionsShowing) {
            hideSheet();
        } else {
            hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: 'Save'},
                    {text: 'Register'},
                    {text: 'Existing User? Login'}
                ],
                destructiveText: 'Clear Account Details',
                titleText: 'Account Actions',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    console.log(index);

                    switch (index) {
                        case 0:
                            save();
                            break;
                    }

                    return true;
                },
                destructiveButtonClicked: function () {

                    return true;
                }
            });
        }

    };

};
