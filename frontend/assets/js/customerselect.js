var CUSTOMERSELECT = {
    setSelect: function (dropdownelement, onHiddenCall) {
        dropdownelement.selectpicker({
            liveSearch: true
        }).ajaxSelectPicker({
            ajax: {
                type: "GET",
                url: PARAM.host + "/customer/_nameContains",
                data: function () {
                    var params = {
                        q: '{{{q}}}'
                    };
                }
            },
            locale: {
                emptyTitle: '选择客户',
                statusNoResults: '查找无结果',
                statusSearching: '查找中',
                statusInitialized: '输入关键词搜索',
                searchPlaceholder: '搜索',
                errorText: "出错"
            },
            preprocessData: function (data) {
                if (data.content) {
                    var customers = [];

                    $.each(data.content, function (index, value) {
                        customers.push({
                            'value': value.id,
                            'text': value.name
                        });
                    })

                    return customers;
                }
            },
            preserveSelected: false
        });

        dropdownelement.off('hidden.bs.select');
        if (onHiddenCall) {
            dropdownelement.on('hidden.bs.select', function(event) {
                if (dropdownelement.find('option:selected').val()) {
                    onHiddenCall(event);
                }
            });
        }
    }
}