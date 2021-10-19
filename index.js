const http = require('http')
const twikoo = require('twikoo-vercel')
const server = http.createServer()
server.on('request', function (request, response) {
  // 兼容 Vercel
  response.status = function (code) {
    this.statusCode = code
    return this
  }
  response.json = function (json) {
    this.writeHead(200, { 'Content-Type': 'application/json' })
    this.end(JSON.stringify(json))
    return this
  }
  twikoo(request, response)
})
server.listen(8080, function () {
  console.log('Twikoo function started on port 8080')
})
