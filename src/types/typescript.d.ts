interface Window {
  typescript: {
    transpile(
      input: string,
      options?: {
        target?: any
        module?: any
      }
    ): string
    ScriptTarget: {
      ES2015: any
    }
    ModuleKind: {
      None: any
    }
  }
}
