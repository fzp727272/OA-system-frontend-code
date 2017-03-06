var LOADING = {
    defaultPageSize: 20,

    loadPage: function () {
        $("#page-body").find('.panel-body').eq(0).html('').load("pages/loading/html/loading.html",
            function () {
                $.ajax({
                    type: 'GET',
                    url: PARAM.host + "/loadings",
                    data: {
                        page: 1,
                        size: LOADING.defaultPageSize
                    },
                    dateType: "json",
                    success: function (data) {
                        if (data.content) {
                            var loadings = data.content.content;
                            PAGINATION.setPagination($("#pagination-bar"), data.content.totalPages, 1, LOADING.navigateToPage)
                            LOADING.initItems(loadings);
                            LOADING.bindEvent();
                        }
                    }
                });
            });
    },

    navigateToPage: function (pageNumber) {
        $.ajax({
            type: 'GET',
            url: PARAM.host + "/loadings",
            data: {
                page: pageNumber,
                size: LOADING.defaultPageSize
            },
            dateType: "json",
            success: function (data) {
                if (data.content) {
                    var loadings = data.content.content;
                    LOADING.initItems(loadings);
                    LOADING.bindEvent();
                }
            }
        });
    },

    initItems: function (currentLoadings) {
        var result = "";

        $.each(currentLoadings, function (index, value) {
            var tmp = '<tr>\
                            <td>' + value.loadingDisplayId + '</td>\
                            <td>' + value.direction + '</td>\
                            <td>' + moment(value.sendDate).format("YYYY-MM-DD") + '</td>\
                            <td>' + value.driverName + '</td>\
                            <td class="button-place">\
                                <button type="button" name="viewdetail" style="margin-right:5px;" class="btn btn-default form-operate" value="' + value.id + '">\
                                    <i class="fa fa-eye"></i> 查看详情\
                                </button>\
                            </td>\
                        </tr>';

            result = result + tmp;
        })

        $("#loadingsContainer").html(result);
        if (!USER.isSALESMAN()) {
            $('button[name="btn-newloading"]').hide();  
        }
        $("#loadingsContainer").find("button[name='viewdetail']").off().on("click", function (event) {
            var currentLoadingId = $(event.currentTarget).val();
            LOADINGDETAIL.currentLoadingId = currentLoadingId;
            LOADINGDETAIL.loadPage();
        });
    },

    initNewLoading: function () {
        var today = new Date();
        var todayyear = today.getFullYear();
        var todaymonth = today.getMonth() + 1;
        var todayday = today.getDay();
        var startdate = todayyear + '-' + todaymonth + '-' + todayday;
        $("#newloading").find(".form_datetime").datetimepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            todayBtn: true,
            startDate: startdate,
            minuteStep: 0,
            minView: 'month',
            pickerPosition: "bottom-left"
        });

        MASTERDATA.getDriverList(function (aList) {
            var template = '<option value="{driver_id}">{driver_name}</option>';
            var result = "";

            $.each(aList, function (index, value) {
                var temp = template.replace("{driver_id}", value.id).replace("{driver_name}", value.name);
                result = result + temp;
            });

            $("#newloading").find(".selectpicker").html(result);
            $("#newloading").find(".selectpicker").selectpicker('refresh');
        });
    },

    bindEvent: function () {
        $("button[name='btn-newloading']").off().on("click", function () {
            $("#newloading").modal("show");
            LOADING.initNewLoading();
        });

        $("#newloading").find("button[name='submitNewLoading']").off().on("click", function () {
            var newloading = {};

            newloading.sendDate = $("#newloading").find("input[name='loadingSendDate']").val();
            newloading.driverId = $("#newloading").find("select[name='loadingDriver']").val();
            newloading.direction = $("#newloading").find("input[name='loadingDestination']").val();

            $.ajax({
                type: 'POST',
                url: PARAM.host + "/loading",
                data: JSON.stringify(newloading),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    $("#newloading").modal("hide").one("hidden.bs.modal", function(event) {
                       LOADING.loadPage(); 
                    });
                },
                error: function (data) {}
            });
        })
    }
};