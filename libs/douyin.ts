import axios from 'axios'
import type { AxiosInstance } from 'axios'
import querystring from 'node:querystring'
import type { FastifyPluginAsync } from 'fastify'

import { getXBogus } from './webmssdk'

class DouyinAPI {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: 'https://www.douyin.com',
      timeout: 1000 * 60 * 5,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
    })
  }

  async getUserVideos(secUserId: string, cursor: number = 0) {
    const params = {
      device_platform: 'webapp',
      aid: 6383,
      channel: 'channel_pc_web',
      sec_user_id: secUserId,
      max_cursor: cursor,
      locate_item_id: '7257823063406808375',
      locate_query: false,
      show_live_replay_strategy: 1,
      count: 18,
      publish_video_strategy_type: 2,
      pc_client_type: 1,
      version_code: 170400,
      version_name: '17.4.0',
      cookie_enabled: true,
      screen_width: 3440,
      screen_height: 1440,
      browser_language: 'zh-CN',
      browser_platform: 'MacIntel',
      browser_name: 'Chrome',
      browser_version: '115.0.0.0',
      browser_online: true,
      engine_name: 'Blink',
      engine_version: '115.0.0.0',
      os_name: 'Mac OS',
      os_version: '10.15.7',
      cpu_core_num: 8,
      device_memory: 8,
      platform: 'PC',
      downlink: 10,
      effective_type: '4g',
      round_trip_time: 200,
      webid: '7247355350676080161',
      msToken: '',
    }
    const qstring = querystring.stringify(params)
    const xBogus = getXBogus(qstring)
    const url = `/aweme/v1/web/aweme/post/?${qstring}&X-Bogus=${xBogus}`

    const res = await this.api.get(url, {
      headers: {
        'Referer': `https://www.douyin.com/user/${secUserId}?vid=7257823063406808375`
      }
    })
    // const JSON.parse(res.data)
    console.log(res.data)
  }
}

interface GetXBogusQuerystring {
  payload: string
}

interface GetXBogusReply {
  200: { token: string }
  '4xx': { error: string }
}

interface GetUserVideosQuerystring {
  secUserId: string
  cursor: number
}

export const plugin: FastifyPluginAsync = async (fastify, opts) => {
  const douyinAPI = new DouyinAPI()

  fastify.get<{
    Querystring: GetXBogusQuerystring
  }>('/token/x-bogus', async (request, reply) => {
    const { payload } = request.query

    try {
      const decodedPayload = Buffer.from(payload, 'base64').toString()
      const token = getXBogus(decodedPayload)
      reply.send({ token })
    } catch (err: any) {
      reply.code(400).send({ error: err.message })
    }
  })

  fastify.get<{
    Querystring: GetUserVideosQuerystring
  }>('/aweme/v1/web/aweme/post/', async (request, reply) => {
    const { secUserId, cursor = 0 } = request.query

    await douyinAPI.getUserVideos(secUserId, cursor)

    reply.send({ hello: 'world' })
  })
}

export default DouyinAPI
