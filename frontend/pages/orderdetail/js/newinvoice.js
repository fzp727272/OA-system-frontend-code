var NEWINVOICE = {
    loadPage: function () {
        //only invoke by orderdetail

        NEWINVOICE.initItems();
    },

    showDialog: function () {
        NEWINVOICE.loadPage();
        $("#modal_newinvoice").modal("show");
    },

    initItems: function () {
        var templateData = {};
        templateData.items = [];

        $.each(OrderDetail.currentOrder.items, function (i, value) {
            var newItem = {};
            newItem.productName = value.productName;
            newItem.orderItemId = value.id;
            newItem.commentFromOrderItem = value.comment;
            templateData.items.push(newItem);
        });

        $.get('pages/orderdetail/template/newinvoice.html', function (template) {
            $("#makenewsendcontainer").html(Mustache.render(template, templateData));
            NEWINVOICE.bindEvent();
        });
    },

    bindEvent: function () {
        $("#modal_newinvoice").find("button[name='make']").off().on("click", function (event) {
            $.ajax({
                type: 'POST',
                url: PARAM.host + "/invoice",
                data: NEWINVOICE.generatePayload(),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    $("#modal_newinvoice").modal("hide").one('hidden.bs.modal', function (e) {
                        OrderDetail.loadPage();
                    });
                },
                error: function (err) {
                    MESSAGEBOX.generalSystemError(err);
                }
            });
        });
    },

    generatePayload: function () {
        var items = [];
        $("#modal_newinvoice").find("tbody").find("tr").each(function (index, element) {
            var packageNumber = Number($(element).find("input[name='packageNumber']").val());
            if (packageNumber >= 1) {
                var comment = $(element).find("input[name='comment']").val();
                var oneitem = {};
                oneitem.orderItemId = $(element).attr("orderItemId");
                oneitem.packageNumber = packageNumber;
                oneitem.comment = comment;
                items.push(oneitem);
            }
        });

        var result = {};
        result.items = items;
        result.orderId = OrderDetail.currentOrderId;

        return JSON.stringify(result);
    }
};