import { SerializedError } from "@reduxjs/toolkit";

type initialStateType = {
  isLoading: boolean;
  isError: boolean;
  response: any | null;
  errorResponse: SerializedError | any | null;
};

export const initialStateApi: initialStateType = {
  isLoading: false,
  isError: false,
  response: null,
  errorResponse: null,
};
