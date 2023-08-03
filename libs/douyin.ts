import type { FastifyPluginAsync } from 'fastify'
import { Static, Type } from '@sinclair/typebox'

import { getXBogus } from './webmssdk'

export const ErrorReply = Type.Object({
  error: Type.String(),
})
export type ErrorReplyType = Static<typeof ErrorReply>

export const RequestXBogusBody = Type.Object({
  payload: Type.String(),
  userAgent: Type.String(),
})
export type RequestXBogusBodyType = Static<typeof RequestXBogusBody>

const XBogusReply = Type.Object({
  token: Type.String(),
})
export type XBogusReplyType = Static<typeof XBogusReply>

export const plugin: FastifyPluginAsync = async (fastify, opts) => {
  const requestXBogusSchema = {
    body: RequestXBogusBody,
    response: {
      200: XBogusReply,
      '4xx': ErrorReply,
    },
  }

  fastify.post<{
    Body: RequestXBogusBodyType,
    Reply: {
      200: XBogusReplyType,
      '4xx': ErrorReplyType,
    },
  }>('/token/x-bogus', { schema: requestXBogusSchema }, async (request, reply) => {
    const { payload, userAgent } = request.body

    try {
      const decodedPayload = Buffer.from(payload, 'base64').toString()
      const decodedUserAgent = Buffer.from(userAgent, 'base64').toString()

      const token = getXBogus(decodedPayload, decodedUserAgent)

      reply.code(200).send({ token })
    } catch (err: any) {
      reply.code(400).send({ error: err.message })
    }
  })
}
