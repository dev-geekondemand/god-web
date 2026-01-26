import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/seeker/seekerSlice';
import  categoryReducer  from '../features/category/categorySlice';
import geekReducer from '../features/geek/geekSlice';
import brandsReducer from '../features/brands/brandsSlice';
import serviceReducer from '../features/service/serviceSlice';
import requestSlice from '../features/request/requestSlice';
import loaderSlice from '../features/loader/loaderSlice'
import mediaSlice from '../features/media/mediaSlice';
import blogSlice from '../features/blogs/blogSlice';
import enquirySlice from '../features/enquiry/enquirySlice';
import locationReducer from '../features/locationSlice.ts';

export const makeStore = () =>
  configureStore({
    reducer: {
      seeker: userReducer,
      category: categoryReducer,
      geek: geekReducer,
      brand: brandsReducer,
      service:serviceReducer,
      request: requestSlice,
      loader:loaderSlice,
      media:mediaSlice,
      blog:blogSlice,
      enquiry: enquirySlice,
      location: locationReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
