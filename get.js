var request = require('request'),
	      jsdom = require('jsdom');
	      xml = require('node-xml'),
	      sys = require('sys'),
	      Db = require('mongodb').Db,
	      Server = require('mongodb').Server,
	      BSON = require('mongodb').BSONNative;

//Does the request to get the feeds
request({uri:'http://5inchandup.blogspot.com/feeds/posts/default?alt=rss'},function(error,response,body) {
		var parser = new xml.SaxParser(function(cb) {
			// Array of all the fields we retrieve
			var fields=[];
			// Number of parsers we have running asynchronously. Google node.js async for more info
			var activeParsers=0;
			// Whether we are done. We don't save to the database until everything is done. We need async processing
			var done=0;
			// The field number for the array
			var fieldNum=0;
		
			// Function to call to determine when we are finished, and it is time to save to the database	
			var finish=function() {
				if(done && activeParsers==0) {
					var db=new Db('feeds', new Server('localhost',27017,{}), {native_parser:true});
					db.open(function(err,db) {
						db.collection('feed',function(err,collection) {
							for(var a in fields) {
								// Data is actually stored in the database here
								collection.insert(fields[a]);
							}
						});
					});
				}	
			}
  			cb.onStartDocument(function() {
						});
			// Callback at the end of the xml
  			cb.onEndDocument(function() {
				done=1;
				finish();
  			});
			// The HTML element we are inside of
			var inElement;
			// Are we inside the 'item' html tag?
			var inItem=0;
			// Callback at the start of every XML tag
  			cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
			if(elem=="item") {
				// Initialize the fields at the start of <item> XML tag
				fields[fieldNum]={title:"",description:"",image:""};	
				inItem=1;
			}
			// Save the name of the XML element we are inside of
			inElement=elem;
  			});
			// End of XML element
  			cb.onEndElementNS(function(elem, prefix, uri) {
				inElement="";
				// End of item xml tag
				if(elem=="item") {
					// Iterate the number of parsers because we about to start an async jquery call
					activeParsers++;	
					// Save the field num for the parser. This works due to closures
					var curFieldNum=fieldNum;
					// Parse the HTML in the description with jquery
					var window = jsdom.jsdom().createWindow();
					jsdom.jQueryify(window,"jquery.js", function() {
						 // We are looking at which img tag we are on
						// Parse through the HTML using jQuery for img tags
						window.$('body').append(fields[curFieldNum].description);
						window.$('img').each(function(a,el) {
							//We only use the first img tag
							if(a==0) {
								// Grab the image src
								fields[curFieldNum].image=el.src;
							}
						});
						// Decrement the number of parsers since this is done
						activeParsers--;
						// Check if we are done
						finish();
					});
					// Iterate to the next array element of the items we are grabby
					fieldNum++;	
					
					inItem=0;
				}
  			});
			//Callback on characters, wher ewe grab the actual caharacters inside the tags
  			cb.onCharacters(function(chars) {
				if(inItem) {
					if(inElement=="title") {
						fields[fieldNum].title+=chars;
					}
					else if(inElement=="description") {
						fields[fieldNum].description+=chars;
					}
				}
  			});
  			cb.onCdata(function(cdata) {
  			});
  			cb.onComment(function(msg) {
  			});
  			cb.onWarning(function(msg) {
  			});
  			cb.onError(function(msg) {
  			});
		});
		// Calls the actual parser if we have retrieved the HTML from the server
		if(!error && response.statusCode == 200) {
			parser.parseString(body);
		}
});
