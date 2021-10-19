const http = require('http')
const server = http.createServer()
server.on('request', require('twikoo-vercel'))
server.listen(8080, function () {
  console.log('Twikoo function started on port 8080')
})
