import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  items: Note[];
}

const initialState: NotesState = {
  items: [],
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      state.items.push(action.payload);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.items.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(note => note.id !== action.payload);
    },
  },
});

export const { addNote, updateNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;