import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Role = "specialist" | "senior_specialist";

const LS_KEY = "gh_role";

const initialState: { role: Role } = {
  role: (localStorage.getItem(LS_KEY) as Role) || "specialist",
};

const slice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole(state, action: PayloadAction<Role>) {
      state.role = action.payload;
      localStorage.setItem(LS_KEY, action.payload);
    },
  },
});

export const { setRole } = slice.actions;
export const roleReducer = slice.reducer;
