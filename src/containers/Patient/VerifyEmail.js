import React, { Component } from "react";
import { connect } from "react-redux";
import { postVerifyBookAppointmentService } from "../../services/userService";
import HomeHeader from "../HomePage/Header/HomeHeader";
import "./VerifyEmail.scss";
class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusVerify: false,
      errCode: 0,
    };
  }
  async componentDidMount() {
    //code duới dùng để lấy param trên url
    if (this.props.location && this.props.location.search) {
      let urlParams = new URLSearchParams(this.props.location.search);
      let token = urlParams.get(`token`);
      let doctorId = urlParams.get(`doctorId`);
      let res = await postVerifyBookAppointmentService({
        token: token,
        doctorId: doctorId,
      });
      if (res && res.errCode === 0) {
        this.setState({
          statusVerify: true,
          errCode: res.errCode,
        });
      } else {
        this.setState({
          statusVerify: true,
          errCode: res && res.errCode ? res.errCode : -1,
        });
      }
    }
  }

  async componentDidUpdate(prevProps, prveState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  render() {
    let { statusVerify, errCode } = this.state;
    return (
      <>
        <HomeHeader />
        <div className="verify-email-container">
          {statusVerify === false ? (
            <div>Loading data...</div>
          ) : (
            <div>
              {errCode === 0 ? (
                <div className="infor-booking">
                  {" "}
                  Xác nhận lịch hẹn thành công!{" "}
                </div>
              ) : (
                <div className="infor-booking">
                  {" "}
                  Lịch hẹn không tồn tại hoặc đã được xác nhận
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
