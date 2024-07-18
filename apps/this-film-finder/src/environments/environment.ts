import { isDevMode } from "@angular/core";
import { provideStoreDevtools } from "@ngrx/store-devtools";

export const environment = {
  moviesApiBaseUrl: 'https://0kadddxyh3.execute-api.us-east-1.amazonaws.com',
  providers: [
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: false,
    }),
  ],
};