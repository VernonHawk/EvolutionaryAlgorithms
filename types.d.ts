declare module 'hot-formula-parser' {
  export class Parser {
    parse: <T>(formula: string) => T
    on: (
      event: 'callCellValue',
      handler: (
        cellCoord: {
          label: string
          row: {index: number; label: string; isAbsolute: boolean}
          column: {index: number; label: string; isAbsolute: boolean}
        },
        done: <T>(res: T) => void,
      ) => void,
    ) => void
  }
}
