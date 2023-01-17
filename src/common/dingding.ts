import { request } from 'https'
import { createHmac } from 'crypto'
import { encode } from 'iconv-lite'
import { getSVNInfo } from './svn'

interface DingDing {
  timestamp: number
  sign: string
}

function generateDingDingParams (secret: string): DingDing {
  const timestamp = Date.now()
  const hmac = createHmac('sha256', encode(secret, 'utf-8'))
  const sign = encodeURI(hmac.update(`${timestamp}\n${secret}`).digest('base64'))

  return { timestamp, sign }
}

export async function sendDingDing (content: string, options: {
  token: string
  secret: string
}) {
  const [author, date, , log] = await getSVNInfo('1')

  const { timestamp, sign } = generateDingDingParams(options.secret)

  const client = request({
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    host: 'oapi.dingtalk.com',
    port: 443,
    path: `/robot/send?access_token=${options.token}&timestamp=${timestamp}&sign=${sign}`
  })
  const requestBody = JSON.stringify({
    msgtype: 'text',
    text: {
      content
    }
  })
  client.write(requestBody)
  client.end()
}
