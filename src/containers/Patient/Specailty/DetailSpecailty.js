import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/Header/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import "./DetailSpecailty.scss";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
  getDetailSpecialtyById,
  getAllCodeService,
} from "../../../services/userService";
import _ from "lodash";
import { LANGUAGE } from "../../../utils";
import HomeFooter from "../../HomePage/Footer/HomeFooter";
class DetailSpecailty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataDetailSpecailty: {},
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
    let res = await getDetailSpecialtyById({
      id: id,
      location: "ALL",
    });

    let resProvince = await getAllCodeService("PROVINCE");

    if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
      let data = res.data;
      let arrDoctorId = [];
      if (data && !_.isEmpty(res.data)) {
        let arr = data.doctorSpecialty;
        if (arr && arr.length > 0) {
          arr.forEach((element) => {
            arrDoctorId.push(element.doctorId);
          });
        }
      }

      let dataProvince = resProvince.data;
      // gán thêm lựa chọn All vào select Province
      if (dataProvince && dataProvince.length > 0) {
        // dùng unshift để giá trị gán thêm đứng đầu mảng
        dataProvince.unshift({
          keyMap: "ALL",
          type: "PROVINCE",
          valueEn: "All Province",
          valueVi: "Toàn quốc",
        });
      }
      this.setState({
        dataDetailSpecailty: res.data,
        arrDoctorId: arrDoctorId,
        listProvince: dataProvince,
      });
    }
  }

  async componentDidUpdate(prevProps, prveState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  handleOnChangeSelect = async (event) => {
    let id = this.props?.match?.params?.id;
    let location = event.target.value;
    let res = await getDetailSpecialtyById({
      id: id,
      location: location,
    });

    if (res && res.errCode === 0) {
      let data = res.data;
      let arrDoctorId = [];
      if (data && !_.isEmpty(res.data)) {
        let arr = data.doctorSpecialty;
        if (arr && arr.length > 0) {
          arr.forEach((element) => {
            arrDoctorId.push(element.doctorId);
          });
        }
      }

      this.setState({
        dataDetailSpecailty: res.data,
        arrDoctorId: arrDoctorId,
      });
    }
  };

  render() {
    let { arrDoctorId, dataDetailSpecailty, listProvince } = this.state;
    let { language } = this.props;
    return (
      <div className="detail-specialty-container">
        <HomeHeader />
        <div className="detail-specialty-body">
          <div className="description-specialty">
            {/**
             * dangerouslySetInnerHTML: cần dùng cách này để convert
             * description lưu ở db dưới dạng html sang dạng text
             */}
            {dataDetailSpecailty && !_.isEmpty(dataDetailSpecailty) && (
              <div
                dangerouslySetInnerHTML={{
                  __html: dataDetailSpecailty.descriptionHTML,
                }}
              ></div>
            )}
          </div>
          <div className="search-sp-doctor">
            <select onChange={(event) => this.handleOnChangeSelect(event)}>
              {listProvince &&
                listProvince.length > 0 &&
                listProvince.map((item, index) => {
                  return (
                    <option key={index} value={item.keyMap}>
                      {language === LANGUAGE.VI ? item.valueVi : item.valueEn}
                    </option>
                  );
                })}
            </select>
          </div>
          <div>
            {arrDoctorId && arrDoctorId.length > 0 ? (
              <div>
                {arrDoctorId.map((item, index) => {
                  return (
                    <div className="each-doctor" key={index}>
                      <div className="doctor-sp-left">
                        <div className="profile-doctor">
                          <ProfileDoctor
                            doctorId={item}
                            isShowDescriptionDoctor={true}
                            isShowLinkDetail={true}
                            isShowPrice={false}
                          />
                        </div>
                      </div>
                      <div className="doctor-sp-right">
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecailty);
