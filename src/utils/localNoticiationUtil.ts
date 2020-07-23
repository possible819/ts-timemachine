declare global {
  interface Window {
    LocalNotification: {
      addNotification: (
        title: string,
        subtitle: string,
        message: string,
        hour: number,
        minute: number,
        successCallback: () => void,
        errorCallback: (error: Error) => void
      ) => void
      clearNotification: (
        successCallback: () => void,
        errorCallback: (error: Error) => void
      ) => void
    }
  }
}

export class LocalNotificationUtil {
  public addNotification(
    title: string,
    subtitle: string,
    message: string,
    hour: number,
    minute: number,
    successCallback: () => void,
    errorCallback: (error: Error) => void
  ): void {
    if ('LocalNotification' in window) {
      window.LocalNotification.addNotification(
        title,
        subtitle,
        message,
        hour,
        minute,
        successCallback,
        errorCallback
      )
    } else {
      throw new Error('LocalNotificaion is not exists.')
    }
  }

  public clearNotification(
    successCallback: () => void,
    errorCallback: (error: Error) => void
  ): void {
    if ('LocalNotification' in window) {
      window.LocalNotification.clearNotification(successCallback, errorCallback)
    } else {
      throw new Error('LocalNotificaion is not exists.')
    }
  }
}
