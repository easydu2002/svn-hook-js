
interface Project {

  name: string
  remoteBuild: string
  token: string
  secret: string
}

export interface Config {

  repositoryRoot?: string

  list: Project[]
}

export {}
