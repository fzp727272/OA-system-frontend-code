var PRODUCTCLASS = {
    loadPage: function () {
        $.ajax({
            type: 'GET',
            url: PARAM.host + "/productCategories",
            dataType: "json",
            success: function (data) {
                if (data.content) {
                    $.get("pages/productclass/template/productclass.html", function (template) {
                        $("#panel-body").html(Mustache.render(template, {categories: data.content}));
                    });
                }
            },
            error: function (err) {
                MESSAGEBOX.generalSystemError(err);
            }
        });
    }
}