import { combineReducers } from '@reduxjs/toolkit'
import notificationsReducer from '@/app/features/notifications/notifications.slice'
import commentsOnSliceReduce from '@/app/features/comments/commentsOnSlice'

export const rootReducer = combineReducers({
  notifications: notificationsReducer,
  comments: commentsOnSliceReduce,
})

export type RootState = ReturnType<typeof rootReducer>