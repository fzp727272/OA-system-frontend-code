var MESSAGEBOX = {
    generalSystemError: function (err) {
        swal({
            title: '出错',
            text: "系统错误" + JSON.stringify(err),
            type: 'error'
        });
    },
    
    validationError: function (message) {
        swal({
            title: '数据不正确',
            text: message,
            type: 'error'
        })
    }
}