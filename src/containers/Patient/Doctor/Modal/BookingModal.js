import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import "./BookingModal.scss";
import ProfileDoctor from "../ProfileDoctor";
import * as action from "../../../../store/actions/adminActions";
import { LANGUAGE } from "../../../../utils";
import Select from "react-select";
import { postBookAppointmentService } from "../../../../services/userService";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";
class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      person: "",
      doctorId: "",
      selectedGender: {},
      genderArr: {},
      timeType: "",
      date: "",

      isShowLoading: false,
    };
  }

  async componentDidMount() {
    await this.props.fetchGender();
  }

  bulidDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      data.forEach((item) => {
        let object = {};
        object.label = language === LANGUAGE.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };

  async componentDidUpdate(prevProps, prveState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        genderArr: this.bulidDataGender(this.props.genderRedux),
      });
    }
    if (prevProps.genderRedux !== this.props.genderRedux) {
      this.setState({
        genderArr: this.bulidDataGender(this.props.genderRedux),
      });
    }
    if (prevProps.dataTime !== this.props.dataTime) {
      this.setState({
        doctorId: this.props.dataTime.doctorId,
        timeType: this.props.dataTime.timeType,
        date: this.props.dataTime.date,
      });
    }
  }

  handleOnChangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };

  handleChangeSelect = (selectedOption) => {
    this.setState({ selectedGender: selectedOption });
  };

  // mục địch của hàm này là để build ra một cục
  // dữ liệu như 8:00 - 9:00 Chủ Nhật 1/8/2024
  // làm ở font end nếu không backend rất khổ

  buildTimeBooking = (dataTime) => {
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
      return `            ${time} - ${date}`;
    }
    return ``;
  };
  buildDoctorName = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let name =
        language === LANGUAGE.VI
          ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
          : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;

      return name;
    }
    return ``;
  };

  handleConfirmBooking = async () => {
    let timeString = this.buildTimeBooking(this.props.dataTime);
    let doctorName = this.buildDoctorName(this.props.dataTime);
    this.setState({
      isShowLoading: true,
    });
    let res = await postBookAppointmentService({
      email: this.state.email,
      timeType: this.state.timeType,
      doctorId: this.state.doctorId,
      date: this.state.date,

      fullName: this.state.fullName,
      phoneNumber: this.state.phoneNumber,
      address: this.state.address,
      reason: this.state.reason,
      gender: this.state.selectedGender.value,
      person: this.state.person,

      language: this.props.language,
      timeString: timeString,

      doctorName: doctorName,
    });

    if (res && res.errCode === 0) {
      toast.success("Booking success");
      this.setState({
        fullName: "",
        phoneNumber: "",
        email: "",
        address: "",
        reason: "",
        person: "",
        doctorId: "",
        selectedGender: {},
        timeType: "",
        date: "",

        isShowLoading: false,
      });
      this.props.closeBookingModal();
    } else {
      toast.error("Booking  a new appointment error");
      this.setState({
        isShowLoading: false,
      });
    }
  };

  render() {
    let { isOpenModal, closeBookingModal, dataTime } = this.props;
    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading booking appointment..."
        >
          <Modal
            isOpen={isOpenModal}
            className={"booking-modal-container"}
            size="lg"
            centered
            toggle={closeBookingModal}
          >
            <div className="booking-modal-content">
              <div className="booking-modal-header">
                <span className="left">
                  <FormattedMessage id="patient.booking-modal.title" />
                </span>
                <span className="right" onClick={closeBookingModal}>
                  <i className="fas fa-times"></i>
                </span>
              </div>
              <div className="booking-modal-body container">
                <div className="doctor-infor">
                  <ProfileDoctor
                    doctorId={dataTime.doctorId}
                    isShowDescriptionDoctor={false}
                    dataTime={dataTime}
                    isShowLinkDetail={false}
                    isShowPrice={true}
                  />
                </div>

                <div className="row">
                  <div className="col-6 form-group">
                    <label>
                      {" "}
                      <FormattedMessage id="patient.booking-modal.name" />
                    </label>
                    <input
                      className="form-control"
                      value={this.state.fullName}
                      onChange={(event) =>
                        this.handleOnChangeInput(event, "fullName")
                      }
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      {" "}
                      <FormattedMessage id="patient.booking-modal.phone" />
                    </label>
                    <input
                      className="form-control"
                      value={this.state.phoneNumber}
                      onChange={(event) =>
                        this.handleOnChangeInput(event, "phoneNumber")
                      }
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      <FormattedMessage id="patient.booking-modal.email" />
                    </label>
                    <input
                      className="form-control"
                      value={this.state.email}
                      onChange={(event) =>
                        this.handleOnChangeInput(event, "email")
                      }
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      {" "}
                      <FormattedMessage id="patient.booking-modal.address" />
                    </label>
                    <input
                      className="form-control"
                      value={this.state.address}
                      onChange={(event) =>
                        this.handleOnChangeInput(event, "address")
                      }
                    />
                  </div>
                  <div className="col-12 form-group">
                    <label>
                      {" "}
                      <FormattedMessage id="patient.booking-modal.reason" />
                    </label>
                    <input
                      className="form-control"
                      value={this.state.reason}
                      onChange={(event) =>
                        this.handleOnChangeInput(event, "reason")
                      }
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      {" "}
                      <FormattedMessage id="patient.booking-modal.person" />
                    </label>
                    <input
                      className="form-control"
                      value={this.state.person}
                      onChange={(event) =>
                        this.handleOnChangeInput(event, "person")
                      }
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      {" "}
                      <FormattedMessage id="patient.booking-modal.gender" />
                    </label>
                    <Select
                      value={this.state.selectedGender}
                      onChange={this.handleChangeSelect}
                      options={this.state.genderArr}
                    />
                  </div>
                </div>
              </div>
              <div className="booking-modal-footer">
                <button
                  className="btn-booking-confirm"
                  onClick={() => this.handleConfirmBooking()}
                >
                  <FormattedMessage id="patient.booking-modal.confirm" />
                </button>
                <button
                  className="btn-booking-cancel"
                  onClick={closeBookingModal}
                >
                  <FormattedMessage id="patient.booking-modal.cancel" />
                </button>
              </div>
            </div>
          </Modal>
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.gender,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGender: () => dispatch(action.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
