import React, { Component } from "react";
import { connect } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./Section.scss";
import { LANGUAGE } from "../../../utils/constant";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";
class Section extends Component {
  handleNavigate = (item) => {
    const { history, urlNavigate } = this.props;
    history.push(`/${urlNavigate}/${item.id}`);
  };
  render() {
    const { bg_Color, title, data, doctor, language } = this.props;

    let settings = {
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
    };

    return (
      <div className="section-section" style={{ background: bg_Color }}>
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">{title}</span>
            <button className="btn-section">
              <FormattedMessage id={"homepage.more"} />
            </button>
          </div>
          <div className="section-body">
            <Slider {...settings}>
              {data?.map((item) => {
                // vì ở backend chưa convert image lưu ở database từ dạng Buffer
                // sang string lên ta sẽ làm ở fontend bằng đoạn code dưới
                let imageBase64;
                if (item.image) {
                  imageBase64 = Buffer.from(item.image, "base64").toString(
                    "binary"
                  );
                }

                if (doctor) {
                  let nameVi = `${item.positionData?.valueVi}, ${item.firstName} ${item.lastName}`;
                  let nameEN = `${item.positionData?.valueEn}, ${item.firstName} ${item.lastName}`;
                  return (
                    <div
                      key={item.id}
                      className="section-customie"
                      onClick={() => this.handleNavigate(item)}
                    >
                      <div className="outer_bg">
                        <div
                          className="bg-image"
                          style={{
                            backgroundImage: imageBase64
                              ? `url(${imageBase64})`
                              : "",
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                          }}
                        ></div>
                      </div>
                      <div className="position text-center">
                        <div>
                          <span>
                            {language === LANGUAGE.VI ? nameVi : nameEN}
                          </span>
                          {/* <span>{item.specialty}</span> */}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={item.id}
                      className="section-customie"
                      onClick={() => this.handleNavigate(item)}
                    >
                      <div className="outer_bg">
                        <div
                          className="bg-image"
                          style={{
                            backgroundImage: imageBase64
                              ? `url(${imageBase64})`
                              : "",
                          }}
                        ></div>
                      </div>
                      <div className="position text-center">
                        <span>{item.name}</span>
                      </div>
                    </div>
                  );
                }
              })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Section)
);
