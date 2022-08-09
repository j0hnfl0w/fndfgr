export const useLogger = (id: string): any => {
  return {
    log(...msg: any[]) {
      console.log(`[${id}]`, ...msg)
    },
  }
}
