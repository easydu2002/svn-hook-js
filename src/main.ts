
const [, TYPE, REPOS, REV, , INFO] = process.argv.slice(1)

function main (): void {
  switch (TYPE) {
    case '--init':
      break
    default: {
      // : [
      //   '代码更新:',
      //   `@${author}: ${date}`,
      //   '更新内容:',
      //   log
      // ].join('\n')
      // const [_, HOOK_TYPE, REPOS, REV, TXN_NAME, INFO] = process.argv.slice(1)
    }
  }
}

main()

export { main }
