import { combineReducers } from '@reduxjs/toolkit'
import notificationsReducer from '@/app/features/notifications/notifications.slice'

export const rootReducer = combineReducers({
  notifications: notificationsReducer,
})