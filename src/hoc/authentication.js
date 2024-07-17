import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";
// locationHelperBuilder được sử dụng để tạo một instance của locationHelper,
// mà bạn có thể sử dụng để lấy thông tin về URL hiện tại
// và thực hiện các thao tác liên quan đến định tuyến.
const locationHelper = locationHelperBuilder({});

export const userIsAuthenticatedSystem = connectedRouterRedirect({
  //authenticatedSelector: Một hàm kiểm tra xem người dùng chưa
  //được xác thực bằng cách truy cập state.user.isLoggedIn.
  //Nếu state.user.isLoggedIn là false, người dùng được coi là chưa xác thực.
  authenticatedSelector: (state) => {
    const { user } = state;
    return user.isLoggedIn && user.userInfo.roleId === "R1";
  },
  wrapperDisplayName: "userIsAuthenticatedSystem",
  redirectPath: "/login",
});

export const userIsAuthenticatedDoctor = connectedRouterRedirect({
  authenticatedSelector: (state) => {
    const { user } = state;
    return user.isLoggedIn && user.userInfo.roleId === "R2";
  },
  wrapperDisplayName: "userIsAuthenticatedDoctor",
  redirectPath: "/login",
});

export const userIsNotAuthenticated = connectedRouterRedirect({
  authenticatedSelector: (state) => !state.user.isLoggedIn,
  wrapperDisplayName: "UserIsNotAuthenticated",
  //Nếu người dùng đã đăng nhập và cố gắng truy cập route này,
  //họ sẽ được chuyển hướng đến URL được chỉ định trong query parameter
  //của URL hiện tại (locationHelper.getRedirectQueryParam(ownProps))
  //hoặc về trang chủ "/" nếu không có query parameter nào được cung cấp.
  redirectPath: (state, ownProps) => {
    const { user } = state;

    if (user.isLoggedIn && user.userInfo && user.userInfo.roleId) {
      const { roleId } = user.userInfo;

      if (roleId === "R1") {
        // Nếu là System (R1)
        return "/system/user-manage";
      } else if (roleId === "R2") {
        // Nếu là Doctor (R2)
        return "/doctor/manage-patient";
      }
    }

    // Mặc định điều hướng về trang chủ
    return locationHelper.getRedirectQueryParam(ownProps) || "/";
  },
  //allowRedirectBack: false đảm bảo rằng người dùng không thể
  //chuyển hướng trở lại trang trước đó sau khi đã xác thực.
  allowRedirectBack: false,
});
