var DRIVER = {
    $rootDiv: null,

    loadPage: function () {
        $.ajax({
            type: 'GET',
            url: PARAM.host + "/drivers",
            dataType: 'json',
            success: function (data) {
                var driverdata = {};
                driverdata.drivers = data.content;

                $.get("pages/driver/template/driver.html", function (template) {
                    $("#panel-body").html(Mustache.render(template, driverdata));
                    DRIVER.$rootDiv = $("#driver_page");
                    DRIVER.bindEvent();
                });
            }
        });
    },

    bindEvent: function () {
        $btnNewDriver = DRIVER.$rootDiv.find('button[name="btn-newDriver"]');
        $modalNewDriver = DRIVER.$rootDiv.find('div[name="new_driver"]');
        $btnNewDriver.off().on("click", function (event) {
            $modalNewDriver.modal("show");
        });

        $modalNewDriver.find('button[name="submit_new_driver"]').off().on("click", function (event) {
            $inputDriverName = $modalNewDriver.find('input[name="driver_name"]');
            if ($inputDriverName) {
                var newName = $inputDriverName.val();
                var newDriver = {
                    name: newName
                };

                $.ajax({
                    type: 'POST',
                    url: PARAM.host + "/driver",
                    data: JSON.stringify(newDriver),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        $modalNewDriver.modal("hide").one("hidden.bs.modal", function () {
                            DRIVER.loadPage();
                        });
                    },
                    error: function (data) {}
                });
            }
        });
    }
}