const http = require('http')

http.createServer((request, response) => {
    let body = [];
    request.on('error', (error) => {
        console.log(error);
    }).on('data', (chunk) => {
        body.push(chunk.toString());
    }).on('end', () => {
        body = (Buffer.concat([Buffer.from(body.toString())])).toString();
        console.log("body:", body);
        response.setHeader("Content-type", 'text/html');
        response.setHeader("X-Foo", 'bar');
        response.writeHead(200, { 'Content-type': 'text/html' })
        response.end(`<html lang="en">
<head>
    <style>
        #container{
            width: 500px;
            height: 300px;
            display: flex;
            background-color: rgb(255,255,255);
        }
        #container #myid{
            width: 200px;
            height: 100px;
            background-color: rgb(255,0,0);
        }
        #container .c1{
            flex: 1;
            background-color: rgb(0,255,0);
        }
    </style>
</head>
<body>
    <div id="container">
        <div id="myid"></div>
        <div class="c1"></div>
    </div>
</body>
</html>`)
    })
}).listen(8088)

console.log('server started');