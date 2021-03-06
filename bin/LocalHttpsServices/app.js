/**
 * Created by Administrator on 2014/8/9.
 */
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
var https = require('https')
    ,fs = require("fs"),ini = require('ini');


var options = {
    key: fs.readFileSync('./plugins/privatekey.pem'),
    cert: fs.readFileSync('./plugins/certificate.pem')
};

var pHttps=https.createServer(options, function(req,res){
    var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))
    if((req.headers['ghost'])==null){
        req.headers['ghost']=req.headers.host;
        req.headers['ssl']='true';
        req.headers.host=config.public.Host;
        req.headers.host=req.headers.host;
        if(config.public.hiddenIp){
            req.headers['hiddenIp']='true';
        }
        proxy.web(req, res, { target: 'http://'+req.headers.host });
        console.log(req.headers['ghost']+"\n");
        }

}).listen(3001, function () {
    console.log('Https server listening on port ' + 3001);
});

proxy.on('error',function(e){
    console.log(e.message);
});