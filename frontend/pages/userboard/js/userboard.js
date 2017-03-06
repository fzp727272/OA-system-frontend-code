var USERBOARD = {
    $rootDiv: null,
    $users: null,
    $newUserModal: null,

    loadPage: function () {
        $.ajax({
            type: 'GET',
            url: PARAM.host + "/users",
            dataType: 'json',
            success: function (data) {
                USERBOARD.$users = data.content;
                var templateContext = {
                    users: USERBOARD.$users
                }
                $.get("pages/userboard/template/userboard.html", function (template) {
                    $("#panel-body").html(Mustache.render(template, templateContext));
                    USERBOARD.$rootDiv = $("#userboard_page");
                    USERBOARD.$rootDiv.find(".selectpicker").selectpicker();
                    USERBOARD.bindEvent();
                });
            }
        });
    },

    bindEvent: function () {
        USERBOARD.$newUserModal = USERBOARD.$rootDiv.find('div[name="new_user"]');
        USERBOARD.$rootDiv.find('button[name="btn-newUser"]').off().on("click", function (event) {
            USERBOARD.$newUserModal.modal("show");
        });

        USERBOARD.$newUserModal.find('button[name="submit_new_user"]').off().on("click", function (event) {
            USERBOARD.postNewUser();
        });
    },

    postNewUser: function () {
        var newUser = {
            name: USERBOARD.$newUserModal.find('input[name="name"]').val(),
            permissions: USERBOARD.$newUserModal.find('select[name="permission"]').find("option:checked").val(),
            password: "123456"
        };

        $.ajax({
            type: 'POST',
            url: PARAM.host + "/user",
            data: JSON.stringify(newUser),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                USERBOARD.$newUserModal.modal("hide").one("hidden.bs.modal", function () {
                    USERBOARD.loadPage();
                });
            },
            error: function (data) {}
        });
    }
}