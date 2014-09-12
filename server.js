/**
 * sss.js - Steve's Secret Server
 *
 * This is a simple HTTP-server which is designed to serve JSON
 * secrets to clients, which are only available via the client
 * IP.
 *
 * For example the host 1.2.3.4 might wish to request the secret
 * data with the name "example".
 *
 * This would result in the server returning the contents of the
 * directory ./secrets/1.2.3.4/example.json
 *
 * We attempt to avoid malicious requests and don't leak content
 * to other remote IP addresses
 *
 *
 */

var http = require('http');
var path = require('path');
var fs   = require('fs');



//
// Create a HTTP server.
//
var httpd = http.createServer(function (req, res)
{
    var ip  = req.connection.remoteAddress;
    var url = req.url;

    //
    //  Look for null byte
    //
    if (url.indexOf('\0') !== -1) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('poison NULL-byte');
        return;
    }

    //
    //  Ensure there is no path traversal
    //
    var fn = path.join( "secrets/", ip + url + ".json" );
    console.log( "FN:" + fn );
    if (fn.indexOf("secrets/") !== 0) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('PATH traversal');
        return;
    }

    //
    //  Look for the request-file, via a stat.
    //
    fs.stat(fn, function(err, stats) {
        if (err)
        {
            console.log( "404/403 - IP:" + ip + " requesting " + fn );

            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('missing/permission denied');
            return;
        }

        //
        //  Serve
        //
        fs.readFile(fn,function(err,data){
            console.log( "OK - IP:" + ip + " requesting " + path );
            res.end(data);
        });

    });
});;


//
// Launch it.
//
httpd.listen(31337, '127.0.0.1');