/**
 * Resolver for unplugin-vue-components.
 * Enables auto-import of Ousi UI components without manual imports.
 */
export interface OusiResolverOptions {
  /** Prefix to match component names. Defaults to 'O'. */
  prefix?: string
}

export function OusiResolver(options: OusiResolverOptions = {}) {
  const { prefix = 'O' } = options

  return {
    type: 'component' as const,
    resolve(name: string) {
      if (name.startsWith(prefix)) {
        const componentName = name.slice(prefix.length).toLowerCase()
        return {
          name: `O${name.slice(prefix.length)}`,
          from: '@ousi-ui/vue',
        }
      }
    },
  }
}
