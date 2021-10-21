const http = require('http')
const twikoo = require('twikoo-vercel')
const server = http.createServer()

class LimitPromise {
  constructor (max) {
    this._max = max
    this._count = 0
    this._taskQueue = []
  }
  call (caller, ...args) {
    return new Promise((resolve, reject) => {
      const task = this._createTask(caller, args, resolve, reject)
      if (this._count >= this._max) {
        this._taskQueue.push(task)
      } else {
        task()
      }
    })
  }
  _createTask (caller, args, resolve, reject) {
    return () => {
      caller(...args)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this._count--
          if (this._taskQueue.length) {
            let task = this._taskQueue.shift()
            task()
          }
        })
      this._count++
    }
  }
}

const limitPromise = new LimitPromise(1)

server.on('request', function (request, response) {
  return limitPromise.call(async function (request, response) {
    // 兼容 Vercel
    try {
      const buffers = []
      for await (const chunk of request) {
        buffers.push(chunk)
      }
      request.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch (e) {
      console.error(e)
    }
    response.status = function (code) {
      this.statusCode = code
      return this
    }
    response.json = function (json) {
      if (!response.writableEnded) {
        this.writeHead(200, { 'Content-Type': 'application/json' })
        this.end(JSON.stringify(json))
      }
      return this
    }
    return await twikoo(request, response)
  }, request, response)
})

server.listen(8080, function () {
  console.log('Twikoo function started on port 8080')
})
