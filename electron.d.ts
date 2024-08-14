// This is a TypeScript declaration file, it can be used to augment existing interfaces

export interface IElectronAPI {
    loadPreferences: () => Promise<void>,
    openFile: () => Promise<void>,
    nodeV: () => Promise<string>,
    chromeV: () => Promise<string>,
    electronV: () => Promise<string>,
    queryDb: <T>(db: string, collection: string, query: {}) => Promise<T[]>,
    insertOneDb: (db: string, collection: string, query: {}, data: {}) => Promise<void>,
    launchModal: (url: string) => Promise<void>
  }
  
  declare global {
    interface Window {
      electron: IElectronAPI
    }
  }