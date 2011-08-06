== Installation

1) Install node.js 
	Option a) Download from http://www.nodejs.org
	Option b) On ubuntu use the package management system with something like `sudo apt-get install nodejs`
	Option c) On Mac OS X use brew for something like `sudo brew install nodejs`
2) Install npm(node package manager) from http://www.npmjs.org. You can do this by running `curl http://npmjs.org/install.sh | sh`
3) Install mongodb
4) Install the node modules with:
	sudo npm install request jsdom node-xml sys mongodb

== Quickstart
Open this directory from the command prompt and run:
1) mongod # Starts mongodb
2) node get.js #Fetches from feeds into database
3) node http.js #Starts web server
4) Go to http://localhost:3000 and you should see the images and titles that are laoded into the database

== Playing with mongo
Make sure mongodb is started, which requires running 'mongod'. Once, it is running, you can go into the database by running `mongo feeds`, which open the database command line with the database feeds. You can run db.feed.find() to list everything in the 'feed' collection. Run db.help() for help. 
