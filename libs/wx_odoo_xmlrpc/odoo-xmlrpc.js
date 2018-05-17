import {Xmlrpc} from './xmlrpc';  
class Odoo{  
    // 构造
    
    // var odoo = new Odoo({
    //     url: <insert server URL>,
    //     port: <insert server Port (by default 80)>,
    //     db: <insert database name>,
    //     username: '<insert username>',
    //     password: '<insert password>'
    // });
    constructor(url,port,db,username,password){  
        this.url = url;  
        this.port = port;  
        this.db = db;  
        this.username = username;  
        this.password = password;
        this.xmlrpc;
        this.uid = 0;  
    }

    // odoo.connect(function (err) {
    //     if (err) { return console.log(err); }
    //     console.log('Connected to Odoo server.');    
    //     });
    connect(callback){
        this.xmlrpc = new Xmlrpc(this.url,this.port)
        var self = this
        this.xmlrpc.methodCall("/xmlrpc/2/common","authenticate",[this.db,this.username,this.password,{}],function(res,xml){
            if(xml != null){
                self.uid = xml[0]
            }
            callback(res,xml)
        })
    }



    // odoo.execute_kw('res.partner', 'check_access_rights', params, function (err, value) {
    //     if (err) { return console.log(err); }
    //     console.log('Result: ', value);
    // });
    execute_kw(modelName,method,paramsArray,callback){
        this.xmlrpc.methodCall("/xmlrpc/2/object","execute_kw",[this.db,this.uid,this.password,modelName,method,paramsArray],callback)
    }    
  }
export {Odoo}; 