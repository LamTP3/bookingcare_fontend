import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import HomeHeader from "../HomePage/Header/HomeHeader";
// import Specialty from "./Section/Section";
import About from "./Section/About";
import HomeFooter from "./Footer/HomeFooter";
import "./HomePage.scss";
import * as action from "../../store/actions";
import { injectIntl } from "react-intl";
import {
  getSpecialtySercie,
  getAllClinicSercie,
} from "../../services/userService";
// đã test lazy component với việc import thường thì lazy nhanh hơn một tí
// ngoài ra lý do khiến khi vào trang home bị lag là do phải tải ảnh cho
// section Cơ sở y tế nổi bật
// ta lưu ảnh ở dưới database cho section này quá lớn
// nặng hơn nhiểu so với các section khác.
// check db để rõ
const Specialty = React.lazy(() => import("./Section/Section"));

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctor: [],
      arrSpecialty: [],
      arrClinic: [],
    };
  }

  async componentDidMount() {
    this.props.loadTopDoctor();
    let resSpecialty = await getSpecialtySercie();
    if (resSpecialty && resSpecialty.errCode === 0) {
      this.setState({
        arrSpecialty: resSpecialty.data,
      });
    }
    let resClinic = await getAllClinicSercie();
    if (resClinic && resClinic.errCode === 0) {
      this.setState({
        arrClinic: resClinic.data,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.topDoctor !== this.props.topDoctor) {
      this.setState({
        arrDoctor: this.props.topDoctor,
      });
    }
  }

  render() {
    const { intl } = this.props;
    return (
      <>
        <HomeHeader showBanner={true} />
        <Suspense fallback={<div>Loading...</div>}>
          <Specialty
            title={intl.formatMessage({
              id: "homepage.specialty-popular",
            })}
            bg_Color="#eee"
            urlNavigate="detail-specialty"
            data={this.state.arrSpecialty}
          />
          <Specialty
            title={intl.formatMessage({
              id: "homepage.outstanding-clinic",
            })}
            bg_Color="#eee"
            data={this.state.arrClinic}
            urlNavigate="detail-clinic"
          />
          <Specialty
            title={intl.formatMessage({
              id: "homepage.outstanding-doctor",
            })}
            bg_Color="#eee"
            data={this.state.arrDoctor}
            doctor={true}
            urlNavigate="detail-doctor"
          />
        </Suspense>
        <About />
        <HomeFooter />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    topDoctor: state.admin.topDoctor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctor: () => dispatch(action.fetchTopDoctor()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(HomePage));
