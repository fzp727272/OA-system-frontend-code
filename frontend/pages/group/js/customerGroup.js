var GROUP = {
    customerGroup: null,
    $rootDiv: null,

    loadPage: function () {
        GROUP.fetchGroup();

        $("#addGroupConfirm").click(GROUP.addGroup);
    },

    fetchGroup: function () {
        $.ajax({
            type: 'GET',
            url: PARAM.host + "/groups",
            success: function (data) {
                GROUP.customerGroup = data.content;
                GROUP.showGroup();
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    
    addGroup: function () {
        var $modalDiv = $rootDiv.find("#modal_add_new_group")
        
        var newGroup = {
            name: $modalDiv.find('input[name="name"]').val(),
            idPrefix: $modalDiv.find('input[name="idPrefix"]').val(),
            invoiceHeader: $modalDiv.find('input[name="invoiceHeader"]').val(),
            adminOnly: $('input[name="adminOnly"]').is(':checked') ? "1" : "0"
        }

        var pass = true;
        for (var i in GROUP.customerGroup) {
            if (GROUP.customerGroup[i].name === newGroup.name) {
                console.log("name exist");
                pass = false;
            }
        }
        if (pass) {
            $.ajax({
                type: 'POST',
                url: PARAM.host + "/group",
                data: JSON.stringify(newGroup),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    $modalDiv.find('input[name="name"]').val("");
                    $modalDiv.find('input[name="idPrefix"]').val("");
                    $modalDiv.find('input[name="invoiceHeader"]').val("");
                    $modalDiv.modal('hide').one("hidden.bs.modal", function(event) {
                        GROUP.fetchGroup();
                    });
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    },

    bindEvent: function () {
        $(".addCustomer").on('click', function () {
            var that = this;
            var d = dialog({
                title: '新客户',
                content: '<div class="form-inline" style="margin-bottom:10px;">\
                              <label style="margin-left:20px; margin-right: 10px;">客户名</label>\
                              <input id="addCustomer" class="editbox"  placeholder="客户名"> \
                         </div>',
                quickClose: true,
                align: 'right',
                cancelValue: '取消',
                okValue: '确定',
                cancel: function () {},
                ok: function () {
                    var name = $("#addCustomer").val();
                    if (!GROUP.validName(name)) {
                        alert("名字不合法");
                    }
                    var groupId = $(that).parent().parent().attr("id");
                    $.ajax({
                        type: 'POST',
                        url: PARAM.host + "/group/" + groupId + "/customer",
                        data: JSON.stringify({
                            "name": name
                        }),
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function () {
                            var curCnt = Number.parseInt($(that).parent().parent().find("span.totalCustomer").text()) + 1;
                            $(that).parent().parent().find("span.totalCustomer").text(curCnt);
                        },
                        error: function (err) {
                            console.log(err);
                            alert("更改信息失败");
                        }
                    });

                }

            });
            d.show(this);
        });
    },

    validName: function (name) {
        if (_.isEmpty(name)) return false;
        for (var i in GROUP.customerGroup) {
            var customer = GROUP.customerGroup[i];
            if (customer.name === name) {
                return false;
            }
        }
        return true;
    },

    showGroup: function () {
        var data = {
            groups: GROUP.customerGroup
        };

        $.get("pages/group/template/customerGroup.html", function (template) {
            $("#panel-body").html(Mustache.render(template, data));
            $rootDiv = $("#customerGroup_page");
            GROUP.bindEvent();

            $("a[name='invoiceHeader']").editable({
                url: PARAM.host + "/group/_modify"
            });
            $("a[name='idPrefix']").editable({
                url: PARAM.host + "/group/_modify"
            });
        });
    }

};