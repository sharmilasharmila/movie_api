const http = require('http'), //HTTP module
fs = require('fs'),
url = require('url'); //URL module
// const { request } = require('node:http');

//http only
/* http.createServer((request, response)=>{
    response.writeHead(200, {'Content-type': 'text/plain'});
    response.end('Hello Node!\n');
}).listen(8080) */

// http, url and fs combined
http.createServer((request, response)=>{
    // variable declaration
    let addr = request.url,
    q = url.parse(addr, true),
    filepath = '';

    //adding things to log file
    fs.appendFile('log.txt', 'URL: ' + addr + '\n Timestamp: ' + new Date() + '\n\n', (err) => {
        if(err){
            console.log(err);
        }
        else{
            console.log('Added to log.');
        }
    })

    //server creation
    if(q.pathname.includes('documentation')){
        filepath = (__dirname + '/documentation.html');
    }
    else{
        filepath = 'index.html';
    }

    fs.readFile(filepath, (err, data)=>{
      if(err){
        throw err;
      }


    response.writeHead(200, {'Content-type': 'text/html'});
    response.write(data);
    response.end();
});

}).listen(8080);
console.log('My Node server is listening to PORT 8080...');
