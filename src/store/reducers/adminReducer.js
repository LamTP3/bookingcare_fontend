import actionTypes from "../actions/actionTypes";

const initialState = {
  isLoadingGender: false,
  gender: [],
  role: [],
  position: [],
  users: [],
  topDoctor: [],
  allDoctor: [],
  allScheduleTime: [],
  allRequiredDoctorInfor: [],
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_GENDER_START:
      let copyState1 = { ...state };
      copyState1.isLoadingGender = true;
      return {
        ...copyState1,
      };

    case actionTypes.FETCH_GENDER_SUCCESS:
      let copyState2 = { ...state };
      copyState2.gender = action.genderData;
      copyState2.isLoadingGender = false;
      return {
        ...copyState2,
      };

    case actionTypes.FETCH_GENDER_FAILED:
      let copyState3 = { ...state };
      copyState3.gender = [];
      copyState3.isLoadingGender = false;
      return {
        ...state,
      };

    case actionTypes.FETCH_POSITION_SUCCESS:
      state.position = action.data;
      return {
        ...state,
      };

    case actionTypes.FETCH_POSITION_FAILED:
      state.position = [];
      return {
        ...state,
      };

    case actionTypes.FETCH_ROLE_SUCCESS:
      state.role = action.data;
      return {
        ...state,
      };

    case actionTypes.FETCH_ROLE_FAILED:
      state.role = [];
      return {
        ...state,
      };

    case actionTypes.FETCH_ALL_USERS_SUCCESS:
      state.users = action.users;
      return {
        ...state,
      };

    case actionTypes.FETCH_ALL_USERS_FAILED:
      state.users = [];
      return {
        ...state,
      };

    case actionTypes.DELETE_USER_SUCCESS:
      return {
        ...state,
      };

    case actionTypes.DELETE_USER_FAILED:
      return {
        ...state,
      };

    case actionTypes.EDIT_USER_SUCCESS:
      return {
        ...state,
      };

    case actionTypes.EDIT_USER_FAILED:
      return {
        ...state,
      };

    case actionTypes.FETCH_TOP_DOCTOR_SUCCESS:
      state.topDoctor = action.data;
      return {
        ...state,
      };

    case actionTypes.FETCH_TOP_DOCTOR_FAILED:
      state.topDoctor = [];
      return {
        ...state,
      };

    case actionTypes.FETCH_ALL_DOCTOR_SUCCESS:
      state.allDoctor = action.data;
      return {
        ...state,
      };

    case actionTypes.FETCH_ALL_DOCTOR_FAILED:
      state.allDoctor = [];
      return {
        ...state,
      };

    case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
      state.allScheduleTime = action.dataTime;
      return {
        ...state,
      };

    case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
      state.allScheduleTime = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS:
      state.allRequiredDoctorInfor = action.data;
      return {
        ...state,
      };
    case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED:
      state.allRequiredDoctorInfor = [];
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default adminReducer;
