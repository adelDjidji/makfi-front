import { configureStore } from '@reduxjs/toolkit';
import mainReducer from './MainReducer';

export default configureStore({
  reducer: {
    main: mainReducer,
  },
});
