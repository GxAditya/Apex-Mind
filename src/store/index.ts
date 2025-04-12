import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import tasksReducer from './slices/tasksSlice';
import timerReducer from './slices/timerSlice';
import themeReducer from './slices/themeSlice';
import notesReducer from './slices/notesSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['tasks', 'theme', 'notes', 'timer'], // Add timer to the whitelist
};

const rootReducer = combineReducers({
  tasks: tasksReducer,
  timer: timerReducer,
  theme: themeReducer,
  notes: notesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;