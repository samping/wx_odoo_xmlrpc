# wx_odoo_xmlrpc

#### 项目介绍
本库是微信小程序对接odoo服务器，使用的是xmlrpc通信方式

#### 使用说明

1. 把libs/wx_odoo_xmlrpc拷到你对应的小程序libs目录下
2. import { Odoo } from '/libs/wx_odoo_xmlrpc/odoo-xmlrpc';
3. 配置
~~~
var odoo = new Odoo({
    url: <insert server URL>,
    port: <insert server Port (by default 80)>,
    db: <insert database name>,
    username: '<insert username>',
    password: '<insert password>'
}); 
~~~
4.登录
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');    
});
~~~
5.请求
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push('read');
    inParams.push(false); //raise_exception
    odoo.execute_kw('res.partner', 'check_access_rights', inParams, function (err, value) {
        if (err) { return console.log(err); }
        console.log('Result: ', value);
    });
});
~~~
6.请求列表
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([['is_company', '=', true],['customer', '=', true]]);
    odoo.execute_kw('res.partner', 'search', inParams, function (err, value) {
        if (err) { return console.log(err); }
        console.log('Result: ', value);
    });
});
~~~
7.按页请求
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([['is_company', '=', true],['customer', '=', true]]);
    inParams.push(10); //offset
    inParams.push(5);  //limit
    odoo.execute_kw('res.partner', 'search', inParams, function (err, value) {
        if (err) { return console.log(err); }
        console.log('Result: ', value);
    });
});
~~~
8.请求数量
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([['is_company', '=', true],['customer', '=', true]]);
    odoo.execute_kw('res.partner', 'search_count', inParams, function (err, value) {
        if (err) { return console.log(err); }
        console.log('Result: ', value);
    });
});
~~~
9.读记录
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([['is_company', '=', true],['customer', '=', true]]);
    inParams.push(0);  //offset
    inParams.push(1);  //Limit
    odoo.execute_kw('res.partner', 'search', inParams, function (err, value) {
        if (err) { return console.log(err); }
        var inParams = [];
        inParams.push(value); //ids
        odoo.execute_kw('res.partner', 'read', inParams, function (err2, value2) {
            if (err2) { return console.log(err2); }
            console.log('Result: ', value2);
        });
    });
});
~~~
10.过滤方式读记录
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([['is_company', '=', true],['customer', '=', true]]);
    inParams.push(0);  //offset
    inParams.push(1);  //Limit
    odoo.execute_kw('res.partner', 'search', inParams, function (err, value) {
        if (err) { return console.log(err); }
        var inParams = [];
        inParams.push(value); //ids
        inParams.push(['name', 'country_id', 'comment']); //fields
        odoo.execute_kw('res.partner', 'read', inParams, function (err2, value2) {
            if (err2) { return console.log(err2); }
            console.log('Result: ', value2);
        });
    });
});
~~~
11.请求记录字段
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([]);
    inParams.push([]);
    inParams.push([]);
    inParams.push(['string', 'help', 'type']);  //attributes
    odoo.execute_kw('res.partner', 'fields_get', inParams, function (err, value) {
        if (err) { return console.log(err); }
        console.log('Result: ', value);
    });
});
~~~
12.搜索并查询记录和排序
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([['is_company', '=', true],['customer', '=', true]]);
    inParams.push(['name', 'country_id', 'comment']); //fields
    inParams.push(0); //offset
    inParams.push(5); //limit
    inParams.push('name desc')// sort "country_id ASC, name DESC"
    odoo.execute_kw('res.partner', 'search_read', inParams, function (err, value) {
        if (err) { return console.log(err); }
        console.log('Result: ', value);
    });
});
~~~
13.创建记录
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push({'name': 'FFNew Partner'})
    odoo.execute_kw('res.partner', 'create', inParams, function (err, value) {
        if (err) { return console.log(err); }
        console.log('Result: ', value);
    });
});
~~~
14.更新记录
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([3626]); //id to update
    inParams.push({'name': 'NewFF Partner'})
    odoo.execute_kw('res.partner', 'write', inParams, function (err, value) {
        if (err) { return console.log(err); }
        console.log('Result: ', value);
    });
});
~~~
15.删除记录
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([3626]); //id to delete
    odoo.execute_kw('res.partner', 'unlink', inParams, function (err, value) {
        if (err) { return console.log(err); }
        console.log('Result: ', value);
    });
});
~~~
16.创建model
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push({'name': 'Custom Model',
        'model': 'x_custom_model',
        'state': 'manual'
    });
    odoo.execute_kw('ir.model', 'create', inParams, function (err, value) {
        if (err) { return console.log(err); }
        var inParams = [];
        inParams.push([]);
        inParams.push([]);
        inParams.push([]);
        inParams.push(['string', 'help', 'type']);  //attributes
        odoo.execute_kw('x_custom_model', 'fields_get', inParams, function (err2, value2) {
            if (err2) { return console.log(err2); }
            console.log('Result: ', value2);
        });
        console.log('Result: ', value);
    });
});
~~~
17.创建字段
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push({
        'name': 'Custom Model',
        'model': 'x_custom',
        'state': 'manual'
    });
    odoo.execute_kw('ir.model', 'create', inParams, function (err, value) {
        if (err) { return console.log(err); }
        var inParams = [];
        inParams.push({
            'model_id': value,
            'name': 'x_name',
            'ttype': 'char',
            'state': 'manual',
            'required': true,
        });
        odoo.execute_kw('ir.model.fields', 'create', inParams, function (err2, value2) {
            if (err) { return console.log(err); }
            var inParams = [];
            inParams.push({
                'x_name': 'test record'
            });
            odoo.execute_kw('x_custom', 'create', inParams, function (err3, value3) {
                if (err3) { return console.log(err3); }
                var inParams = [];
                inParams.push([value3])
                odoo.execute_kw('x_custom', 'read', inParams, function (err4, value4) {
                    if (err4) { return console.log(err4); }
                    console.log('Result: ' + value4);
                });
            });
        });
    });
});
~~~
18.工作流操作
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([['customer', '=', true]]);
    inParams.push([
        'property_account_receivable',
        'property_payment_term',
        'property_account_position']); //fields
    inParams.push(0); //offset
    inParams.push(1); //limit
    odoo.execute_kw('res.partner', 'search_read', inParams, function (err, value) {
        if (err) { return console.log(err); }
        var inParams = [];
        inParams.push({
            'partner_id': value[0]['id'],
            'account_id': value[0]['property_account_receivable'][0],
            'invoice_line': [0, False, {'name': "AAA"}]
        });
        odoo.execute_kw('account.invoice', 'create', inParams, function (err2, value2) {
            if (err2) { return console.log(err2); }
            odoo.exec_workflow('account.invoice', 'invoice_open', params, function (err3, value3) {
                if (err3) { return console.log(err3); }
                console.log('Result: ' + value3);
            });
        });
    });
});
~~~
19.报表打印
~~~
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([['type', '=', 'out_invoice'], ['state', '=', 'open']]);
    odoo.execute_kw('account.invoice', 'search', inParams, function (err, value) {
        if (err) { return console.log(err); }
        if(value){
            var params = [];
            params.push(value);
            odoo.render_report('account.report_invoice', params, function (err2, value2) {
                if (err2) { return console.log(err2); }
                console.log('Result: ' + value2);
            });
        }
    });
});
~~~
#### 参与贡献

1. ping