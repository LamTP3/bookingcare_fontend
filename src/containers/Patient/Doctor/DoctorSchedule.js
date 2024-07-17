import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import { LANGUAGE } from "../../../utils/constant";
import moment from "moment";
// mặc định thư viện moment luôn dùng tiếng anh
// tuy nhiên ta khai báo localization để
// thư viện hiểu file này dùng tiếng việt
import "moment/locale/vi";
import { getScheduleDoctorByDateService } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";

class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDays: [],
      allAvailableTime: [],
      isOpenModalBooking: false,
      dataScheduleTimeModal: {},
    };
  }

  async componentDidMount() {
    let { lang } = this.props;
    let allDays = await this.getArrDays(lang);
    if (allDays && allDays.length > 0) {
      let res = await getScheduleDoctorByDateService(
        this.props?.currentDoctorId,
        allDays[0].value
      );
      this.setState({
        allAvailableTime: res.data ? res.data : [],
        allDays: allDays,
      });
    }
  }

  getArrDays = async (language) => {
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      if (language === LANGUAGE.VI) {
        if (i === 0) {
          let ddMM = moment(new Date()).format(`DD/MM`);
          let today = "Hôm nay - " + ddMM;
          object.label = today;
        } else {
          // biến kí tự đầu tiên của một chữ tiếng việt thành chữ hoa

          let firstLetter = moment(new Date())
            .add(i, "days")
            .format("dddd - DD/MM")
            .charAt(0)
            .toUpperCase();
          object.label =
            firstLetter +
            moment(new Date()).add(i, "days").format("dddd - DD/MM").slice(1);
        }
      } else {
        if (i === 0) {
          let ddMM = moment(new Date()).format(`DD/MM`);
          let today = "Today - " + ddMM;
          object.label = today;
        } else {
          object.label = moment(new Date())
            .add(i, "days")
            .locale(`en`)
            .format("ddd - DD/MM");
        }
      }
      // dùng startOf để lấy date là (2024-07-09 00:00:00)
      // ta không lấy thới gian  00:00:00 vì database ta không lưu
      object.value = moment(new Date()).add(i, "days").startOf(`day`).valueOf();
      allDays.push(object);
    }
    return allDays;
  };

  handleOnChangeSelect = async (event) => {
    let id = this.props?.currentDoctorId;
    let date = event.target.value;
    let res = await getScheduleDoctorByDateService(id, date);
    if (res && res.errCode === 0) {
      this.setState({
        allAvailableTime: res?.data ? res?.data : [],
      });
    }
  };

  async componentDidUpdate(prevProps, prveState, snapshot) {
    if (this.props.lang !== prevProps.lang) {
      let allDays = await this.getArrDays(this.props.lang);
      this.setState({
        allDays: allDays,
      });
    }
  }

  hanleClickScheduleTime = (time) => {
    this.setState({
      isOpenModalBooking: true,
      dataScheduleTimeModal: time,
    });
  };

  closeBookingModal = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };
  render() {
    let {
      allDays,
      allAvailableTime,
      isOpenModalBooking,
      dataScheduleTimeModal,
    } = this.state;
    let { lang } = this.props;
    return (
      <>
        <div className="doctor-schedule-container">
          <div className="all-schedule">
            <select onChange={(event) => this.handleOnChangeSelect(event)}>
              {allDays &&
                allDays.length > 0 &&
                allDays.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="all-available-time">
            <div className="text-clendar">
              <i className="fas fa-calendar-alt">
                <span>
                  <FormattedMessage id="patient.detail-doctor.schedule" />
                </span>
              </i>
            </div>
            <div className="time-content">
              {allAvailableTime && allAvailableTime.length > 0 ? (
                <>
                  <div className="time-content-btns">
                    {allAvailableTime.map((item, index) => {
                      let timeDisplay =
                        lang === LANGUAGE.VI
                          ? item.timeTypeData.valueVi
                          : item.timeTypeData.valueEn;

                      return (
                        <button
                          key={index}
                          className={
                            lang === LANGUAGE.VI ? "btn-vie" : "btn-en"
                          }
                          onClick={() => this.hanleClickScheduleTime(item)}
                        >
                          {timeDisplay}
                        </button>
                      );
                    })}
                  </div>
                  <div className="book-free">
                    <span>
                      <FormattedMessage id="patient.detail-doctor.choose" />{" "}
                      <i className="far fa-hand-point-up"></i>{" "}
                      <FormattedMessage id="patient.detail-doctor.book-free" />
                    </span>
                  </div>
                </>
              ) : (
                <div className="no-schedule">
                  <FormattedMessage id="patient.detail-doctor.no-schedule" />
                </div>
              )}
            </div>
          </div>
        </div>

        <BookingModal
          isOpenModal={isOpenModalBooking}
          closeBookingModal={this.closeBookingModal}
          dataTime={dataScheduleTimeModal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
