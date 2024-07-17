import actionTypes from "./actionTypes";
import {
  getAllCodeService,
  createUserService,
  getAllUsers,
  deleteUserService,
  editUserService,
  getTopDoctorHomeService,
  getAllDoctors,
  saveDetailDoctorService,
  getSpecialtySercie,
  getAllClinicSercie,
} from "../../services/userService";
import { toast } from "react-toastify";

export const fetchGenderStart = () => async (dispatch, getState) => {
  return getAllCodeService("GENDER").then((res) => {
    dispatch({ type: actionTypes.FETCH_GENDER_START });
    if (res && res.errCode === 0) {
      dispatch(fetchGenderSuccess(res.data));
    } else {
      dispatch(fetchGenderFailed());
    }
  });
};

export const fetchGenderSuccess = (gender) => ({
  type: actionTypes.FETCH_GENDER_SUCCESS,
  genderData: gender,
});

export const fetchGenderFailed = () => ({
  type: actionTypes.FETCH_GENDER_FAILED,
});

export const fetchPositionStart = () => async (dispatch, getState) => {
  return getAllCodeService("POSITION").then((res) => {
    if (res && res.errCode === 0) {
      dispatch(fetchPositionSuccess(res.data));
    } else {
      dispatch(fetchPositionFailed());
    }
  });
};

export const fetchPositionSuccess = (position) => ({
  type: actionTypes.FETCH_POSITION_SUCCESS,
  data: position,
});

export const fetchPositionFailed = () => ({
  type: actionTypes.FETCH_POSITION_FAILED,
});

export const fetchRoleStart = () => async (dispatch, getState) => {
  return getAllCodeService("ROLE").then((res) => {
    if (res && res.errCode === 0) {
      dispatch(fetchRoleSuccess(res.data));
    } else {
      dispatch(fetchRoleFailed());
    }
  });
};

export const fetchRoleSuccess = (role) => ({
  type: actionTypes.FETCH_ROLE_SUCCESS,
  data: role,
});

export const fetchRoleFailed = () => ({
  type: actionTypes.FETCH_ROLE_FAILED,
});

export const createNewUser = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createUserService(data);
      if (res && res.errCode === 0) {
        dispatch(saveUserSuccess());
        dispatch(fetchAllUsers());
        toast.success("Create new user success!");
      } else {
        console.log("Failed to save user: ", res);
        dispatch(saveUserFailed());
      }
    } catch (e) {
      dispatch(saveUserFailed());
      console.log("Failed to save user: ", e);
    }
  };
};

export const deleteUser = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await deleteUserService(data);
      if (res && res.errCode === 0) {
        dispatch(deleteUserSuccess());
        dispatch(fetchAllUsers());
        toast.success("Delete user success!");
      } else {
        console.log("Failed to delete user: ", res);
        dispatch(deleteUserFailed());
      }
    } catch (e) {
      dispatch(deleteUserFailed());
      console.log("Failed to delete user: ", e);
    }
  };
};

export const deleteUserSuccess = () => ({
  type: actionTypes.DELETE_USER_SUCCESS,
});

export const deleteUserFailed = () => ({
  type: actionTypes.DELETE_USER_FAILED,
});

export const saveUserSuccess = () => ({
  type: actionTypes.SAVE_USER_SUCCESS,
});

export const saveUserFailed = () => ({
  type: actionTypes.SAVE_USER_FAILED,
});

export const fetchAllUsers = () => {
  return async (dispatch, getState) => {
    let response = await getAllUsers("ALL");

    if (response && response.errCode === 0) {
      dispatch({
        type: actionTypes.FETCH_ALL_USERS_SUCCESS,
        users: response.users.reverse(),
      });
    } else {
      dispatch({
        type: actionTypes.FETCH_ALL_USERS_FAILED,
      });
    }
  };
};

export const editUser = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await editUserService(data);
      if (res && res.errCode === 0) {
        dispatch(editUserSuccess());
        dispatch(fetchAllUsers());
        toast.success("Edit user success!");
      } else {
        console.log("Failed to edit user: ", res);
        dispatch(editUserFailed());
      }
    } catch (e) {
      dispatch(editUserFailed());
      console.log("Problem to edit user: ", e);
    }
  };
};

export const editUserSuccess = () => ({
  type: actionTypes.EDIT_USER_SUCCESS,
});

export const editUserFailed = () => ({
  type: actionTypes.EDIT_USER_FAILED,
});

export const fetchTopDoctor = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getTopDoctorHomeService("");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
          data: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTOR_FAILED,
        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_TOP_DOCTOR_FAILED,
      });
    }
  };
};

export const fetchAllDoctor = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllDoctors();
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
          data: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_ALL_DOCTOR_FAILED,
        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_ALL_DOCTOR_FAILED,
      });
    }
  };
};

export const saveDetailDoctor = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await saveDetailDoctorService(data);
      console.log(`Check res: `, res);
      if (res && res.errCode === 0) {
        toast.success(`Save doctor detail success`);
        dispatch({
          type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
        });
      } else {
        console.log(`Problem has: `, res);
        toast.error(`Save doctor detail error`);
        dispatch({
          type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
        });
      }
    } catch (e) {
      console.log(`SAVE DETAIL DOCTOR FAIL: `, e);
      toast.error(`Save doctor detail error`);
      dispatch({
        type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
      });
    }
  };
};

export const fetchAllScheduleTime = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("TIME");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
          dataTime: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
      });
    }
  };
};

export const getRequiredDoctorInfor = () => {
  return async (dispatch, getState) => {
    try {
      let resPrice = await getAllCodeService("PRICE");
      let resPayment = await getAllCodeService("PAYMENT");
      let resProvince = await getAllCodeService("PROVINCE");
      let resSpecialty = await getSpecialtySercie();
      let resClinic = await getAllClinicSercie();
      if (
        resPrice &&
        resPrice.errCode === 0 &&
        resPayment &&
        resPayment.errCode === 0 &&
        resProvince &&
        resProvince.errCode === 0 &&
        resSpecialty &&
        resSpecialty.errCode === 0 &&
        resClinic &&
        resClinic.errCode === 0
      ) {
        let data = {
          resPrice: resPrice.data,
          resPayment: resPayment.data,
          resProvince: resProvince.data,
          resSpecialty: resSpecialty.data,
          resClinic: resClinic.data,
        };
        dispatch(fetchRequiredDoctorrInforSuccess(data));
      } else {
        dispatch(fetchRequiredDoctorrInforFailed());
      }
    } catch (e) {
      dispatch(fetchRequiredDoctorrInforFailed());
      console.log(e);
    }
  };
};

export const fetchRequiredDoctorrInforSuccess = (data) => ({
  type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
  data: data,
});

export const fetchRequiredDoctorrInforFailed = () => ({
  type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED,
});
