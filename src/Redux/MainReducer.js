import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "main",
  initialState: {
    value: 0,
    currentIntervention:"",
    authenticated: JSON.parse(sessionStorage.getItem("isLogged")),
    currentUser:JSON.parse(sessionStorage.getItem("currentUser")),
    auth:{
      current:null
    },
    intervention: {
      listeInterventions: [
      ]
    },
    chambre:{
      listeInterventions:[
        {
        id: 1,
        NumeroChambre: 120,
        RoomGroup:"Etage A1",
        Comment: "comment 19 -1",
        Status: "error",
        Employee:"Sofia.D"
      }]
    },
    hotel: {
      currentHotel: {
        id: 1,
        name: "La part-Dieu",
        image:
          "https://pix10.agoda.net/hotelImages/5043346/-1/c489e0e38444ad6e31453efb5d732e7f.jpg?s=1024x768"
      },
      listHotels: []
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
    },
    setCurrentIntervention : (state, action) =>{
      state.currentIntervention = action.payload
    },
    setCurrentUser : (state, action) =>{
      state.currentUser = action.payload
      sessionStorage.setItem("currentUser", JSON.stringify(action.payload) )    
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
  setAuthenticated,
  setCurrentIntervention,
  setCurrentUser
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
export const selectChambreInterventions = state =>
  state.main.chambre.listeInterventions;
export const getIsAuth = state=>state.main.authenticated;
export const selectCurrentIntervention = state => state.main.currentIntervention
export const selectCurrentUser = state => state.main.currentUser


export default slice.reducer;
