var express=require('express'),
    ejs=require('ejs'),
    Db = require('mongodb').Db, 
    Server = require('mongodb').Server,
    BSON = require('mongodb').BSONNative;
    fs=require('fs'),
    sys=require('sys');


var app=express.createServer();

// When you go http://localhost:3000, you get this
app.get('/',function(req,res) {
        try {
		var db=new Db('feeds', new Server('localhost',27017,{}), {native_parser:true});
		db.open(function(err,db2) {
		db2.createCollection('feed',function(err,collection) {
			collection.find(function(err,cursor) {
				cursor.toArray(function(err,feeds) {
					//Load the file from the template and render it (Note fields coresponds to the variable in the template)
               				var str=fs.readFileSync(__dirname + "/templates/index.html.ejs", 'utf8');
	                		var ret=ejs.render(str,{locals: {fields:feeds}});
     		        		res.send(ret);
				});
			});
        	});
		});
        }
        catch(e) {
                res.send("Not found");
        }

});

// Start the web server to listen on port 3000
app.listen(3000);
