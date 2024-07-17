import React, { Component } from "react";
import { connect } from "react-redux";
import { LANGUAGE } from "../../../../utils";

class LikeAndShare extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  initFaceBookSDK = () => {
    // Kiểm tra nếu SDK đã được tải
    if (window.FB) {
      window.FB.XFBML.parse();
      return;
    }

    let { language } = this.props;
    let locale = language === LANGUAGE.VI ? "vi_VN" : "en_US";

    // Khởi tạo hàm fbAsyncInit
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true, // enable cookies để server có thể truy cập session
        xfbml: true, // parse social plugin trên trang này
        version: "v20.0",
      });
      window.FB.XFBML.parse();
    };

    // Load SDK một cách bất đồng bộ
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = `https://connect.facebook.net/${locale}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  };

  componentDidMount() {
    this.initFaceBookSDK();
  }

  render() {
    let { dataHref } = this.props;
    return (
      <>
        <div
          className="fb-like"
          data-href={dataHref}
          data-width=""
          data-layout="standard"
          data-action="like"
          data-size="small"
          data-share="true"
        ></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(LikeAndShare);
