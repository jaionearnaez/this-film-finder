import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
// `router` is used as the default feature name. You can use the feature name
// of your choice by creating a feature selector and pass it to the `getSelectors` function
// export const selectRouter = createFeatureSelector<RouterReducerState>('yourFeatureName');
export const {
  selectCurrentRoute, // select the current route
  //   selectFragment, // select the current route fragment
    selectQueryParams, // select the current route query params
  //   selectQueryParam, // factory function to select a query param
  //   selectRouteParams, // select the current route params
  //   selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route dataI
  selectUrl, // select the current url
  selectTitle: selectRouterTitle, // Select the title if available
} = getRouterSelectors();


export const selectShowHeader = createSelector(selectRouteData, (data) =>
  data?.['showHeader'] ? data?.['showHeader'] : false
);

export const selectTitle = createSelector(selectRouteData, (data) =>
  data?.['title'] ? data?.['title'] : false
);
