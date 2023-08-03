import fastify from 'fastify'
import { plugin } from './libs/douyin'

const server = fastify()

server.register(plugin)

server.listen({ port: 28121 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
