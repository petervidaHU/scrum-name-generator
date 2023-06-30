import React from 'react'
import { useNotifications } from '@/app/features/notifications/notifications.slice'
import { Notification } from './notification';

export const NoteList = () => {
  const notifications = useNotifications()
  console.log('notifications in notelist: ', notifications);
  return (
    <div className="fixed bottom-20 left-20 z-50 p-4" style={{bottom: '2rem', left: '2rem'}} >
      {notifications.map((notification) => (
        <Notification key={notification.id} notif={notification} />
      ))}
    </div>
  )
}
