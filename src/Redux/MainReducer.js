import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "main",
  initialState: {
    value: 0,
    authenticated: JSON.parse(sessionStorage.getItem("isLogged")),
    auth: {
      isLogged: false,
      lastLoginDate: null,
      currentUser: null
    },
    intervention: {
      listeInterventions: [
        {
          id: 1,
          dateTime: "2019-12-11 10:12:00",
          comment: "comment 19 -1",
          active: false,
          status: "error"
        },
        {
          id: 2,
          dateTime: "2019-12-12 12:00:00",
          comment: "comment 19-2",
          active: false,
          status: "success"
        },
        {
          id: 3,
          dateTime: "2020-01-2 12:30:00",
          comment: "comment 2020 -1",
          active: true,
          status: "default"
        },
        {
          id: 4,
          dateTime: "2020-01-4 12:30:00",
          comment: "comment 2020 -2",
          active: false,
          status: "default"
        },
        {
          id: 5,
          dateTime: "2020-01-8 12:30:00",
          comment: "comment 2020 -3",
          active: false,
          status: "error"
        },
        {
          id: 6,
          dateTime: "2020-01-12 11:30:00",
          comment: "comment 2020 -4",
          active: false,
          status: "error"
        },
        {
          id: 7,
          dateTime: "2020-01-22 11:30:00",
          comment: "comment 2020 -5",
          active: false,
          status: "error"
        },
        {
          id: 8,
          dateTime: "2020-02-02 11:30:00",
          comment: "comment 2020 -6",
          active: true,
          status: "success"
        },
        {
          id: 9,
          dateTime: "2020-02-19 11:30:00",
          comment: "comment 2020 -7",
          active: true,
          status: "error"
        }
      ]
    },
    hotel: {
      currentHotel: {
        id: 1,
        name: "La part-Dieu",
        image:
          "https://pix10.agoda.net/hotelImages/5043346/-1/c489e0e38444ad6e31453efb5d732e7f.jpg?s=1024x768"
      },
      listHotels: [
        {
          id: 1,
          name: "La part-Dieu",
          image:
            "https://pix10.agoda.net/hotelImages/5043346/-1/c489e0e38444ad6e31453efb5d732e7f.jpg?s=1024x768"
        },
        {
          id: 2,
          name: "Hotel Salam",
          image:
            "https://d1rioy1v9s51jr.cloudfront.net/pics/1757/450x270/hotel-icon-7-icon-and-club-36-king-room---city-view_5938.jpg"
        }
      ]
    }
  },
  reducers: {
    increment: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
      state.isLogged = true;
    },
    decrement: state => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    setAuthenticated :state=> {
      state.authenticated = true
      sessionStorage.setItem("isLogged", "true")
    },
    setCurrentHotel: (state, action) => {
      state.hotel.currentHotel = action.payload;
    },
    setListeInterventions: (state, action) => {
      state.intervention.listeInterventions = action.payload;
    },
    setLogged: state => {
      console.log("Reducer here ")
      state.auth.isLogged = true;
      state.isLogged = true;
    },
    setLoggedOut: (state) => {
      state.authenticated = false
      sessionStorage.setItem("isLogged", "false")
    }
  }
});

export const {
  increment,
  decrement,
  incrementByAmount,
  setCurrentHotel,
  setListeInterventions,
  setLogged,
  setLoggedOut,
  setAuthenticated
} = slice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const incrementAsync = amount => dispatch => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount));
  }, 1000);
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCount = state => state.main.value;
export const selectAuth = state => state.main.auth;
export const selectAuthLogged = state => state.main.isLogged;
export const selectHotels = state => state.main.hotel.listHotels;
export const selectCurrentHotel = state => state.main.hotel.currentHotel;
export const selectInterventions = state =>
  state.main.intervention.listeInterventions;
export const getIsAuth = state=>state.main.authenticated;


export default slice.reducer;
