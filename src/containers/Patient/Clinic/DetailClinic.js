import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/Header/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import "./DetailClinic.scss";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import { getDetailClinicById } from "../../../services/userService";
import _ from "lodash";
import HomeFooter from "../../HomePage/Footer/HomeFooter";
class DetailClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataDetailClinic: {},
      listProvince: [],
    };
  }
  async componentDidMount() {
    // cách lấy id như dưới là do phiên bản react-router-dom
    // mà đang dùng ở dự án này không hỗ trợ những
    // phương thức như useParam
    // console this.props.match đễ ra hơn tại sao
    // lại lấy id như dưới
    let id = this.props?.match?.params?.id;
    let res = await getDetailClinicById({
      id: id,
    });

    if (res && res.errCode === 0) {
      let data = res.data;
      let arrDoctorId = [];
      if (data && !_.isEmpty(res.data)) {
        let arr = data.doctorClinic;
        if (arr && arr.length > 0) {
          arr.forEach((element) => {
            arrDoctorId.push(element.doctorId);
          });
        }
      }

      this.setState({
        dataDetailClinic: res.data,
        arrDoctorId: arrDoctorId,
      });
    }
  }

  async componentDidUpdate(prevProps, prveState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  render() {
    let { arrDoctorId, dataDetailClinic } = this.state;

    return (
      <div className="detail-specialty-container">
        <HomeHeader />
        <div className="detail-specialty-body">
          <div className="description-specialty">
            {/**
             * dangerouslySetInnerHTML: cần dùng cách này để convert
             * description lưu ở db dưới dạng html sang dạng text
             */}
            {dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
              <div
                dangerouslySetInnerHTML={{
                  __html: dataDetailClinic.descriptionHTML,
                }}
              ></div>
            )}
          </div>
          <div>
            {arrDoctorId && arrDoctorId.length > 0 ? (
              <div>
                {arrDoctorId.map((item, index) => {
                  return (
                    <div className="each-doctor" key={index}>
                      <div className="doctor-left">
                        <div className="profile-doctor">
                          <ProfileDoctor
                            doctorId={item}
                            isShowDescriptionDoctor={true}
                            isShowLinkDetail={true}
                            isShowPrice={false}
                          />
                        </div>
                      </div>
                      <div className="doctor-right">
                        <div>
                          <DoctorSchedule currentDoctorId={item} />
                        </div>
                        <div className="doctor-extra-infor">
                          <DoctorExtraInfor currentDoctorId={item} />
                        </div>
                      </div>
                    </div>
                  );
                })}{" "}
              </div>
            ) : (
              <div className="not-found-doctor">
                <div className="text-not-found">Not Found Doctor</div>
              </div>
            )}
          </div>
        </div>
        <HomeFooter />
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
