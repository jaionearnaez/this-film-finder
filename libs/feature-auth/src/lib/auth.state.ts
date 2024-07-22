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

export type AllowedThemes = 'chicken' | 'egg';

export interface AuthState {
  apiStatus: APIStatus;
  authStatus: AuthStatus;
  token: string | undefined;
  errorMessage: string;
  redirectUrl: string;
  theme: AllowedThemes | null;
  rememberMe: boolean;
}

export const initialState: AuthState = {
  apiStatus: 'not-checked',
  authStatus: 'not-initialized',
  token: undefined,
  errorMessage: '',
  redirectUrl: '',
  theme: null,
  rememberMe: false,
};

export const AuthActions = createActionGroup({
  source: 'Main Auth State',
  events: {
    autoLogin: emptyProps(),
    autoLoginWithToken: props<{
      token: string;
      rememberMe: boolean;
      theme: AllowedThemes;
    }>(),
    autoLoginFailed: emptyProps(),
    login: props<{ theme: AllowedThemes; rememberMe: boolean }>(),
    healthcheck: emptyProps(),
    healthcheckSuccess: emptyProps(),
    healthcheckFailure: props<{ error: string }>(),
    // getToken: emptyProps(),
    getTokenSuccess: props<{
      token: string;
      rememberMe: boolean;
      theme: AllowedThemes;
    }>(),
    getTokenFailure: props<{
      error: string;
    }>(),
    setRedirectUrl: props<{ redirectUrl: string }>(),
    logout: emptyProps(),
  },
});

export const AuthFeatureState = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    //_J TODO: CREATE NEW STATE FOR THEME
    on(AuthActions.login, (state, { theme, rememberMe }): AuthState => {
      return {
        ...state,
        theme,
        rememberMe,
        authStatus: 'loading',
      };
    }),
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

    on(
      AuthActions.autoLoginWithToken,
      (state, { token, rememberMe, theme }): AuthState => {
        return {
          ...state,
          authStatus: 'token-success',
          token,
          errorMessage: '',
          rememberMe,
          theme,
        };
      }
    ),
    on(AuthActions.autoLoginFailed, (state): AuthState => {
      return {
        ...state,
        authStatus: 'no-token',
        token: '',
        rememberMe: false,
        theme: null,
      };
    }),
    on(AuthActions.setRedirectUrl, (state, { redirectUrl }): AuthState => {
      return { ...state, redirectUrl };
    }),
    on(AuthActions.logout, (state): AuthState => {
      return {
        ...state,
        authStatus: 'no-token',
        errorMessage: '',
        theme: null,
        token: '',
      };
    })
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
      selectApiStatus,
      selectRedirectUrl,
      (authStatus, apiStatus, redirectUrl) => ({
        authStatus,
        apiStatus,
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
