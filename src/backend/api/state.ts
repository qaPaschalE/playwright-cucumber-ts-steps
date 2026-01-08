import { APIResponse } from "@playwright/test";

// A simple storage to hold the response between the "When" and "Then" steps
let lastResponse: APIResponse | null = null;

export const apiState = {
  setResponse: (response: APIResponse) => {
    lastResponse = response;
  },
  getResponse: () => {
    if (!lastResponse)
      throw new Error(
        "No API response found. Did you run a 'When I make a request' step first?"
      );
    return lastResponse;
  },
};
