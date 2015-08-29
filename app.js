var express = require('express');
var http = require('http');
var bodyParser = require('body-parser')

var SubsProvider = require('./subs_provider').SubsProvider;
var subs_provider = new SubsProvider();

var args = process.argv.slice(2);

var app = express();

//app.use(BodyParser.json());
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get('/', function(req, res){
    res.redirect('/text/box.xml');
});


app.get('/text/', function(req, res){
    res.redirect('/text/box.xml');
});

app.post('/homework/get', function(req, res){
    console.log("AAAA",req.body);
    subs_provider.get(get_user_data(req), get_homework_data(req), function(error, result){
	res.send({"error":error,"data":result});
    });
});

app.get('/homework', function(req, res){
    res.redirect('/homework/homework.html');
});

app.post('/homework/saveall', function(req, res){
    console.log("AAAAXXX",req.body);
    var tried = 0;
    var saved = 0;
    var total = req.body.total;
    console.log(req.body);
    for(var idx in req.body){
	if(idx == 'total') continue;
	console.log(req.body[idx]);
	subs_provider.save(get_user_data(req), req.body[idx], function(error, result){
	    tried++;
	    if(!error) saved++
	    console.log(saved,tried,total);
	    if(tried == total){
		console.log("DONE");
		if(saved < tried) error = "OHNO";
		console.log(error,result);
		res.send({"error":error,"success":result});
	    }
	});
    }
});

app.post('/homework/save', function(req, res){
    console.log("AAAA",req.body);
    subs_provider.save(get_user_data(req), get_homework_data(req), function(error, result){
	res.send({"error":error,"success":result});
    });
});

app.post('/homework/submit', function(req, res){
    console.log("AAAA",req.body);
    subs_provider.del_comment(get_user_data(req), get_homework_data(req), function(error, result){
	res.send(error + ", " + result);
    });
});

var get_ip = function(req){
    return req.header('x-forwarded-for') || req.connection.remoteAddress;
}

var get_homework_data = function(req){
    return {'hwid':req.body.hwid,
	    'pid':req.body.pid,
	    'text':req.body.text};
}

var get_user_data = function(req){
    return {'ip':get_ip(req),
	    'username':"test_user"};
}

server = http.createServer(app).listen(61453, args[0]);
console.log("Server running!");