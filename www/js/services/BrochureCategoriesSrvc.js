var BrochureCategoriesSrvc = function ($http, $q, LocalStorage, SQLiteDataAccessSrvc) {

    var cache = [];

    function getById(id) {
        for (var i in cache) {
            if (cache[i].id == id) {
                return cache[i];
            }
        }
    }

    function  loadAll() {
        var server = LocalStorage.get('SERVER');
        if (!server) {
            throw new Error("Server not set");
        }

        var q = $q.defer();

        $http({
            method: 'GET',
            url: server + "/api/categories"
        })
                .then(function (response) {
                    if (response && response.data) {
                        cache = response.data;

                        SQLiteDataAccessSrvc.insertOrReplaceInTx('categories', response.data, {
                            success: function (result) {
                                console.log(result);
                                q.resolve(response.data);
                            },
                            error: function (err) {
                                console.error(err);
                                q.reject(error);
                            }
                        });

                    }
                })
                .catch(function (error) {
                    q.reject(error);
                })
                ;

        return q.promise;
    }

    return {
        get: getById,
        all: loadAll
    };
};