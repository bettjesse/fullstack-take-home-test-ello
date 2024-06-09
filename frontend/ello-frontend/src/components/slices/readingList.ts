// // readingListSlice.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface Book {
//   author: string;
//   title: string;
//   readingLevel: string;
//   coverPhotoURL: string;
// }

// interface ReadingListState {
//   books: Book[];
// }

// const initialState: ReadingListState = {
//   books: [],
// };

// const readingListSlice = createSlice({
//   name: 'readingList',
//   initialState,
//   reducers: {
//     addBook(state, action: PayloadAction<Book>) {
//       state.books.push(action.payload);
//     },
//     removeBook(state, action: PayloadAction<string>) {
//       state.books = state.books.filter(book => book.title !== action.payload);
//     },
//   },
// });

// export const { addBook, removeBook } = readingListSlice.actions;
// export default readingListSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Book {
  author: string;
  title: string;
  readingLevel: string;
  coverPhotoURL: string;
}

interface ReadingListState {
  books: Book[];
}

const initialState: ReadingListState = {
  books: [],
};

const readingListSlice = createSlice({
  name: 'readingList',
  initialState,
  reducers: {
    addBook(state, action: PayloadAction<Book>) {
      const { title } = action.payload;
      // Check if the book with the same title already exists
      const existingBook = state.books.find(book => book.title === title);
      // If the book doesn't exist, add it to the list
      if (!existingBook) {
        state.books.push(action.payload);
      }
    },
    removeBook(state, action: PayloadAction<string>) {
      state.books = state.books.filter(book => book.title !== action.payload);
    },
  },
});

export const { addBook, removeBook } = readingListSlice.actions;
export default readingListSlice.reducer;
