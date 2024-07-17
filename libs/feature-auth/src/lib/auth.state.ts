import {
  createActionGroup,
  createFeature,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
} from '@ngrx/store';

export type AuthStatus =
  | 'not-initialized'
  | 'loading'
  | 'token-error'
  | 'token-success'
  | 'no-token';

export type APIStatus =
  | 'not-checked'
  | 'checking'
  | 'contentful'
  | 'not-contentful';

export interface AuthState {
  apiStatus: APIStatus;
  authStatus: AuthStatus;
  mustBeRemembered: boolean;
  token: string | undefined;
  errorMessage: string;
  redirectUrl: string;
}

export const initialState: AuthState = {
  apiStatus: 'not-checked',
  authStatus: 'not-initialized',
  mustBeRemembered: false,
  token: undefined,
  errorMessage: '',
  redirectUrl: '',
};

export const AuthActions = createActionGroup({
  source: 'Main Auth State',
  events: {
    healthcheck: emptyProps(),
    healthcheckSuccess: emptyProps(),
    healthcheckFailure: props<{ error: string }>(),
    getToken: emptyProps(),
    getTokenSuccess: props<{
      token: string;
    }>(),
    getTokenFailure: props<{
      error: string;
    }>(),
    setRedirectUrl: props<{ redirectUrl: string }>(),
    // autoSetToken: emptyProps(),
    // autoSetTokenSuccess: props<{
    //   token: string;
    // }>(),
    // autoSetTokenFailure: emptyProps(),
  },
});

export const AuthFeatureState = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(AuthActions.healthcheck, (state): AuthState => {
      return {
        ...state,
        apiStatus: 'checking',
        errorMessage: '',
      };
    }),
    on(AuthActions.healthcheckSuccess, (state): AuthState => {
      return {
        ...state,
        apiStatus: 'contentful',
        errorMessage: '',
      };
    }),
    on(AuthActions.healthcheckFailure, (state, { error }): AuthState => {
      return {
        ...state,
        apiStatus: 'not-contentful',
        errorMessage: error,
      };
    }),
    on(AuthActions.getToken, (state): AuthState => {
      return {
        ...state,
        authStatus: 'loading',
        errorMessage: '',
      };
    }),
    on(AuthActions.getTokenSuccess, (state, { token }): AuthState => {
      return {
        ...state,
        authStatus: 'token-success',
        token,
        errorMessage: '',
      };
    }),
    on(AuthActions.getTokenFailure, (state, { error }): AuthState => {
      return {
        ...state,
        authStatus: 'token-error',
        errorMessage: error,
      };
    }),
    on(AuthActions.setRedirectUrl, (state, { redirectUrl }): AuthState => {
      return { ...state, redirectUrl };
    })
    // on(
    //   AuthActions.loggedOut,
    //   AuthActions.logout,
    //   AuthActions.autoLoginFailed,
    //   AuthActions.tempAuthB2BLoginFailed,
    //   AuthActions.logoutNotConfirmedUser,
    //   (): AuthState => {
    //     return {
    //       ...initialState,
    //       status: 'no-identified',
    //     };
    //   }
    // ),
  ),
  extraSelectors: ({
    selectApiStatus,
    selectAuthStatus,
    selectRedirectUrl,
    selectErrorMessage,
  }) => ({
    selectIsAuthSettled: createSelector(selectAuthStatus, (authStatus) =>
      isAuthSettledState(authStatus)
    ),
    selectIsAuthInitialized: createSelector(selectAuthStatus, (authStatus) =>
      isAuthInitialized(authStatus)
    ),

    selectIsAPISettled: createSelector(selectApiStatus, (apiStatus) =>
      isApiSettledState(apiStatus)
    ),

    selectIsApiInitialized: createSelector(selectApiStatus, (apiStatus) =>
      isApiInitialized(apiStatus)
    ),

    selectAuthGuardInfo: createSelector(
      selectAuthStatus,
      selectRedirectUrl,
      (status, redirectUrl) => ({
        status,
        redirectUrl,
      })
    ),
    selectAuthError: createSelector(
      selectAuthStatus,
      selectErrorMessage,
      (status, errorMessage) => ({
        isError: status === 'token-error',
        errorMessage,
      })
    ),
  }),
});

export function isAuthSettledState(value: AuthStatus): boolean {
  return value === 'token-success';
}

export function isAuthInitialized(value: AuthStatus): boolean {
  return (
    value === 'token-success' || value === 'token-error' || value === 'no-token'
  );
}

export function isApiSettledState(value: APIStatus): boolean {
  return value === 'contentful';
}

export function isApiInitialized(value: APIStatus): boolean {
  return value === 'contentful' || value === 'not-contentful';
}
