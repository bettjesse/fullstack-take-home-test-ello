import { configureStore}from "@reduxjs/toolkit"
import readingListReducer from "./slices/readingList";


 export const store = configureStore({
    reducer:{
       
        readingList: readingListReducer
    },
   
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;