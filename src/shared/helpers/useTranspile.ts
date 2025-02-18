import * as ts from 'typescript'

export const useTranspile = (code: string): string => {
  try {
    const result = ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.CommonJS
      }
    })
    return result.outputText
  } catch (e) {
    throw new Error((e as string) || 'Error transpile')
  }
}
