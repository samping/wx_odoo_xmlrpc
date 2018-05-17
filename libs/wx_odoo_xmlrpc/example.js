//參考 https://www.npmjs.com/package/odoo-xmlrpc

import { Odoo } from '/lib/odoo-xmlrpc/odoo-xmlrpc';
let odoo = new Odoo('http://192.168.1.188', '80', 'test6', 'admin', 'admin');
odoo.connect(function (res, array) {
  console.log(res)
  if (res.statusCode == 200) {
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([])
    odoo.execute_kw('product.template', 'search', inParams, function (res, array) {
      console.log(res)
      console.log(array)
      var inParams = [];
      inParams.push(array); //ids
      inParams.push(["name", "categ_id"]); //fields
      odoo.execute_kw('product.template', 'read', inParams, function (res, array) {
        console.log('Result: ', array);
      });
    })
  }
});