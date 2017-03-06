var NAVIGATOR = {
    template: '<li><a class="list_left active" onclick="{{onclick}}"><i class="fa {{icon}} list_left_li"></i><span>{{name}}</span></a></li>',
    
    navOrder: null,
    navLoading: null,
    navCustomer: null,
    navGroup: null,
    navCustomerBook: null,
    navOrderBoard: null,
    navProductClass: null,
    navSalesman: null,
    navDriver: null,
    navNewCustomer: null,
    navUserBoard: null,
    
    initItems: function()
    {
        NAVIGATOR.navOrder = Mustache.render(NAVIGATOR.template, {onclick: "ORDER.loadPage()", icon: "fa-book", name: "订单"});
        NAVIGATOR.navLoading = Mustache.render(NAVIGATOR.template, {onclick: "LOADING.loadPage()", icon: "fa-truck", name: "装车单"});
        NAVIGATOR.navCustomer = Mustache.render(NAVIGATOR.template, {onclick: "CUSTOMER.loadPage()", icon: "fa-user", name: "客户"});
        NAVIGATOR.navGroup = Mustache.render(NAVIGATOR.template, {onclick: "GROUP.loadPage()", icon: "fa-users", name: "客户组"});
        NAVIGATOR.navCustomerBook = Mustache.render(NAVIGATOR.template, {onclick: "", icon: "fa-address-book", name: "客户簿"});
        NAVIGATOR.navOrderBoard = Mustache.render(NAVIGATOR.template, {onclick: "ORDERBOARD.loadPage()", icon: "fa-exchange", name: "订单面板"});
        NAVIGATOR.navProductClass = Mustache.render(NAVIGATOR.template, {onclick: "PRODUCTCLASS.loadPage()", icon: "fa-folder", name: "产品大类"});
        NAVIGATOR.navProducibleProduct = Mustache.render(NAVIGATOR.template, {onclick: "PRODUCIBLEPRODUCT.loadPage()", icon: "fa-cube", name: "生产类型"});
        NAVIGATOR.navSalesman = Mustache.render(NAVIGATOR.template, {onclick: "SALESMAN.loadPage()", icon: "fa-black-tie", name: "业务员"});
        NAVIGATOR.navDriver = Mustache.render(NAVIGATOR.template, {onclick: "DRIVER.loadPage()", icon: "fa-car", name: "司机"});
        NAVIGATOR.navNewCustomer = Mustache.render(NAVIGATOR.template, {onclick: "NEWCUSTOMER.loadPage()", icon: "fa-user-o", name: "新添客户"});
        NAVIGATOR.navUserBoard = Mustache.render(NAVIGATOR.template, {onclick: "USERBOARD.loadPage()", icon: "fa-address-card", name: "系统用户"});
    },
    
    reloadNav: function()
    {
        NAVIGATOR.initItems();
        
        $("ul.nav_left").empty();
        
        if (USER.isADMIN()) {
            NAVIGATOR.reloadNavForAdmin();
        } else if (USER.isPRODUCER()) {
            NAVIGATOR.reloadNavForProducer();
        } else if (USER.isSALESMAN()) {
            NAVIGATOR.reloadNavForSalesman();
        } else if (USER.isQA()) {
            NAVIGATOR.reloadNavForQA();
        }
    },
    
    reloadNavForAdmin: function() {
        $("ul.nav_left").append(NAVIGATOR.navOrder);
        $("ul.nav_left").append(NAVIGATOR.navNewCustomer);
        $("ul.nav_left").append(NAVIGATOR.navUserBoard);
        $("ul.nav_left").append(NAVIGATOR.navGroup);
    },
    
    reloadNavForSalesman: function() {
        $("ul.nav_left").append(NAVIGATOR.navOrder);
        $("ul.nav_left").append(NAVIGATOR.navLoading);
        $("ul.nav_left").append(NAVIGATOR.navOrderBoard);
        $("ul.nav_left").append(NAVIGATOR.navCustomer);
        $("ul.nav_left").append(NAVIGATOR.navNewCustomer);
        $("ul.nav_left").append(NAVIGATOR.navSalesman);
        $("ul.nav_left").append(NAVIGATOR.navDriver);
    },
    
    reloadNavForProducer: function() {
        $("ul.nav_left").append(NAVIGATOR.navLoading);
        $("ul.nav_left").append(NAVIGATOR.navOrderBoard);
        $("ul.nav_left").append(NAVIGATOR.navCustomer);
        $("ul.nav_left").append(NAVIGATOR.navProductClass);
        $("ul.nav_left").append(NAVIGATOR.navProducibleProduct);
    },
    
    reloadNavForQA: function() {
        $("ul.nav_left").append(NAVIGATOR.navLoading);
        $("ul.nav_left").append(NAVIGATOR.navCustomer);
        $("ul.nav_left").append(NAVIGATOR.navOrderBoard);
    }
}