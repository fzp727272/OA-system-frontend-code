var NEWORDERWIZARD = {
    customerInfo: null,
    currentOrder: null,
    showspeed: {
        showtime: 300,
        hidetime: 400
    },
    $newOrderWizardBody: null,
    $divStep1: null,
    $divStep2: null,
    $divStep3: null,
    $divStep4: null,

    clearprogressBar: function() {
        $newOrderWizardBody.find(".progress-line").attr({
            value: 0
        });
        $newOrderWizardBody.find(".progress-point").removeClass('progress-point-active').eq(0).addClass('progress-point-active');
    },

    progressBarNext: function() {
        var nextStep = $newOrderWizardBody.find(".progress-point-active").length + 1;
        NEWORDERWIZARD.progressBarMove(nextStep);
    },

    progressBarPrev: function() {
        var nextStep = $newOrderWizardBody.find(".progress-point-active").length - 1;
        NEWORDERWIZARD.progressBarMove(nextStep);
    },

    progressBarMove: function(nextStep) {
        var progressvalue = 0 + 33.33333 * (nextStep - 1)
        $newOrderWizardBody.find(".progress-line").attr({
            value: progressvalue
        });

        $newOrderWizardBody.find(".progress-point").each(function(index, el) {
            if (index > nextStep - 1) {
                $(this).removeClass('progress-point-active');
            } else {
                $(this).addClass('progress-point-active');
            }
        });
    },

    loadWizard: function() {
        $("#newOrderWizardBody").load("pages/progress/html/NewOrderWizard.html", function() {
            CUSTOMERSELECT.setSelect($("#NOW_curstomer_select"), null);
            NEWORDERWIZARD.initCurrentOrder();
            NEWORDERWIZARD.bindEvent();
            NEWORDERWIZARD.$newOrderWizardBody = $("#newOrderWizardBody");
            NEWORDERWIZARD.$divStep1 = NEWORDERWIZARD.$newOrderWizardBody.find("#DIV_NOW_STEP1");
            NEWORDERWIZARD.$divStep2 = NEWORDERWIZARD.$newOrderWizardBody.find("#DIV_NOW_STEP2");
            NEWORDERWIZARD.$divStep3 = NEWORDERWIZARD.$newOrderWizardBody.find("#DIV_NOW_STEP3");
            NEWORDERWIZARD.$divStep4 = NEWORDERWIZARD.$newOrderWizardBody.find("#DIV_NOW_STEP4");
        })
    },

    initCurrentOrder: function() {
        NEWORDERWIZARD.currentOrder = {};
        NEWORDERWIZARD.currentOrder.customerId = -1;
        NEWORDERWIZARD.currentOrder.items = [];
        NEWORDERWIZARD.currentOrder.comment = "";
    },

    showWizard: function() {
        NEWORDERWIZARD.initCurrentOrder();
        NEWORDERWIZARD.resetWizard();
        NEWORDERWIZARD.clearprogressBar();
        $("#newOrderWizardModal").modal('show');
    },

    closeWizard: function() {
        $("#newOrderWizardModal").modal('hide');

    },

    resetWizard: function() {
        NEWORDERWIZARD.$divStep1.show();
        NEWORDERWIZARD.$divStep2.hide();
        NEWORDERWIZARD.$divStep3.hide();
        NEWORDERWIZARD.$divStep4.hide();
    },

    btnStep1Next: function() {
        NEWORDERWIZARD.progressBarNext();
        var selectedCustomerId = $("#newOrderWizardBody").find("#NOW_curstomer_select").find("option:selected").val();
        $.ajax({
            type: 'GET',
            url: PARAM.host + "/customer/" + selectedCustomerId,
            data: {
                withProducts: "true"
            },
            dataType: "json",
            success: function(data) {
                NEWORDERWIZARD.customerInfo = data.content;
                NEWORDERWIZARD.initCurrentOrder();
                NEWORDERWIZARD.currentOrder.customerId = NEWORDERWIZARD.customerInfo.id;
                NEWORDERWIZARD.$divStep1.fadeOut(NEWORDERWIZARD.showspeed.hidetime);
                NEWORDERWIZARD.step2RefreshOrderItems();
                NEWORDERWIZARD.$divStep2.delay(NEWORDERWIZARD.showspeed.hidetime).fadeIn(NEWORDERWIZARD.showspeed.showtime);
            },
            error: function(err) {
                console.dir(err);
            }
        });
    },

    step4RefreshItems: function() {
        var template = ' <tr>\
                                <td>{productName}</td>\
                                <td>{productUnit}</td>\
                                <td>{productNumber}</td>\
                                <td>{productPackageSize}</td>\
                                <td>{productPackageNumber}</td>\
                                <td>{productDeliverTime}</td>\
                                <td>{productComment}</td>\
                            </tr>';

        var result = "";
        $.each(NEWORDERWIZARD.currentOrder.items, function(index, value) {
            var tmp = template.replace("{productName}", value.productName)
                .replace("{productUnit}", value.productUnit)
                .replace("{productNumber}", value.productNumber)
                .replace("{productPackageSize}", value.packageSize)
                .replace("{productPackageNumber}", value.packageNumber)
                .replace("{productDeliverTime}", value.deliveryDate)
                .replace("{productComment}", value.comment)

            result = result + tmp;
        });

        NEWORDERWIZARD.$divStep4.find("tbody").html(result);
        NEWORDERWIZARD.$divStep4.find("#SPAN_NOW_STEP4_CUSTOMER").html(NEWORDERWIZARD.customerInfo.name);
        NEWORDERWIZARD.$divStep4.find("#SPAN_NOW_STEP4_COMMENT").html(NEWORDERWIZARD.currentOrder.comment);
    },

    step2RefreshOrderItems: function() {
        var template = ' <tr>\
                                <td>{productName}</td>\
                                <td>{productUnit}</td>\
                                <td>{productNumber}</td>\
                                <td>{productPackageSize}</td>\
                                <td>{productPackageNumber}</td>\
                                <td>{productDeliverTime}</td>\
                                <td>{productComment}</td>\
                                <td><button value="{productId}" class="btn btn-default" style="margin-left:5px"><i class="fa fa-times"></i></button></td>\
                            </tr>';

        var result = "";
        $.each(NEWORDERWIZARD.currentOrder.items, function(index, value) {
            var tmp = template.replace("{productName}", value.productName)
                .replace("{productUnit}", value.productUnit)
                .replace("{productNumber}", value.productNumber)
                .replace("{productPackageSize}", value.packageSize)
                .replace("{productPackageNumber}", value.packageNumber)
                .replace("{productDeliverTime}", value.deliveryDate)
                .replace("{productComment}", value.comment)
                .replace("{productId}", value.productId);

            result = result + tmp;
        });

        $("#newOrderWizardBody").find("#DIV_NOW_STEP2").find("tbody").html(result);
        $("#newOrderWizardBody").find("#DIV_NOW_STEP2").find("tbody").find("button").off().on("click", function(event) {
            var productIdToDelete = Number($(event.currentTarget).val());
            NEWORDERWIZARD.currentOrder.items = NEWORDERWIZARD.currentOrder.items.filter(function(value) {
                return value.productId != productIdToDelete;
            });

            NEWORDERWIZARD.step2RefreshOrderItems();
        });
    },

    btnStep2Prev: function() {
        NEWORDERWIZARD.$divStep2.fadeOut(NEWORDERWIZARD.showspeed.hidetime);
        NEWORDERWIZARD.progressBarPrev();
        NEWORDERWIZARD.$divStep1.delay(NEWORDERWIZARD.showspeed.hidetime).fadeIn(NEWORDERWIZARD.showspeed.showtime);
    },

    btnStep2Next: function() {
        NEWORDERWIZARD.progressBarNext();
        NEWORDERWIZARD.$divStep2.fadeOut(NEWORDERWIZARD.showspeed.hidetime);
        $newOrderWizardBody.find("#TA_NOW_ORDER_COMMENT").val(NEWORDERWIZARD.currentOrder.comment);
        NEWORDERWIZARD.$divStep3.delay(NEWORDERWIZARD.showspeed.hidetime).fadeIn(NEWORDERWIZARD.showspeed.showtime);
    },

    btnStep3Next: function() {
        NEWORDERWIZARD.progressBarNext();
        NEWORDERWIZARD.$divStep3.fadeOut(NEWORDERWIZARD.showspeed.hidetime);
        NEWORDERWIZARD.currentOrder.comment = $("#newOrderWizardBody").find("#TA_NOW_ORDER_COMMENT").val();
        NEWORDERWIZARD.step4RefreshItems();
        NEWORDERWIZARD.$divStep4.delay(NEWORDERWIZARD.showspeed.hidetime).fadeIn(NEWORDERWIZARD.showspeed.showtime);
    },

    btnStep3Prev: function() {
        NEWORDERWIZARD.progressBarPrev();
        NEWORDERWIZARD.$divStep3.fadeOut(NEWORDERWIZARD.showspeed.hidetime);
        NEWORDERWIZARD.$divStep2.delay(NEWORDERWIZARD.showspeed.hidetime).fadeIn(NEWORDERWIZARD.showspeed.showtime);
    },

    btnStep4Complete: function() {
        //NEWORDERWIZARD.progressBarNext();
        $.ajax({
            type: 'POST',
            url: PARAM.host + "/order",
            data: JSON.stringify(NEWORDERWIZARD.currentOrder),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                NEWORDERWIZARD.closeWizard();
            },
            error: function(data) {}
        });
    },

    btnStep4Prev: function() {
        NEWORDERWIZARD.progressBarPrev();
        NEWORDERWIZARD.$divStep4.fadeOut(NEWORDERWIZARD.showspeed.hidetime);
        NEWORDERWIZARD.$divStep3.delay(NEWORDERWIZARD.showspeed.hidetime).fadeIn(NEWORDERWIZARD.showspeed.showtime);
    },

    btnAddProduct: function() {
        $(document).off('focusin.bs.modal');

        var d1 = dialog({
            width: 460,
            id: "d-now-add-addProductInfo",
            title: '编辑产品',
            okValue: '完成',
            align: 'right',
            cancelValue: '取消',
            cancel: function() {
                this.close().remove();
            },
            ok: function() {
                var newProduct = {};
                newProduct.productId = Number($('#d-now-add-addProductInfo-productId').text());
                newProduct.productName = $('#d-now-add-addProductInfo-productName').text();
                newProduct.productUnit = $('#d-now-add-addProductInfo-productUnit').text();
                newProduct.packageSize = Number($('#d-now-add-addProductInfo-productPackageSize').text());
                newProduct.packageNumber = Number($('#d-now-add-addProductInfo-productPackageNumber').val());
                newProduct.comment = $('#d-now-add-addProductInfo-productComment').val();
                newProduct.deliveryDate = $('#d-now-add-addProductInfo-productDeliverDate').val();
                newProduct.productNumber = newProduct.packageSize * newProduct.packageNumber;

                NEWORDERWIZARD.currentOrder.items.push(newProduct);
                NEWORDERWIZARD.step2RefreshOrderItems();
            }
        });

        var d2 = dialog({
            width: 300,
            id: "d-now-add-selectProduct",
            title: '选择产品',
            okValue: '下一步',
            align: 'right',
            cancelValue: '取消',
            cancel: function() {
                this.close().remove();
                dialog.get("d-now-add-addProductInfo").remove();
            },
            ok: function() {
                var selectedProductId = $('input[name=productAddSelectedRadio]:checked', '#productAddSelectedRadioForm').val();
                var productPackageSize = null;
                var productUnit = null;
                var productName = null;

                $.each(NEWORDERWIZARD.customerInfo.products, function(index, value) {
                    if (value.id == selectedProductId) {
                        productName = value.name;
                        productUnit = value.unitName;
                        productPackageSize = value.packageSize;
                    }
                });

                var template = '<div class="row"><div class="col-lg-12 col-md-12">\
                                    <label id="d-now-add-addProductInfo-productId" style="display: none">{productId}</label>\
                                    <label id="d-now-add-addProductInfo-productName" style="display: none">{productName}</label>\
                                    <div class="form-group">\
                                        <label>单位:</label>\
                                        <label id="d-now-add-addProductInfo-productUnit">{productUnit}</label> \
                                    </div>\
                                      <div class="form-group">\
                                        <label>包装规格:</label>\
                                        <label id="d-now-add-addProductInfo-productPackageSize">{productPackageSize}</label>\
                                    </div>\
                                      <div class="form-group">\
                                        <label>包装数量:</label>\
                                         <input class="form-control" type="number" min="1" max="999" id="d-now-add-addProductInfo-productPackageNumber">\
                                    </div>\
                                      <div class="form-group">\
                                        <label>交货时间:</label>\
                                        <input size="16" type="text" readonly class="form_datetime form-control" id="d-now-add-addProductInfo-productDeliverDate">\
                                    </div>\
                                     <div class="form-group">\
                                        <label>备注:</label>\
                                       <textarea class="form-control" id="d-now-add-addProductInfo-productComment" rows="3"></textarea>\
                                    </div>\
                                     </div>\
                                 </div>';

                var dialogCotent = template.replace("{productName}", productName)
                    .replace("{productId}", selectedProductId)
                    .replace("{productUnit}", productUnit)
                    .replace("{productPackageSize}", productPackageSize);

                var addbutton = $("#newOrderWizardBody").find("#DIV_NOW_STEP2").find(".addproduct")[0];
                dialog.get("d-now-add-addProductInfo").content(dialogCotent);
                dialog.get("d-now-add-addProductInfo").show(addbutton);

                var today = new Date();
                var todayyear = today.getFullYear();
                var todaymonth = today.getMonth() + 1;
                var todayday = today.getDate();
                var startdate = todayyear + '-' + todaymonth + '-' + todayday;
                $("#d-now-add-addProductInfo-productDeliverDate").val(startdate);
                $("#d-now-add-addProductInfo-productDeliverDate").datetimepicker({
                    format: "yyyy-mm-dd",
                    autoclose: true,
                    todayBtn: true,
                    startDate: startdate,
                    minuteStep: 0,
                    minView: 'month'
                });
            }
        });

        var template = '<tr class="step2-chooseproduct"  name="productAddSelectedRadio" \
        value="{productId}"><td><input type="checkbox" {checked} ></td><td>{productName}</td><td>Otto</td><td>@mdo</td></tr>';

        selectProductDialogContent = "<table class='table'  id=\"productAddSelectedRadioForm\"><thead>\
                                        <tr>\
                                            <th>1</th>\
                                            <th>2</th>\
                                            <th>3</th>\
                                            <th>4</th>\
                                        </tr>\
                                    </thead>\
                                    <tbody>";
        $(document).on('click', '.step2-chooseproduct', function(event) {
            $(this).toggleClass('warning');

            if ($(this).find('input[type="checkbox"]').is(':checked')) {
                $(this).find('input[type="checkbox"]').attr({
                    'checked': false
                });
            }else{
                  $(this).find('input[type="checkbox"]').attr({
                    'checked': true
                });
            }

            /* Act on the event */
        });

        var firstone = true;
        $.each(NEWORDERWIZARD.customerInfo.products, function(index, oneAvailableProduct) {
            var found = false;
            if (NEWORDERWIZARD.currentOrder) {
                if (NEWORDERWIZARD.currentOrder.items) {
                    $.each(NEWORDERWIZARD.currentOrder.items, function(index, oneItemOfCurrentOrder) {
                        if (oneAvailableProduct.id == oneItemOfCurrentOrder.productId) found = true;
                    });
                }
            }

            if (found == false && oneAvailableProduct.status === "ACTIVE") {
                var tmp = template.replace("{productId}", oneAvailableProduct.id)
                    .replace("{productName}", oneAvailableProduct.name);

                if (firstone == true) {
                    tmp = tmp.replace("{checked}", "checked");
                    firstone = false;
                } else {
                    tmp = tmp.replace("{checked}", "");
                }

                selectProductDialogContent = selectProductDialogContent + tmp;
            }
        })
        selectProductDialogContent = selectProductDialogContent + "</tbody></table>"

        dialog.get("d-now-add-selectProduct").content(selectProductDialogContent);
        dialog.get("d-now-add-selectProduct").show(this);
    },

    bindEvent: function() {
        $newOrderWizardBody = $("#newOrderWizardBody");
        $newOrderWizardBody.find("#BTN_NOW_STEP1_NEXT").on("click", NEWORDERWIZARD.btnStep1Next);
        $newOrderWizardBody.find("#BTN_NOW_STEP2_NEXT").on("click", NEWORDERWIZARD.btnStep2Next);
        $newOrderWizardBody.find("#BTN_NOW_STEP2_PREV").on("click", NEWORDERWIZARD.btnStep2Prev);
        $newOrderWizardBody.find("#BTN_NOW_STEP3_NEXT").on("click", NEWORDERWIZARD.btnStep3Next);
        $newOrderWizardBody.find("#BTN_NOW_STEP3_PREV").on("click", NEWORDERWIZARD.btnStep3Prev);
        $newOrderWizardBody.find("#BTN_NOW_STEP4_COMPLETE").on("click", NEWORDERWIZARD.btnStep4Complete);
        $newOrderWizardBody.find("#BTN_NOW_STEP4_PREV").on("click", NEWORDERWIZARD.btnStep4Prev);
        $newOrderWizardBody.find("#DIV_NOW_STEP2").find(".addproduct").on("click", NEWORDERWIZARD.btnAddProduct);
    }
}