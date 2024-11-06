import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from "@/store"

export type MapState = {
    // Map center.
    center: { lng: number, lat: number };

    // Map zoom (integer).
    zoom: number;
}

const initialState : MapState = {
    center: { lng: 8.684966, lat: 50.110573 },
    zoom: 14,
};

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        // Updates the map center.
        centerUpdated: (state, action: PayloadAction<{ lng: number; lat: number }>) => {
            state.center.lng = action.payload.lng;
            state.center.lat = action.payload.lat;
        },

        // Updates the map zoom (rounds to integer first).
        zoomUpdated: (state, action: PayloadAction<number>) => {
            state.zoom = action.payload;
        }
    },
});

export const { centerUpdated, zoomUpdated } = mapSlice.actions
export const selectMapState = (state: RootState) => state.map
export default mapSlice.reducer
