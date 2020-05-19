const https = require("https");
const md5 = require('md5')
const querystring = require("querystring");
import { appid, appSected } from './privide'

type errorMapType = {
  [k: string]: string
}
const errorMap: errorMapType = {
  '52001': '请求超时',
  '52002': '系统错误',
  '52003': '未授权用户',
  '54003': '访问频率受限制',
  '58002': '服务器关闭',
}

export const translate = (words: string) => {
  let from, to
  const salt = Math.random()
  const sign = md5(appid + words + salt + appSected);

  if (/[a-zA-Z]/.test(words[0])) {
    from = "en";
    to = "zh";
  } else {
    from = "zh";
    to = "en";
  }
  let queryparams: string = querystring.stringify({
    q: words.toString(),
    from,
    to,
    appid,
    salt,
    sign
  });
  const options = {
    hostname: "fanyi-api.baidu.com",
    port: '443',
    path: `/api/trans/vip/translate?${queryparams}`,
    method: "GET",

  };

  const req = https.request(options, (res: any) => {
    let chunks: Buffer[] = []
    res.on("data", (chunk: Buffer) => {
      chunks.push(chunk)
    });
    res.on('end', () => {
      const string = Buffer.concat(chunks).toString()
      type BaiduResult = {
        error_code?: string;
        error_msg?: string;
        from: string;
        to: string;
        trans_result: { src: string; dst: string; }[]
      }
      const object: BaiduResult = JSON.parse(string)
      if (object.error_code) {
        console.log(errorMap[object.error_code] || '异常错误');
      } else {
        object.trans_result.map(obj => {
          console.log(obj.dst);
        });
      }
    })
  });

  req.on("error", (e: any) => {
    console.error("err+++", e);
  });
  req.end();
};

