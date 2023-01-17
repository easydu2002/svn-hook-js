import { Config } from './types'

export const config: Config | {} = {}

export function load (): void {
  Object.assign(config, {})
}
