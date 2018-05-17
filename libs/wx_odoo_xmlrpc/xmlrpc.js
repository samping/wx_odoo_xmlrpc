import { DOMParser } from './dom-parser'
class Xmlrpc {
  // 构造  
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.xmlParser = new DOMParser()
  }

  methodCall(path, methodName, paramsArray, callback) {
    var self = this
    var data = this.getXml(methodName, paramsArray)
    // my.httpRequest({
    //     url: self.host+":"+self.port+path,
    //     headers: {'Content-Type': 'text/xml'},
    //     method: 'POST',
    //     data:data,
    //     dataType: 'text',
    //     success: function(res) {
    //       // console.log(res.data)
    //       var xml = self.xmlParser.parseFromString(res.data)
    //       var respone = self.parserXml(self,xml)
    //       callback(res,respone)
    //     },
    //     fail: function(res) {
    //       callback(res,null)
    //     },
    //     complete: function(res) {
    //     }
    //   });

    wx.request({
      url: self.host + ":" + self.port + path,
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
      },
      data: data,
      dataType: 'text',
      success: function (res) {
        // console.log(res.data)
        var xml = self.xmlParser.parseFromString(res.data)
        var respone = self.parserXml(self, xml)
        callback(res, respone)
      },
      fail: function (res) {
        callback(res, null)
      }
    })
  }
  getXml(methodeName, paramsArray) {
    var xml = "<?xml version='1.0'?>"
    var methodCall_start = "<methodCall>"
    var methodCall_stop = "</methodCall>"
    var methodName = "<methodName>" + methodeName + "</methodName>"
    var params_start = "<params>"
    var params_stop = "</params>"
    var params = ""
    var self = this
    paramsArray.forEach(function (param) {
      switch (param.constructor) {
        case String:
          params = params + "<param><value><string>" + param + "</string></value></param>"
          break;
        case Number:
          var str = param.toString();
          if (str.indexOf('.') > 0) {
            params = params + "<param><value><double>" + param + "</double></value></param>"
          }
          else {
            params = params + "<param><value><int>" + param + "</int></value></param>"
          }
          break;
        case Boolean:
          if (param) {
            params = params + "<param><value><boolean>" + 1 + "</boolean></value></param>"
          } else {
            params = params + "<param><value><boolean>" + 0 + "</boolean></value></param>"
          }
          break;
        // case "null":
        //   params = params + "<nil/>"
        // break;
        case Object:
          params = params + "<param><value><struct>"
          for (var key in param) {
            if (param.hasOwnProperty(key)) {
              var element = param[key];
              params = params + "<member><name>" + key + "</name>" + self.encodeValue(self, param[key]) + "</member>"
            }
          }
          params = params + "</struct></value></param>"
          break;
        case Array:
          params = params + "<param><value><array><data>" + self.encodeXmlArray(self, param) + "</data></array></value></param>"
          break;
        default:
          break;
      }
    }, this);
    xml = xml + methodCall_start + methodName + params_start + params + params_stop + methodCall_stop
    return xml;
  }

  encodeXmlArray(self, array) {
    var params = ""
    array.forEach(function (param) {
      params = params + self.encodeValue(self, param)
    }, this);
    return params
  }
  encodeValue(self, param) {
    var params = ""
    switch (param.constructor) {
      case String:
        params = params + "<value><string>" + param + "</string></value>"
        break;
      case Number:
        var str = param.toString();
        if (str.indexOf('.') > 0) {
          params = params + "<value><double>" + param + "</double></value>"
        }
        else {
          params = params + "<value><int>" + param + "</int></value>"
        }
        break;
      case Boolean:
        if (param) {
          params = params + "<value><boolean>" + 1 + "</boolean></value>"
        } else {
          params = params + "<value><boolean>" + 0 + "</boolean></value>"
        }
        break;
      case Object:
        params = params + "<value><struct>"
        for (var key in param) {
          if (param.hasOwnProperty(key)) {
            var element = param[key];
            params = params + "<member><name>" + key + "</name>" + self.encodeValue(self, param[key]) + "</member>"
          }
        }
        params = params + "</struct></value>"
        break;
      case Array:
        params = params + "<value><array><data>" + self.encodeXmlArray(self, param) + "</data></array></value>"
        break;
      default:
        break;
    }
    return params
  }

  parserXml(self, doc) {
    var d = doc.getElementsByTagName('params')
    var respone = []
    if (d.length == 0) {
      return respone
    }
    var params = d.item(0).childNodes

    for (var i = 0; i < params.length; i++) {
      var param = params[i]
      if (param.nodeName == "param") {
        var _param = param.childNodes
        for (var index = 0; index < _param.length; index++) {
          var value = _param[index];
          if (value.nodeName == "value") {
            var _value = value.childNodes
            var data = self.parserValue(self, _value[0])
            if (data != null) {
              respone.push(data)
            }
          }
        }
      }
    }
    if (respone.length == 1 && respone[0].constructor == Array) {
      return respone[0]
    }
    return respone;
  }

  parserValue(self, node) {
    if (node == null) {
      return null
    }
    var nodeName = node.nodeName
    var data
    switch (nodeName) {
      case "int":
        // console.log(node)
        data = Number(node.firstChild.data)
        // console.log(data)
        break;
      case "double":
        data = Number(node.firstChild.data)
        break;
      case "string":
        data = node.firstChild.data
        break;
      case "boolean":
        var d = node.firstChild.data
        if (d == "1") {
          data = true
        } else {
          data = false
        }
        break;
      case "struct":
        data = self.parserStruct(self, node)
        break;
      case "array":
        var data = node.firstChild
        var values = data.childNodes
        var array = []
        for (var index = 0; index < values.length; index++) {
          var element = values[index];
          var v = self.parserValue(self, element.firstChild)
          if (v != null) {
            array.push(v)
          }
        }
        data = array
        break;
      case "null":
        data = null
        break;
      default:
        break;
    }
    return data;
  }
  parserStruct(self, struct) {
    var respone = {}
    var childNodes = struct.childNodes
    for (var index = 0; index < childNodes.length; index++) {
      var member = childNodes[index];
      if (member.nodeName == "member") {
        var me = member.getElementsByTagName("value").item(0)
        var v = me.firstChild
        respone[member.getElementsByTagName("name").item(0).textContent] = self.parserValue(self, v)
      }
    }
    return respone
  }

}
export { Xmlrpc }; 