
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LawyerState {
  id: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
  role: "lawyer" | null;
  hasSubmittedVerification: boolean;
}

const initialState: LawyerState = {
  id: null,
  email: null,
  name: null,
  phone: null,
  role: null,
  hasSubmittedVerification: false,
};

const lawyerSlice = createSlice({
  name: "lawyer",
  initialState,
  reducers: {
    setLawyerData: (state, action: PayloadAction<LawyerState>) => {
      return { ...action.payload };
    },
    clearLawyerData: () => initialState
  }
});

export const { setLawyerData, clearLawyerData } = lawyerSlice.actions;
export default lawyerSlice.reducer;
