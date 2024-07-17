import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorExtraInfor.scss";
import { getExtraDoctorInforService } from "../../../services/userService";
import NumberFormat from "react-number-format";
import { LANGUAGE } from "../../../utils/constant";
import { FormattedMessage } from "react-intl";

class DoctorExtraInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowInfor: false,
      extraInfor: {},
    };
  }
  async componentDidMount() {
    if (this.props.currentDoctorId) {
      let res = await getExtraDoctorInforService(this.props.currentDoctorId);
      if (res && res.errCode === 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
  }
  hanleShow = () => {
    this.setState({
      isShowInfor: !this.state.isShowInfor,
    });
  };
  async componentDidUpdate(prevProps, prveState, snapshot) {
    if (prevProps.currentDoctorId !== this.props.currentDoctorId) {
      let res = await getExtraDoctorInforService(this.props.currentDoctorId);
      if (res && res.errCode === 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
  }
  render() {
    let { isShowInfor, extraInfor } = this.state;
    let { lang } = this.props;
    return (
      <>
        <div className="doctor-extra-infor-container">
          <div className="content-up">
            <div className="text-address">
              <FormattedMessage id="patient.detail-doctor.address" />
            </div>
            <div className="name-clinic">
              {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ""}
            </div>
            <div className="detail-address">
              {extraInfor && extraInfor.addressClinic
                ? extraInfor.addressClinic
                : ""}
            </div>
          </div>
          <div className="content-down">
            {isShowInfor ? (
              <>
                <div className="title-price">
                  <FormattedMessage id="patient.detail-doctor.price" />:{" "}
                </div>
                <div className="detail-infor">
                  <div className="price">
                    <span className="left">
                      <FormattedMessage id="patient.detail-doctor.price" />{" "}
                    </span>
                    <span className="right">
                      {" "}
                      {extraInfor &&
                      extraInfor.priceTypeData &&
                      lang === LANGUAGE.VI ? (
                        <NumberFormat
                          value={extraInfor.priceTypeData.valueVi}
                          displayType={`text`}
                          thousandSeparator={true}
                          suffix={` VND`}
                        />
                      ) : (
                        ""
                      )}
                      {extraInfor &&
                      extraInfor.priceTypeData &&
                      lang === LANGUAGE.EN ? (
                        <NumberFormat
                          value={extraInfor.priceTypeData.valueEn}
                          displayType={`text`}
                          thousandSeparator={true}
                          suffix={` USD`}
                        />
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                  <div className="note">
                    {extraInfor && extraInfor.note ? extraInfor.note : ""}
                  </div>
                </div>
                <div className="payment">
                  <FormattedMessage id="patient.detail-doctor.payment" /> : {""}
                  {extraInfor &&
                  extraInfor.paymentTypeData &&
                  lang === LANGUAGE.VI
                    ? extraInfor.paymentTypeData.valueVi
                    : ""}
                  {extraInfor &&
                  extraInfor.paymentTypeData &&
                  lang === LANGUAGE.EN
                    ? extraInfor.paymentTypeData.valueEn
                    : ""}
                </div>
                <div className="hide-price">
                  <span onClick={() => this.hanleShow()}>
                    <FormattedMessage id="patient.detail-doctor.hide" />
                  </span>
                </div>
              </>
            ) : (
              <div onClick={() => this.hanleShow()}>
                <span className="text-uppercase">
                  <FormattedMessage id="patient.detail-doctor.price" />
                </span>{" "}
                <span>
                  {" "}
                  {extraInfor &&
                  extraInfor.priceTypeData &&
                  lang === LANGUAGE.VI ? (
                    <NumberFormat
                      value={extraInfor.priceTypeData.valueVi}
                      displayType={`text`}
                      thousandSeparator={true}
                      suffix={` VND`}
                    />
                  ) : (
                    ""
                  )}
                  {extraInfor &&
                  extraInfor.priceTypeData &&
                  lang === LANGUAGE.EN ? (
                    <NumberFormat
                      value={extraInfor.priceTypeData.valueEn}
                      displayType={`text`}
                      thousandSeparator={true}
                      suffix={` USD`}
                    />
                  ) : (
                    ""
                  )}
                </span>{" "}
                <span className="show-price">
                  <FormattedMessage id="patient.detail-doctor.show" />
                </span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
