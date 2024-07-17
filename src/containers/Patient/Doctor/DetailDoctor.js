import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/Header/HomeHeader";
import "./DetailDoctor.scss";
import { getDetailInforDoctor } from "../../../services/userService";
import { LANGUAGE } from "../../../utils/constant";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtraInfor from "./DoctorExtraInfor";
import HomeFooter from "../../HomePage/Footer/HomeFooter";
// import Comment from "./SocialPlugin/Comment";
// import LikeAndShare from "./SocialPlugin/LikeAndShare";

class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailDoctor: {},
      currentDoctorId: -1,
    };
  }
  async componentDidMount() {
    let id = this.props?.match?.params?.id;
    this.setState({
      currentDoctorId: id,
    });
    let res = await getDetailInforDoctor(id);
    if (res && res.errCode === 0) {
      this.setState({
        detailDoctor: res.data,
      });
    }
  }

  componentDidUpdate(prevProps, prveState, snapshot) {}
  render() {
    let { detailDoctor, currentDoctorId } = this.state;
    let { lang } = this.props;
    let nameVi = "";
    let nameEN = "";
    if (detailDoctor && detailDoctor.positionData) {
      nameVi = `${detailDoctor.positionData?.valueVi}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
      nameEN = `${detailDoctor.positionData?.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
    }

    // let curentURl =
    //   +process.env.REACT_APP_IS_LOCALHOST === 1 ? window.location.href : "";
    return (
      <>
        <HomeHeader />
        <div className="doctor-detail-container">
          <div className="intro-doctor">
            <div
              className="content-left"
              style={{
                backgroundImage: detailDoctor
                  ? `url(${detailDoctor.image})`
                  : "",
              }}
            ></div>
            <div className="content-right">
              <div className="up">{lang === LANGUAGE.EN ? nameEN : nameVi}</div>
              <div className="down">
                {detailDoctor?.Markdown?.description && (
                  <span>{detailDoctor?.Markdown?.description}</span>
                )}
                {/* <div className="like-share-plugin">
                  <LikeAndShare dataHref={curentURl} />
                </div> */}
              </div>
            </div>
          </div>
          <div className="schedule-doctor">
            <div className="content-left">
              <DoctorSchedule currentDoctorId={currentDoctorId} />
            </div>
            <div className="content-right">
              <DoctorExtraInfor currentDoctorId={currentDoctorId} />
            </div>
          </div>
          <div className="detail-infor-doctor">
            {detailDoctor?.Markdown?.contentHTML && (
              <div
                dangerouslySetInnerHTML={{
                  __html: detailDoctor?.Markdown?.contentHTML,
                }}
              ></div>
            )}
          </div>
          <div className="comment-doctor">
            {/* <Comment dataHref={curentURl} width={"100%"} /> */}
          </div>
        </div>
        <HomeFooter />
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
