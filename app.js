const configs = require('./config.json');
const express = require("express");
const body_parser = require("body-parser");
const nodemailer = require('nodemailer');

const tracking = require('./modules/tracking.js');

app = express();
app.use(body_parser.urlencoded({extended:true}));
app.use(body_parser.json());
app.use(express.static(__dirname + "/dist",{extensions:['html']}));


//POST Email endpoint


app.post('/api/email', function(req, res){
    var body = req.body;
    res.writeHead(200, {"Content-type":"application/json"});
    forwardContactForm(body, function(err){
        res.end(JSON.stringify(err));
    });
});

app.post('/api/track/report', function(req, res){
    tracking.track(req,function(response){
        res.writeHead(200, {"Content-type":"application/json"});
        res.end(JSON.stringify(response));
    });
});

app.post('/api/track/start', function(req, res){
    tracking.start(req,function(response){
        res.writeHead(200, {"Content-type":"application/json"});
        res.end(JSON.stringify(response));
    })
});

app.use(function(req, res, next) {
    res.status(404);
    res.sendFile(__dirname +"/dist/404.html");
});

app.listen(configs.http_port);


// UTIL

function forwardContactForm(contact, callback){
    var sender  = configs.email;
    var transporter = nodemailer.createTransport(sender);
    var mailOptions = {
        from: sender.from,
        to: 'epcphelan@gmail.com', // list of receivers
        subject: 'EricPhelan.com Submission', // Subject line
        html: JSON.stringify(contact)
    };

    transporter.sendMail(mailOptions, function(err){
        console.log(err);
        if(err){
            callback({success:false})
        }else {
            callback({success:true})
        }
    });
}