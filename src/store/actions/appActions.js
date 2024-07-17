import actionTypes from "./actionTypes";

export const appStartUpComplete = () => ({
  type: actionTypes.APP_START_UP_COMPLETE,
});

export const setAppLanguage = (changeLanguage) => {
  return {
    type: actionTypes.CHANGE_LANGUAGE,
    language: changeLanguage,
  };
};
