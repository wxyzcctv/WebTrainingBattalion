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
#container{
    width:500px;
    height:300px;
    display:flex;
}
#container #myid {
    width:200px;
}
#container .c1 {
    flex:1
}
    </style>
</head>
<body>
    <div id="container">
        <div id="myid"/>
        <div class="c1"/>
    </div>
</body>
</html>
`)
    })
}).listen(8088)

console.log('server started');