var SALESMAN = {
    $rootDiv: null,

    loadPage: function () {
        $.ajax({
            type: 'GET',
            url: PARAM.host + "/salesmans",
            dataType: 'json',
            success: function (data) {
                var salesmandata = {};
                salesmandata.salesman = data.content;

                $.get("pages/salesman/template/salesman.html", function (template) {
                    $("#panel-body").html(Mustache.render(template, salesmandata));
                    SALESMAN.$rootDiv = $("#salesman_page");
                    SALESMAN.bindEvent();
                });
            }
        });
    },

    bindEvent: function () {
        $btnNewSalesMan = SALESMAN.$rootDiv.find('button[name="btn-newSalesman"]');
        $modalNewSalesMan = SALESMAN.$rootDiv.find('div[name="new_salesman"]');
        $btnNewSalesMan.off().on("click", function (event) {
            $modalNewSalesMan.modal("show");
        });

        $modalNewSalesMan.find('button[name="submit_new_salesman"]').off().on("click", function (event) {
            $inputSalesManName = $modalNewSalesMan.find('input[name="salesman_name"]');
            if ($inputSalesManName) {
                var newName = $inputSalesManName.val();
                var newSalesMan = {
                    name: newName
                };

                $.ajax({
                    type: 'POST',
                    url: PARAM.host + "/salesman",
                    data: JSON.stringify(newSalesMan),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        $modalNewSalesMan.modal("hide").one("hidden.bs.modal", function () {
                            SALESMAN.loadPage();
                        });
                    },
                    error: function (data) {}
                });
            }
        });
    },
}