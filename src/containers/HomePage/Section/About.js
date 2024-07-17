import React, { Component } from "react";
import { connect } from "react-redux";

class About extends Component {
  render() {
    return (
      <>
        <div className="section-about ">
          <div className="about-header">
            Truyền thông nói gì về Booking Care
          </div>
          <div className="about-content">
            <div className="content-left">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/FyDQljKtWnI"
                title="CÀ PHÊ KHỞI NGHIỆP VTV1 - BOOKINGCARE - HỆ THỐNG ĐẶT LỊCH KHÁM TRỰC TUYẾN"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
            <div className="content-right">
              Các bác sĩ triển khai đặt lịch khám online và có liên kết với ứng
              dụng đặt lịch khám của các nền tảng đặt lịch uy tín như:
              BookingCare, Wellcare,... để người bệnh chủ động đặt lịch và tư
              vấn online thuận tiện, nhanh chóng.
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
