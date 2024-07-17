import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "../../../components/Input/DatePicker";
import "./ManagePatient.scss";
import {
  getListPatientForDoctor,
  postSendRemedyService,
} from "../../../services/userService";
import moment from "moment";
import { LANGUAGE } from "../../../utils";
import { toast } from "react-toastify";
import RemedyModal from "./RemedyModal";
import LoadingOverlay from "react-loading-overlay";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf(`day`).valueOf(),
      dataPatient: {},
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,
    };
  }
  async componentDidMount() {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formatDate = new Date(currentDate).getTime();
    this.getDataPatient(user, formatDate);
  }

  getDataPatient = async (user, formatDate) => {
    let res = await getListPatientForDoctor({
      doctorId: user.id,
      date: formatDate,
    });
    if (res && res.errCode === 0) {
      this.setState({
        dataPatient: res.data,
      });
    }
  };

  handleOnChangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatDate = new Date(currentDate).getTime();
        this.getDataPatient(user, formatDate);
      }
    );
  };

  handleBtnConfirm = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      date: item.date,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    };

    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };

  // handleBtnRemedy = () => {};

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };

  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;
    this.setState({
      isShowLoading: true,
    });
    let res = await postSendRemedyService({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      date: dataModal.date,
      language: this.props.language,
      patientName: dataModal.patientName,
    });
    // khi send redemy thành công
    if (res && res.errCode === 0) {
      toast.success("Send Redemy success");
      // đóng Modal Redemy và tắt spin loading
      this.setState({
        isOpenRemedyModal: false,
        isShowLoading: false,
      });

      // gọi lại api để set dữ liệu cho bảng
      let { user } = this.props;
      let { currentDate } = this.state;
      let formatDate = new Date(currentDate).getTime();
      this.getDataPatient(user, formatDate);
    } else {
      toast.error("Something wrong...");
    }
  };

  render() {
    let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
    let { language } = this.props;
    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading send redemy..."
        >
          <div className="manage-patient-container">
            <div className="m-p-title">Quản lý bệnh nhân khám bệnh</div>
            <div className="manage-patient-body">
              <div className="row">
                <div className="col-6 form-group">
                  <label>Chọn ngày khám</label>
                  <DatePicker
                    onChange={this.handleOnChangeDatePicker}
                    className="form-control"
                    value={this.state.currentDate}
                  />
                </div>
                <div className="col-12 table-manage-patient mt-4">
                  {dataPatient && dataPatient.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Thời gian</th>
                          <th>Tên Người Đặt Lịch</th>
                          <th>Địa Chỉ</th>
                          <th>Số Điện Thoại</th>
                          <th>Giới Tính</th>
                          <th>Đặt Cho Ai</th>
                          <th>Triệu Chứng</th>
                          <th>Hành Động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataPatient.map((item, index) => {
                          let gender =
                            language === LANGUAGE.VI
                              ? item.patientData.genderData.valueVi
                              : item.patientData.genderData.valueEn;
                          let time =
                            language === LANGUAGE.VI
                              ? item.timeTypeDataPatient.valueVi
                              : item.timeTypeDataPatient.valueEn;
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{time}</td>
                              <td>{item.patientData.firstName}</td>
                              <td>{item.patientData.address}</td>
                              <td>{item.patientData.phonenumber}</td>
                              <td>{gender}</td>
                              <td>{item.patientData.patient}</td>
                              <td>{item.patientData.reason}</td>
                              <td>
                                <button
                                  className="mp-btn-confirm"
                                  onClick={() => this.handleBtnConfirm(item)}
                                >
                                  Xác nhận
                                </button>
                                {/* <button
                                  className="mp-btn-remedy"
                                  onClick={() => this.handleBtnRemedy()}
                                >
                                  Gửi hóa đơn
                                </button> */}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="not-found">
                      <div className="not-found-text">No Booking Found</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <RemedyModal
            isOpenModal={isOpenRemedyModal}
            dataModal={dataModal}
            closeRemedyModal={this.closeRemedyModal}
            sendRemedy={this.sendRemedy}
          />
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
