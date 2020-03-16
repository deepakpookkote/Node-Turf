const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url;
    if(url === '/') {
        //
        res.setHeader('Content-type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Task Setup-1</title></head>');
        res.write('<body><p>Welcome to my Page</p></body>')
        res.write('</html>');
        return res.end();
    }

    if(url === '/users') {
        //
        res.setHeader('Content-type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Task Setup-1</title></head>');
        res.write('<body><ul><li>User-1</li><li>User-2</li><ul></body>')
        res.write('</html>');
        return res.end();
    }
});

server.listen(3000);