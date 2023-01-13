// #python 3.8
// import time
// import hmac
// import hashlib
// import base64
// import urllib.parse
// timestamp = str(round(time.time() * 1000))
// secret = 'SECe5da68c2a76d2cf738a387105ad40df43d6b3b333a00b90289097c1c4fc3dd6d'
// secret_enc = secret.encode('utf-8')
// string_to_sign = '{}\n{}'.format(timestamp, secret)
// string_to_sign_enc = string_to_sign.encode('utf-8')
// hmac_code = hmac.new(secret_enc, string_to_sign_enc, digestmod=hashlib.sha256).digest()
// sign = urllib.parse.quote_plus(base64.b64encode(hmac_code))
// print(timestamp)
// print(sign)

const { decode, encode }= require('iconv-lite')

const config = {
  access_token: '1a1e54061bdbfb4ee243ddd5b5f4aa13abbc69219b45f73e8a7e61af72fb0307',
  secret: 'SECe5da68c2a76d2cf738a387105ad40df43d6b3b333a00b90289097c1c4fc3dd6d'
}

function generateDingdDingParams() {

  const crypto = require('crypto')
  const secret = config.secret
  const timestamp = Date.now()
  const hmac = crypto.createHmac('sha256', encode(secret, 'utf-8'))
  const sign = encodeURI(hmac.update(`${timestamp}\n${secret}`).digest('base64'))

  return { timestamp, sign }
}

/**
 * 获取svn最近一次提交信息
 * @author Du DuQingsong
 */
function getLastSVNInfo(project) {
  
  const { exec } = require('child_process')
  return new Promise((resolve, reject) => {
    return exec(`svnlook info ${project}`,{ encoding: 'buffer' } ,(err, stdout) => err ? reject(decode(stdout, 'cp936')) : resolve(decode(stdout, 'cp936')))
  })
}

/**
 * 通知钉钉
 * @author Du DuQingsong
 */
async function sendDingding(INFO) {

  console.log(REPOS.includes(':') ? REPOS : `d:${REPOS}` )
  const [author, date, logSize, log] = (await getLastSVNInfo(REPOS.includes(':') ? REPOS : `d:${REPOS}` )).split('\n')

  const { timestamp, sign } = generateDingdDingParams()
  
  const { request } = require('https')
  const client = request({
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    host: 'oapi.dingtalk.com',
    port: 443,
    path: `/robot/send?access_token=${config.access_token}&timestamp=${timestamp}&sign=${sign}`,
  })
  const requestBody = JSON.stringify({ 
    "msgtype": "text", 
    "text": { 
      "content": [
        "代码更新:",
        `@${author}: ${date}`,
        "更新内容:",
        log
      ].join('\n')
    } 
  })
  client.write(requestBody)
  client.end()
}

function publish(token) {
  const { request } = require('http')
  const client = request({
    method: 'get',
    host: '192.168.0.189',
    port: 20000,
    path: '/job/qingdao-shinan/build?token=qingdaoshinan',
    auth: 'admin:11d50b80fa9894a8e6de4d403ca998c085'
  })
  client.end()
}

/**
 * svn 统一钩子处理
 * @author DuQingsong
 * @date 2023/1/12
 */
const [_, HOOK_TYPE, REPOS, REV, TXN_NAME, INFO] = process.argv.slice(1)

switch (HOOK_TYPE) {
  case 'post-commit': {
    publish()
    break
  }
  case 'success': {
    sendDingding()
    break
  }
}