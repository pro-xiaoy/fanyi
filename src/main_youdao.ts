// 傻逼 有道翻译API
const sha256 = require("sha256");
const https = require("https");
const querystring = require("querystring");
import { appKey, key } from './privide'

export const translate = (words: string) => {
  let from, to
  let salt = new Date().getTime();
  let curTime = Math.round(new Date().getTime() / 1000);
  let query = words;
  let str1 = appKey + truncate(query) + salt + curTime + key;
  let sign = sha256(str1);

  if (/[a-zA-Z]/.test(words[0])) {
    from = "en";
    to = "zh-CHS";
  } else {
    from = "zh-CHS";
    to = "en";
  }
  let queryparams: string = querystring.stringify({
    q: encodeURI(query),
    appKey: appKey,
    salt: salt,
    from,
    to,
    sign: sign,
    signType: "v3",
    curtime: curTime,
  });
  const options = {
    hostname: "openapi.youdao.com",
    // hostname: 'fanyi-api.baidu.com',
    port: '443',
    path: `/api?${queryparams}`,
    // path: `/api/trans/vip/translate?${queryparams}`,
    method: "GET",

  };

  const req = https.request(options, (res: any) => {
    let chunks: Buffer[] = []
    res.on("data", (chunk: Buffer) => {
      chunks.push(chunk)
    });
    res.on('end', () => {
      const string = Buffer.concat(chunks).toString()
      const object = JSON.parse(string)
      console.log('dist++++', object);
    })
  });

  req.on("error", (e: any) => {
    console.error("err+++", e);
  });
  req.end();
};
function truncate(q: string) {
  var len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}
