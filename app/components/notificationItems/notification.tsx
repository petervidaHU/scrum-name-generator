import { Toast } from 'flowbite-react';
import { NotificationType, NotificationVariantTypes } from '../../types/notificationTypes';
import { FunctionComponent, useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks'
import { dismissNotification } from '../../features/notifications/notifications.slice';

type NotificationProps = {
  notif: NotificationType,
}

const notificationVariants: Record<NotificationVariantTypes, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-yellow-500',
  warning: 'bg-yellow-300',
}

export const Notification: FunctionComponent<NotificationProps> = ({
  notif: {
    message,
    type = 'info',
    id,
    autoHideDuration = 6000,
  }
}): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(dismissNotification(id))
    }, autoHideDuration);

    return () => {
      clearTimeout(timer);
      dispatch(dismissNotification(id));
    }
  }, [dispatch, autoHideDuration, id])

  return (
    <Toast className={notificationVariants[type]}>
      <div>
        {message}
      </div>
      <Toast.Toggle />
    </Toast>
  )
}
