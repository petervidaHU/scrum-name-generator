import { Toast } from 'flowbite-react';
import { NotificationType } from '../../types/notificationTypes';
import { FunctionComponent, useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks'
import { dismissNotification } from '../../features/notifications/notifications.slice';

type NotificationProps = {
  notif: NotificationType,
}

export const Notification: FunctionComponent<NotificationProps> = ({ notif }): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(dismissNotification(notif.id))
    }, notif.autoHideDuration || 6000);

    return () => {
      clearTimeout(timer);
      dispatch(dismissNotification(notif.id));
    }
  }, [dispatch, notif.autoHideDuration, notif.id])

  return (
    <Toast className="bg-red-500">
      <div>
        {notif.message}
      </div>
      <Toast.Toggle />
    </Toast>
  )
}
