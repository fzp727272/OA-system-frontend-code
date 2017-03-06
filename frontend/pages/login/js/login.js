var USER = {
    _role: {
        "2": "PERMISSION_ADMIN",
        "4": "PERMISSION_PRODUCER",
        "8": "PERMISSION_SALESMAN",
        "16": "PERMISSION_QA"
    },

    userInfo: {
        "title": "",
        "name": "",
        "nickname": "",
        "permissionName": ""
    },

    permission: "",

    load: function () {
        if (USER.autoLogin() === false) {
            USER.requireLogin();
        }
    },

    login: function () {
        var username = $("#LM_username").val();
        var password = $("#LM_password").val();
        $.ajax({
            type: 'POST',
            url: PARAM.host + "/login",
            data: JSON.stringify({
                "name": username,
                "password": password
            }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                USER.loginSuccess(data.content);
            },
            error: function (err) {
                MESSAGEBOX.generalSystemError(err);
            }
        });
    },

    bindEvent: function () {
        $("#loginModal").find("button[name='login']").off().on("click", USER.login);
        $("#modifyPasswordModal").find("button[name='relogin']").off().on("click", function (event) {
            $("#modifyPasswordModal").modal("hide").one("hidden.bs.modal", function () {
                USER.requireLogin();
            });
        });
        $("#modifyPasswordModal").find('button[name="changePassword"]').off().on("click", function (event) {
            USER.changePassword();
        })
        $("#user").off().on('click', function (event) {
            $("#modifyPasswordModal").modal("show");
        })
    },

    changePassword: function () {
        var $passwordModifyModal = $("#modifyPasswordModal");
        var oldpassword = $passwordModifyModal.find('input[name="oldPassword"]').val();
        var newpassword = $passwordModifyModal.find('input[name="newPassword"]').val();

        $.ajax({
            type: 'PUT',
            url: PARAM.host + "/user/me/password",
            data: {
                oldPassword: oldpassword,
                newPassword: newpassword
            }
        }).done(function (data) {
            $passwordModifyModal.modal("hide");
        }).fail(function (data) {
            alert("修改密码失败");
        });
    },

    autoLogin: function () {
        var result = false;
        $.ajax({
            type: 'GET',
            url: PARAM.host + "/user/me",
            async: false,
            success: function (data, textStatus, request) {
                USER.loginSuccess(data.content);
                result = true;
            },
            error: function (err) {
                console.error(err);
            }
        });
        return result;
    },

    requireLogin: function () {
        $('#loginModal').modal({
            backdrop: 'static'
        });
        $("#loginModal").modal("show");
    },

    loginSuccess: function (content) {
        $("#loginModal").modal("hide");
        USER.userInfo.name = content.name;
        USER.userInfo.title = content.title;
        USER.userInfo.nickname = content.nickname;
        if (content.permissionSet.length > 0) {
            USER.userInfo.permissionName = content.permissionSet[0].name;
            USER.permission = USER._role[content.permissions];
        }
        USER.showNavgator();
    },

    isQA: function () {
        return USER.permission === "PERMISSION_QA";
    },

    isPRODUCER: function () {
        return USER.permission === "PERMISSION_PRODUCER";
    },

    isSALESMAN: function () {
        return USER.permission === "PERMISSION_SALESMAN";
    },

    isADMIN: function () {
        return USER.permission === "PERMISSION_ADMIN";
    },

    showNavgator: function () {
        NAVIGATOR.reloadNav();
        var gui = require('nw.gui');
        gui.App.clearCache();
    }
};