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
        response.writeHead(200, { 'Content-type': 'text/html' })
        response.end(`<html maaa=a>
<head>
    <style>
body div #myid{
    width:100px;
    backgorund-color: #ff5000;
}
body div img{
    width:30px;
    backgorund-color: #ff1111;
}   
    </style>
</head>
<body>
    <div>
        <img id="myid" />
        <img />
    </div>
</body>
</html>
`)
    })
}).listen(8088)

console.log('server started');