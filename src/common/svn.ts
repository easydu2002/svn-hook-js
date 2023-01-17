import { exec } from 'child_process'
import { decode } from 'iconv-lite'

type SVNInfo = [string, string, string, string]

export async function getSVNInfo (project: string, version?: string): Promise<SVNInfo> {
  return await new Promise((resolve, reject) => {
    return exec(`svnlook info ${project} ${version !== undefined ? `-r ${version}` : ''}`, { encoding: 'buffer' }, (err, stdout) => { (err != null) ? reject(decode(stdout, 'cp936')) : resolve(decode(stdout, 'cp936').split('\n') as SVNInfo) })
  })
}
