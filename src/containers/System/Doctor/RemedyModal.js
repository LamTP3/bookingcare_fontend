import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import "./RemedyModal.scss";
// import ProfileDoctor from "../ProfileDoctor";
// import * as action from "../../../../store/actions/adminActions";
// import { LANGUAGE } from "../../../../utils";
// import Select from "react-select";
// import { postBookAppointmentService } from "../../../../services/userService";
// import { toast } from "react-toastify";
// import { FormattedMessage } from "react-intl";
// import _ from "lodash";
// import moment from "moment";
import { CommonUtils } from "../../../utils";
class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      imgBase64: "",
    };
  }

  async componentDidMount() {
    if (this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email || "",
      });
    }
  }

  async componentDidUpdate(prevProps, prveState, snapshot) {
    if (prevProps.dataModal !== this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }

  handleOnChangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handleOnChangeImage = async (e) => {
    let file = e.target.files[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);

      this.setState({
        imgBase64: base64,
      });
    }
  };

  hanleSendRemedy = () => {
    this.props.sendRemedy(this.state);
  };
  render() {
    let { isOpenModal, closeRemedyModal } = this.props;
    return (
      <>
        <Modal
          isOpen={isOpenModal}
          className={"booking-modal-container"}
          size="lg"
          centered
          toggle={closeRemedyModal}
        >
          {/**
           * Không biết nguyên nhân vì lý do gì mà ModalHeader ở file UserManage có nút X
           * còn dùng ở file này thì không
           */}
          {/* <ModalHeader toggle={closeRemedyModal}>Modal Title</ModalHeader> */}

          <div className="modal-header">
            <h5 className="modal-title">Gửi hóa đơn khám bệnh</h5>
            <Button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeRemedyModal}
            ></Button>
          </div>
          <ModalBody>
            <div className="row">
              <div className="col-6 form-group">
                <label>Email Bệnh Nhân</label>
                <input
                  type="email"
                  value={this.state.email}
                  className="form-control"
                  onChange={(event) => this.handleOnChangeEmail(event)}
                />
              </div>
              <div className="col-6 form-group">
                <label>Chọn file đơn thuốc</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(event) => {
                    this.handleOnChangeImage(event);
                  }}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.hanleSendRemedy()}>
              Send
            </Button>
            <Button color="secondary" onClick={closeRemedyModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
