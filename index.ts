import fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

import { plugin } from './libs/douyin'

const server = fastify().withTypeProvider<TypeBoxTypeProvider>()

server.register(plugin)

server.listen({ port: 28121 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
