var MASTERDATA = {
    getDriverList: function(callback) {
        $.ajax({
            type: 'GET',
            url: PARAM.host + "/drivers",
            dataType: "json",
            success: function (data) {
                callback(data.content);
            }
        });
    }
}