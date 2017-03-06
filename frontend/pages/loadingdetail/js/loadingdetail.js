var LOADINGDETAIL = {
    currentLoadingId: null,
    currentLoading: null,
    $rootDiv: null,

    loadPage: function () {
        var loadingId = LOADINGDETAIL.currentLoadingId;

        $.ajax({
            type: 'GET',
            url: PARAM.host + "/loading/" + loadingId,
            dataType: 'json',
            success: function (data) {
                LOADINGDETAIL.currentLoading = data.content;
                LOADINGDETAIL.decorateLoading();
                $.get("pages/loadingdetail/template/loadingdetail.html", function (template) {
                    $("#panel-body").html(Mustache.render(template, LOADINGDETAIL.currentLoading));
                    $rootDiv = $("#page_loadingdetail");
                    $rootDiv.find('a[name="batchnumber"]').editable({
                        url: PARAM.host + "/invoice/_updateInvoiceItem",
                        disabled: (USER.isPRODUCER() ? false : true)
                    });
                    $rootDiv.find('.assistant-product-note').popover();
                });
            }
        });
    },

    decorateLoading: function () {
        if (LOADINGDETAIL.currentLoading) {
            LOADINGDETAIL.currentLoading.showProducibleProductName = (USER.isPRODUCER() || USER.isQA());
            LOADINGDETAIL.currentLoading.sendDateDisplay = moment(LOADINGDETAIL.currentLoading.sendDate).format("YYYY-MM-DD");

            $.each(LOADINGDETAIL.currentLoading.invoices, function (index, invoice) {
                invoice.dateCreatedDisplay = moment(invoice.dateCreated).format("YYYY-MM-DD");
                $.each(invoice.items, function (index, invoiceItem) {
                    if (USER.isPRODUCER() && invoiceItem.producerComment) {
                        invoiceItem.productSpecialComment = invoiceItem.producerComment;
                    } else if (USER.isQA() && invoiceItem.qaComment) {
                        invoiceItem.productSpecialComment = invoiceItem.qaComment;
                    }
                });
            });
        }
    },
    
    printLoading: function() {
        nw.Window.open('http://' + window.location.host + '/print/loading/print.html?loadingid=' + LOADINGDETAIL.currentLoadingId, {show: false});
    }
};