const mysql         = require("mysql");
const configs       = require("../config.json");
const browser       = require('bowser');
const superAgent    = require('superagent');

var connection = mysql.createConnection(configs.dbConnectionParams);

function start(req, callback){
    var ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',').pop() :
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    ip = ip.replace('::ffff:','');
    var headers = req.headers;
    var uaString = headers['user-agent'];
    var userAgent = null;
    if(uaString) {
        userAgent = browser._detect(uaString);
    }
    userAgent = userAgent.name;
    var referrer = req.body.referrer;
    var fingerprint = req.body.fingerprint;
    getVisitorIdforIP(ip,fingerprint, function(visitorId){
        if(visitorId){
            createSession(visitorId,genUID(30),userAgent,referrer,function(sessionId){
                callback({sessionId:sessionId})
            })
        }
        else{
            storeIP(ip,fingerprint, genUID(30), function(visitorId){
                createSession(visitorId,genUID(30),userAgent,referrer,function(sessionId){
                    callback({sessionId:sessionId})
                })
            })
        }
    })

}

function getVisitorIdforIP(ip,fingerprint, callback){
    var query = "SELECT id FROM visitors WHERE ip = ? AND fingerprint = ?";
    connection.query(query,[ip, fingerprint],function(err,result){
        if(result && result.length>0){
            callback(result[0]['id'])
        }
        else{
            callback(null)
        }
    })
}

function storeIP(ip, fingerprint, visitorId, callback){
    var insert = "INSERT INTO visitors(id, ip, fingerprint) VALUES(?,?,?)";
    connection.query(insert,[visitorId,ip, fingerprint],function(err,result){
        getLocationForIp(ip);
        callback(visitorId);

    })
}

function createSession(visitorId, sessionId, userAgent, referrer, callback){
    var insert = "INSERT INTO sessions(id, visitorId, userAgent, referrer) VALUES(?,?,?,?)";
    connection.query(insert,[sessionId,visitorId,userAgent,referrer],function(err,result){
        console.log(err);
        callback(sessionId)
    })
}

function genUID(m) {
    m = m || 9;
    var s = '';
    var r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i=0; i < m; i++) { s += r.charAt(Math.floor(Math.random()*r.length)); }
    return s;
}

function trackAction(req, callback){
    var pkg = req.body;
    var target = pkg.target;
    var action = pkg.action;
    var sessionId = pkg.sessionId;
    var page = pkg.page || 'Unknown Page';
    var insert = "INSERT INTO actions(sessionId,page, target, action) VALUES(?,?,?,?)";
    connection.query(insert,[sessionId, page, target, action], function(err, result){
        callback({success:(result && result.affectedRows > 0)})
    })
}

function getLocationForIp(ip){
    var url = "http://ip-api.com/json/" + ip.replace(':',".");
    superAgent.get(url)
        .send()
        .end(function(err,response){
           var location = response.body;
           console.log(location.status);
           if(location.status==='success'){
               console.log(97);
               storeLocationForIp(ip,location.countryCode,location.country, location.city, location.zip, location.org)
           }
        });

}

function storeLocationForIp(ip,countryCode,country,city, zip, org){
    var insert = "INSERT INTO locations(ip,countryCode,country,city,zip,org) VALUES(?,?,?,?,?,?)";
    connection.query(insert,[ip,countryCode,country,city,zip,org], function(err, result){})
}
exports.start = start;

exports.track = trackAction;