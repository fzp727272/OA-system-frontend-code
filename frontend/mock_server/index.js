var http = require('http');
var fs = require('fs');
var url = require('url');

var server = http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var path = url.parse(req.url).pathname;
    var arg = url.parse(req.url, true).query;
    var method = req.method;

    if (path === "/clients" && method === "GET") {
        DataProvider.provideData("data/client.json", res);
        return;
    }

    if (path === "/client/12345/orders" && method === "GET") {
        DataProvider.provideData("data/order_12345.json", res);
        return;
    }

    if (path === "/order/L1" && method === "GET") {
        DataProvider.provideData("data/order_detail.json", res);
        return;
    }

    if (path === "/groups" && method === "GET") {
        DataProvider.provideData("data/customer_Group.json", res);
        return;
    }

    if (path === "/addGroup" && method === "POST") {
        res.writeHead(200, {});
        res.write("{\"id\": 4}");
        res.end();
        return ;
    }

    if (path === "/login" && method === "POST") {
        var data = {
            content: {
                name: "admin",
                permissions: 2,
                permissionSet: ["PERMISSION_ADMIN"]
            }
        };
        res.writeHead(200, {});
        res.write(JSON.stringify(data));
        res.end();
        return ;
    }

    if (path === "/customerList" && method === "GET") {
        fs.readFile("data/customerList.json", 'utf-8', function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var jsonData = JSON.parse(data);
                var keys = jsonData["result"];
                //var keys = [];
                //for (var key in jsonData) {
                //    keys.push(key);
                //}
                console.log(keys);
                if (keys.length !== 0) {
                    res.writeHead(200, {});
                    res.write(JSON.stringify(keys));
                    res.end();
                } else {
                    res.writeHead(409, {});
                    res.write("empty!");
                    res.end();
                }
            }
        });

        return;
    }

    if (path === "/customer" && method === "GET") {
        var customerId = arg["customerId"];
        fs.readFile("data/customerData.json", 'utf-8', function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var jsonData = JSON.parse(data);
                var result = jsonData[customerId];
                console.log(result);
                if (result !== undefined) {
                    res.writeHead(200, {});
                    res.write(JSON.stringify(result));
                    res.end();
                } else {
                    res.writeHead(409, {});
                    res.write("not found!");
                    res.end();
                }
            }
        });

    }


});

server.listen(5050, "localhost", function () {
    console.log("server started on 5050");
});

var DataProvider = {
    provideData: function (fileName, res) {
        fs.readFile(fileName, 'utf-8', function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.write(data);
                res.end();
            }
        });
    }
};