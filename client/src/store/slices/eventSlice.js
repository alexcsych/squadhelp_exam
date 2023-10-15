import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const eventSlice = createSlice({
  name: 'events',
  initialState: { events: [] },
  reducers: {
    createEvent (state, action) {
      state.events.push({
        ...action.payload,
        createdAt: new Date().toISOString(),
        progress: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        id: uuidv4(),
        isNotify: true,
        isFinished: false,
      });
    },
    deleteEvent (state, action) {
      state.events = state.events.filter(e => e.id !== action.payload);
    },
    updateEventProgress (state, action) {
      const updatedEvents = action.payload;
      state.events = updatedEvents;
    },
  },
});

const { reducer, actions } = eventSlice;

export const { createEvent, deleteEvent, updateEventProgress } = actions;

export default reducer;
