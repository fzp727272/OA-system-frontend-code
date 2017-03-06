var PRODUCIBLEPRODUCT = {
    $rootDiv: null,
    defaultPageSize: 500,

    loadPage: function () {
        var producibleProducts = null;
        var productCategories = null;

        var getProducibleProducts = $.ajax({
            data: {
                page: 1,
                size: PRODUCIBLEPRODUCT.defaultPageSize
            },
            type: 'GET',
            url: PARAM.host + "/producibleproduct/all",
            dataType: 'json'
        });

        var getProductCategories = getProducibleProducts.then(function (data) {
            producibleProducts = data.content.content;
            return $.ajax({
                type: 'GET',
                url: PARAM.host + "/productCategories",
                dataType: 'json'
            });
        });

        var getTemplate = getProductCategories.then(function (data) {
            productCategories = data.content;
            return $.ajax({
                type: 'GET',
                url: '/pages/producibleproduct/template/producibleproduct.html'
            });
        });

        getTemplate.done(function (template) {
            var producibleProductData = {};
            producibleProductData.producibleProducts = producibleProducts;
            producibleProductData.productCategories = productCategories;
            $("#panel-body").html(Mustache.render(template, producibleProductData));
            PRODUCIBLEPRODUCT.$rootDiv = $("#producibleproduct_page");
            PRODUCIBLEPRODUCT.bindEvent();
        });
    },

    bindEvent: function () {
        $btnNewProducibleProduct = PRODUCIBLEPRODUCT.$rootDiv.find('button[name="btn-newProducibleProduct"]');
        $modalNewProducibleProduct = PRODUCIBLEPRODUCT.$rootDiv.find('div[name="new_producibleProduct"]');
        $btnNewProducibleProduct.off().on("click", function (event) {
            $modalNewProducibleProduct.modal("show");
        });

        $modalNewProducibleProduct.find(".selectpicker").selectpicker();

        $modalNewProducibleProduct.find('button[name="submit_new_producibleProduct"]').off().on("click", function (event) {
            $inputProducibleProductName = $modalNewProducibleProduct.find('input[name="producibleProductName"]');
            $selectProductCategory = $modalNewProducibleProduct.find('select[name="productCategory"]');
            if ($inputProducibleProductName && $selectProductCategory) {
                var newName = $inputProducibleProductName.val();
                var productCategoryId = $selectProductCategory.find('option:selected').val();
                var newProducibleProduct = {
                    name: newName,
                    categoryId: productCategoryId
                };

                $.ajax({
                    type: 'POST',
                    url: PARAM.host + "/producibleproduct",
                    data: JSON.stringify(newProducibleProduct),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        $modalNewProducibleProduct.modal("hide").one("hidden.bs.modal", function () {
                            PRODUCIBLEPRODUCT.loadPage();
                        });
                    },
                    error: function (data) {
                        MESSAGEBOX.generalSystemError("出错");
                    }
                });
            }
        });
    }
}