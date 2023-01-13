const {decode}= require('iconv-lite');
const { exec } = require('child_process')
return new Promise((resolve, reject) => {
  return exec(`svnlook info d:\\Repositories\\qingdao-rfb-pds-web`,{ encoding: 'buffer' }, (err, stdout) => {
    console.log(decode(stdout, 'cp936'))
  })
})