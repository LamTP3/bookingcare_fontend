import React, { Component } from "react";
import { connect } from "react-redux";
import "moment/locale/vi";
import { getProfileDoctorService } from "../../../services/userService";
import "./ProfileDoctor.scss";
import { LANGUAGE } from "../../../utils/constant";
import NumberFormat from "react-number-format";
import _ from "lodash";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
class ProfileDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProfile: {},
    };
  }
  async componentDidMount() {
    let id = this.props.doctorId;
    let data = await this.getInforDoctor(id);
    this.setState({
      dataProfile: data,
    });
  }

  getInforDoctor = async (id) => {
    let result = {};
    if (id) {
      let res = await getProfileDoctorService(id);
      if (res && res.errCode === 0) {
        result = res.data;
      }
    }
    return result;
  };

  async componentDidUpdate(prevProps, prveState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  renderTimeBooking = (dataTime) => {
    let { language } = this.props;

    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGE.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      let date =
        language === LANGUAGE.VI
          ? // date của dateTime được lưu dưới database là một string chứ
            // không phải timeStamp tuy nhiên +dataTime.date
            // (dấu + ở đây có tác dụng chuyển string sang số nguyên)
            moment(+dataTime.date).format("dddd - DD/MM/YYYY")
          : moment(+dataTime.date).locale("en").format("ddd - MM/DD/YYYY");
      return (
        <>
          <div>
            {time} - {date}
          </div>
          <div>
            {" "}
            <FormattedMessage id="patient.detail-doctor.note" />
          </div>
        </>
      );
    }
    return <></>;
  };

  render() {
    let { dataProfile } = this.state;
    let {
      language,
      isShowDescriptionDoctor,
      dataTime,
      isShowLinkDetail,
      isShowPrice,
      doctorId,
    } = this.props;
    let nameVi = "";
    let nameEN = "";
    if (dataProfile && dataProfile.positionData) {
      nameVi = `${dataProfile.positionData?.valueVi}, ${dataProfile.firstName} ${dataProfile.lastName}`;
      nameEN = `${dataProfile.positionData?.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
    }

    return (
      <>
        <div className="intro-doctor">
          <div
            className="content-left"
            style={{
              backgroundImage: dataProfile ? `url(${dataProfile.image})` : "",
            }}
          ></div>
          <div className="content-right">
            <div className="up">
              {language === LANGUAGE.EN ? nameEN : nameVi}
            </div>
            <div className="down">
              {isShowDescriptionDoctor === true ? (
                <>
                  {dataProfile?.Markdown?.description && (
                    <span>{dataProfile?.Markdown?.description}</span>
                  )}
                </>
              ) : (
                <>{this.renderTimeBooking(dataTime)}</>
              )}
            </div>
          </div>
        </div>

        {isShowLinkDetail && (
          <div className="view-detail-doctor">
            <Link to={`/detail-doctor/${doctorId}`}>Xem thêm</Link>
          </div>
        )}
        {isShowPrice && (
          <div className="price">
            <FormattedMessage id="patient.detail-doctor.price" />:{" "}
            {dataProfile &&
            dataProfile.Doctor_Infor &&
            language === LANGUAGE.VI ? (
              <NumberFormat
                value={dataProfile.Doctor_Infor.priceTypeData.valueVi}
                displayType={`text`}
                thousandSeparator={true}
                suffix={` VND`}
              />
            ) : (
              ""
            )}
            {dataProfile &&
            dataProfile.Doctor_Infor &&
            language === LANGUAGE.EN ? (
              <NumberFormat
                value={dataProfile.Doctor_Infor.priceTypeData.valueEn}
                displayType={`text`}
                thousandSeparator={true}
                suffix={` USD`}
              />
            ) : (
              ""
            )}
          </div>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
