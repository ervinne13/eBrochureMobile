
var SalesOrdersSrvc = function ($http, $q, $cordovaSQLite, SQLiteDataAccessSrvc, LocalStorage) {

    this.currentSalesOrder = null;

    this.getCurrentSalesOrder = function () {
        if (!this.currentSalesOrder) {
            this.createCurrentSalesOrder();
        }

        return this.currentSalesOrder;
    };

    this.createCurrentSalesOrder = function () {
        this.currentSalesOrder = {
            id: 0,
            total_item_qty: 0,
            total_amount: 0,
            discount: 0,
            status: "Open",
            customer_email: LocalStorage.get('EMAIL', ''),
            customer_name: LocalStorage.get('NAME', ''),
            customer_contact: LocalStorage.get('CONTACT', ''),
            customer_address: LocalStorage.get('ADDRESS', ''),
            details: []
        };
    };

    this.createOrUpdateCurrentSalesOrder = function (product, qty) {

        if (!this.currentSalesOrder) {
            this.createCurrentSalesOrder();
        }

        this.currentSalesOrder.total_item_qty += qty;
        this.currentSalesOrder.total_amount += qty * product.price;

    };

    this.addSalesOrderDetail = function (product, qty) {

        this.currentSalesOrder.details.push({
            composite_id: "0_" + product.id, //  sales_order_id_product_id
            sales_invoice_id: 0,
            product_id: product.id,
            qty: qty,
            sub_total: qty * product.price,
            product: product
        });

    };

    this.addSalesOrder = function (product, qty) {

        this.createOrUpdateCurrentSalesOrder(product, qty);
        this.addSalesOrderDetail(product, qty);

        console.log(this.currentSalesOrder);

    };

    this.updateSalesOrders = function() {
        //  TODO
    };

    this.salesOrders = function () {

        var query = "SELECT * FROM sales_invoices LIMIT 10";
        var db = SQLiteDataAccessSrvc.getDatabase();

        var q = $q.defer();

        $cordovaSQLite.execute(db, query, [])
                .then(function (result) {
                    if (result.rows.length) {
                        q.resolve(result.rows);
                    } else {
                        q.reject("Product Not Found");
                    }
                }, function (err) {
                    q.reject(err);
                });

        return q.promise;
    };

    this.sendSalesOrder = function () {
        var server = LocalStorage.get('SERVER');
        if (!server) {
            throw new Error("Server not set");
        }

        var q = $q.defer();
        var salesOrder = this.getCurrentSalesOrder();
        var _this = this;

        $http({
            method: 'POST',
            data: salesOrder,
            headers: {'Content-Type': 'application/json'},
            url: server + "/api/si"
        })
                .then(function (response) {
                    if (response && response.data) {
                        console.log(response.data);
                        var si = response.data;
                        var siDetails = si.details;

                        delete si.details;
                        delete si.customer_email;
                        delete si.customer_name;
                        delete si.customer_contact;
                        delete si.customer_address;
                        delete si.created_at;
                        delete si.updated_at;

                        for (var i in siDetails) {
                            delete siDetails[i].created_at;
                            delete siDetails[i].updated_at;
                            delete siDetails[i].id;
                        }

                        SQLiteDataAccessSrvc.insertOrReplace('sales_invoices', si)
                                .then(function (result) {
                                    console.log(result);
                                    SQLiteDataAccessSrvc.insertOrReplaceInTx('sales_invoice_details', siDetails, {
                                        success: function (result) {
                                            console.log(result);
                                            //  clear sales order
                                            _this.createCurrentSalesOrder();

                                            q.resolve(si);
                                        },
                                        error: function (err) {
                                            console.error(err);
                                            q.reject(err);
                                        }
                                    });
                                }, function (err) {
                                    console.error(err);
                                    q.reject(err);
                                })
                                ;
                    }
                })
                .catch(function (error) {
                    q.reject(error);
                })
                ;

        return q.promise;
    };

};
