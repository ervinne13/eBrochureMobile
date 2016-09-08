var BrochureProductsSrvc = function ($http, $q, LocalStorage, $cordovaSQLite, SQLiteDataAccessSrvc) {

    var cache = [];

    function get(id) {

        var query = "SELECT * FROM products WHERE id = ?";
        var db = SQLiteDataAccessSrvc.getDatabase();

        var q = $q.defer();

        $cordovaSQLite.execute(db, query, [id])
                .then(function (result) {

                    if (result.rows.length) {
                        var product = result.rows[0];

                        if (!product) {
                            product = result.rows.item(0);
                        }
                        q.resolve(product);
                    } else {
                        q.reject("Product Not Found");
                    }
                }, function (err) {
                    q.reject(err);
                });

        return q.promise;

    }

    function adaptProductsForSaving(products) {

        var adaptedProducts = [];

        for (var i in products) {
            products[i].image_url = products[i].image.url;

            delete products[i].stock;
            delete products[i].created_at;
            delete products[i].updated_at;
            delete products[i].image;
            adaptedProducts.push(products[i]);
        }

        return adaptedProducts;

    }

    function loadAll(categoryId) {
        var server = LocalStorage.get('SERVER');
        if (!server) {
            throw new Error("Server not set");
        }

        var q = $q.defer();

        $http({
            method: 'GET',
            url: server + "/api/categories/" + categoryId + "/products"
        })
                .then(function (response) {
                    if (response && response.data) {
                        cache[categoryId] = response.data;

                        var products = adaptProductsForSaving(response.data)

                        SQLiteDataAccessSrvc.insertOrReplaceInTx('products', products, {
                            success: function (result) {
                                console.log(result);
                                q.resolve(products);
                            },
                            error: function (err) {
                                console.error(err);
                                q.reject(err);
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
        get: get,
        all: loadAll
    };


};