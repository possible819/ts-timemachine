import { File, Server } from '../constants'

declare global {
  interface Window {
    cordova: {
      platformId: string
      file: any
    }
    resolveLocalFileSystemURL: any
  }
}

const enum Platforms {
  Android,
  iOS,
  Other,
}

export class FileTransferUtil {
  private isMobileAvailable: boolean = false
  private platform: Platforms
  private intialized: boolean = false

  constructor() {
    this.isMobileAvailable = this.checkAvailability()
    this.platform = this.getCurrentPlatform()
  }

  private checkAvailability(): boolean {
    return 'cordova' in window && 'file' in window.cordova
  }

  private getCurrentPlatform(): Platforms {
    if ('cordova' in window && 'platformId' in window.cordova) {
      return window.cordova.platformId === 'android'
        ? Platforms.Android
        : Platforms.iOS
    } else {
      return Platforms.Other
    }
  }

  private storageInitialize(): void {
    this.intialized = true
    const basePath = this.getDocumentDirectoryPath()
    let filePath = this.getFilePath()
    this.getDirEntry(basePath)
      .then((dirEntry) => {
        filePath = filePath.startsWith('/') ? filePath.substr(1) : filePath
        filePath = filePath.endsWith('/') ? filePath.slice(0, -1) : filePath
        const dirs = filePath.split('/')
        this.createDir(dirEntry, dirs, 0)
      })
      .catch((error) => {
        this.intialized = false
        console.error(error)
      })
  }

  private getDocumentDirectoryPath(): any {
    return this.platform === Platforms.Android
      ? window.cordova.file.externalRootDirectory
      : window.cordova.file.documentsDirectory
  }

  private createDir(dirEntry: any, dirs: any, index: any): void {
    dirEntry.getDirectory(dirs[index], { create: true }, (dirEntry: any) => {
      if (dirs[++index]) {
        this.createDir(dirEntry, dirs, index)
      }
    })
  }

  public readFiles(
    dirPath: string,
    callback: (fileEntries: any) => void
  ): void {
    if (this.isMobileAvailable) {
      if (!this.intialized) {
        this.storageInitialize()
      }

      this.mobileReadFiles(dirPath, callback)
    } else {
      this.webReadFiles(dirPath, callback)
    }
  }

  private mobileReadFiles(
    dirPath: string,
    callback: (fileEntries: any) => void
  ): void {
    const basePath = this.getDocumentDirectoryPath()
    const fullPath = basePath.endsWith('/')
      ? `${basePath}${dirPath}`
      : `${basePath}/${dirPath}`
    window.resolveLocalFileSystemURL(fullPath, (dirEntry: any) => {
      const reader = dirEntry.createReader()
      reader.readEntries(
        (entries: any) => {
          callback(entries)
        },
        (errorMsg: string) => {
          throw new Error(errorMsg)
        }
      )
    })
  }

  private webReadFiles(
    dirPath: string,
    callback: (fileEntries: any) => void
  ): void {
    console.log('TODO: create web based logic')
    console.log(dirPath, callback)
  }

  /**
   * @description 파일 읽기
   */
  public readFile(fileName: string, callback: (content: string) => void): void {
    if (this.isMobileAvailable) {
      if (!this.intialized) {
        this.storageInitialize()
      }
      this.mobileReadFile(fileName, callback)
    } else {
      this.webReadFile(fileName, callback)
    }
  }

  /**
   * @description 모바일 환경의 파일 읽기
   */
  private mobileReadFile(
    fileName: string,
    callback: (content: string) => void
  ): void {
    const basePath = this.getDocumentDirectoryPath().endsWith('/')
      ? this.getDocumentDirectoryPath()
      : this.getDocumentDirectoryPath() + '/'
    const filePath = this.getFilePath()
    const fullPath = `${basePath}${filePath}`

    this.getDirEntry(fullPath)
      .then((dirEntry) => this.getFileEntry(dirEntry, fileName))
      .then((fileEntry) => this.readFileAsText(fileEntry))
      .then((content: any) => callback(content))
      .catch((error) => console.error(error))
  }

  /**
   * @description 웹 환경의 파일 읽기
   */
  private webReadFile(
    fileName: string,
    callback: (content: string) => void
  ): void {
    this.request(
      this.getReqUrl('read_file'),
      'POST',
      {
        fileName: fileName,
        filePath: this.getFilePath(),
      },
      (event: any) => {
        callback(event.currentTarget.responseText)
      }
    )
  }

  /**
   * @description 파일 쓰기
   */
  public writeFile(fileName: string, content: string): void {
    if (this.isMobileAvailable) {
      if (!this.intialized) {
        this.storageInitialize()
      }
      this.mobileWriteFile(fileName, content)
    } else {
      this.webWriteFile(fileName, content)
    }
  }

  /**
   * @description 모바일 환경의 파일 쓰기
   */
  private mobileWriteFile(fileName: string, content: string): void {
    const basePath = this.getDocumentDirectoryPath().endsWith('/')
      ? this.getDocumentDirectoryPath()
      : this.getDocumentDirectoryPath() + '/'
    const filePath = this.getFilePath()
    const fullPath = `${basePath}${filePath}`

    this.getDirEntry(fullPath)
      .then((dirEntry) => this.getFileEntry(dirEntry, fileName))
      .then((fileEntry) => this.createWriter(fileEntry))
      .then((fileWriter) =>
        this.writeContent(fileWriter, fileName, filePath, content)
      )
      .catch((error) => console.error(error))
  }

  /**
   * @description 웹 환경의 파일 쓰기
   */
  private webWriteFile(fileName: string, content: string): void {
    this.request(
      this.getReqUrl('write_file'),
      'POST',
      {
        fileName: fileName,
        content: content,
        filePath: this.getFilePath(),
      },
      (event: any) => {
        const response = JSON.parse(event.currentTarget.response)
        document.dispatchEvent(
          new CustomEvent('write-file-success', {
            detail: {
              fileName: response.fileName,
              filePath: response.filePath,
              preview: content.split('\n')[0],
            },
          })
        )
      }
    )
  }

  /**
   * @description 파일 삭제
   */
  public deleteFile(fileName: string): void {
    if (this.isMobileAvailable) {
      if (!this.intialized) {
        this.storageInitialize()
      }
      this.mobileDeleteFile(fileName)
    } else {
      this.webDeleteFile(fileName)
    }
  }

  /**
   * @description 모바일 환경의 파일 삭제
   */
  private mobileDeleteFile(fileName: string): void {
    const basePath = this.getDocumentDirectoryPath().endsWith('/')
      ? this.getDocumentDirectoryPath()
      : this.getDocumentDirectoryPath() + '/'
    const filePath = this.getFilePath()
    const fullPath = `${basePath}${filePath}`

    this.getDirEntry(fullPath)
      .then((dirEntry) => this.getFileEntry(dirEntry, fileName))
      .then((fileEntry) => this.removeFile(fileEntry, fileName))
      .catch((error) => console.error(error))
  }

  /**
   * @description 웹 환경의 파일 삭제
   */
  private webDeleteFile(fileName: string): void {
    this.request(
      this.getReqUrl('delete_file'),
      'POST',
      {
        fileName: fileName,
        filePath: this.getFilePath(),
      },
      (event: any) => {
        const response = JSON.parse(event.currentTarget.response)
        document.dispatchEvent(
          new CustomEvent('delete-file-success', {
            detail: {
              fileName: response.fileName,
            },
          })
        )
      }
    )
  }

  /**
   * @description 파일 패스를 전달 받아 native directory entry를 리턴함
   *
   * @param {String} path 파일 패스
   * @returns {Object} dirEntry native directory entry
   */
  private getDirEntry(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(
        path,
        (dirEntry: any) => resolve(dirEntry),
        (error: string) => reject(error)
      )
    })
  }

  /**
   * @description directory entry와 fileName을 통해 native file entry를 리턴함
   *
   * @param {Object} dirEntry directory entry
   * @param {String} fileName file name
   * @returns {Object} fileEntry native file entry
   */
  private getFileEntry(dirEntry: any, fileName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      dirEntry.getFile(
        fileName,
        { create: true, exclusive: false },
        (fileEntry: any) => resolve(fileEntry),
        (error: string) => reject(error)
      )
    })
  }

  /**
   * @description file entry를 전달 받아 fileWriter를 생성하고 리턴함
   *
   * @param {Object} fileEntry native fileEntry
   * @returns {Object} fileWriter native fileWriter
   */
  private createWriter(fileEntry: any): Promise<any> {
    return new Promise((resolve, reject) => {
      fileEntry.createWriter(
        (fileWriter: any) => resolve(fileWriter),
        (error: string) => reject(error)
      )
    })
  }

  /**
   * @description fileWrite를 통해 해당 파일에 content를 쓰고 성공시 write-file-success 이벤트를 발생
   *
   * @param {Object} fileWriter native file writer object
   * @param {String} fileName file name
   * @param {String} filePath file path
   * @param {String} content content
   */
  private writeContent(
    fileWriter: any,
    fileName: string,
    filePath: string,
    content: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      fileWriter.onwriteend = () => {
        document.dispatchEvent(
          new CustomEvent('write-file-success', {
            detail: {
              fileName: fileName,
              filePath: filePath,
              preview: content.split('\n')[0],
            },
          })
        )
        resolve()
      }

      fileWriter.onerror = (error: string) => {
        document.dispatchEvent(
          new CustomEvent('write-file-error', {
            detail: {
              fileName: fileName,
              filePath: filePath,
            },
          })
        )
        reject(error)
      }

      fileWriter.write(new Blob([content]), { type: 'text/plain' })
    })
  }

  /**
   * @description file entry의 파일을 text로 읽어 return
   * @param {Object} fileEntry native file entry
   */
  private readFileAsText(fileEntry: any): Promise<any> {
    return new Promise((resolve, reject) => {
      fileEntry.file((file: any) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve(reader.result)
        }

        reader.onerror = (error) => {
          reject(error)
        }

        reader.readAsText(file)
      })
    })
  }

  /**
   * @description fileEntry에서 fileName을 통해 file을 삭제
   *
   * @param {Object} fileEntry native file entry
   * @param {String} fileName remove target file name
   */
  private removeFile(fileEntry: any, fileName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fileEntry.remove(
        () => {
          document.dispatchEvent(
            new CustomEvent('delete-file-success', {
              detail: {
                fileName: fileName,
              },
            })
          )

          resolve()
        },
        (error: string) => {
          reject(error)
        }
      )
    })
  }

  private getFilePath(): string {
    let filePath: string = File.PATH
    if (!filePath.endsWith('/')) {
      filePath += '/'
    }

    return filePath
  }

  private getReqUrl(api: string): string {
    let baseUrl: string = Server.BASE_URL
    if (baseUrl.endsWith('/')) {
      // baseUrl = baseUrl.substr(0, test.length - 1)
      baseUrl = baseUrl.substr(0, baseUrl.length - 1)
    }
    if (api.startsWith('/')) {
      api = api.substr(1)
    }
    return `${baseUrl}/${api}`
  }

  private request(
    url: string,
    method: string,
    body: any,
    callback: (event: any) => void
  ): void {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    if (method.toLowerCase() === 'post' || 'put') {
      xhr.setRequestHeader('content-type', 'application/json')
    }

    xhr.onreadystatechange = (event) => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(event)
      }
    }

    if (body) {
      xhr.send(JSON.stringify(body))
    } else {
      xhr.send()
    }
  }
}
