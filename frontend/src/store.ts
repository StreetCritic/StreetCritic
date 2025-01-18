import { configureStore } from "@reduxjs/toolkit";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import mapReducer from "@/features/map/mapSlice";
import appReducer from "@/features/map/appSlice";
import directionsReducer from "@/features/map/directionsSlice";
import locationReducer from "@/features/map/locationSlice";

const store = configureStore({
  reducer: {
    map: mapReducer,
    app: appReducer,
    directions: directionsReducer,
    location: locationReducer,
  },
});
export default store;

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
