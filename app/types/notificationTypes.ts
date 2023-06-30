import { ReactNode } from "react"

export type NotificationTypes = 'success' | 'error' | 'warning' | 'info'

export type NotificationType = {
  /**
   * The notification id.
   */
  id: string

  /**
   * The message of the notification
   */
  message: string

  /**
   * An optional dismiss duration time
   *
   * @default 6000
   */
  autoHideDuration?: number

  /**
   * The type of notification to show.
   */
  type?: NotificationTypes

  /**
   * Optional callback function to run side effects after the notification has closed.
   */
  onClose?: () => void

  /**
   * Optionally add an action to the notification through a ReactNode
   */
  action?: ReactNode
}