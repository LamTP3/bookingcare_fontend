import React, { Component } from "react";
import { connect } from "react-redux";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import Lightbox from "react-image-lightbox";
import "./ManageClinic.scss";
import { CommonUtils } from "../../../utils";
import { createClinicSercie } from "../../../services/userService";
import { toast } from "react-toastify";
const mdParser = new MarkdownIt();

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      name: "",
      address: "",
      imageBase64: "",
      descriptionMarkdown: "",
      descriptionHTML: "",
      previewImgURL: "",
    };
    // Tạo tham chiếu đến trường input của file
    // Mục đích để sau khi submit ta có thể clear được tên file ảnh trước
    // khỏi trường input
    this.fileInputRef = React.createRef();
  }
  async componentDidMount() {}

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleOnChangeImage = async (e) => {
    let file = e.target.files[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let obeject = URL.createObjectURL(file);
      this.setState({
        previewImgURL: obeject,
        imageBase64: base64,
      });
    }
  };

  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpen: true,
    });
  };

  async componentDidUpdate(prevProps, prveState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  onChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({ ...stateCopy });
  };
  handleSubmit = async () => {
    let { name, imageBase64, address, descriptionMarkdown, descriptionHTML } =
      this.state;
    let res = await createClinicSercie({
      name: name,
      imageBase64: imageBase64,
      descriptionMarkdown: descriptionMarkdown,
      descriptionHTML: descriptionHTML,
      address: address,
    });
    if (res && res.errCode === 0) {
      toast.success(`Create success`);
      this.setState({
        name: "",
        address: "",
        imageBase64: "",
        descriptionMarkdown: "",
        descriptionHTML: "",
        previewImgURL: "",
      });
      this.fileInputRef.current.value = null;
    } else {
      toast.error(`Something wrong ...`);
    }
  };

  render() {
    return (
      <>
        <div className="manage-specialty-container">
          <div className="ms-title">Quản lý Phòng Khám</div>

          <div className="all-specailty row">
            <div className="col-6 form-group">
              <label>Tên Phòng Khám</label>
              <input
                className="form-control"
                type="text"
                value={this.state.name}
                onChange={(event) => this.onChangeInput(event, "name")}
              />
            </div>
            <div className="col-6 form-group">
              <label>Ảnh Phòng Khám</label>
              <input
                className="form-control"
                type="file"
                ref={this.fileInputRef} // Gán tham chiếu đến trường input
                onChange={(e) => this.handleOnChangeImage(e)}
              />
            </div>
            <div className="col-6 form-group">
              <label>Địa chỉ phòng khám</label>
              <input
                className="form-control"
                type="text"
                value={this.state.address}
                onChange={(event) => this.onChangeInput(event, "address")}
              />
            </div>
            <div className="col-6 mt-4 m-c-container">
              <div
                className="preview-image"
                style={{
                  backgroundImage: `url(${this.state.previewImgURL})`,
                }}
                onClick={() => this.openPreviewImage()}
              ></div>
            </div>
            <div className="col-12 mt-3">
              <MdEditor
                style={{ height: "375px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={this.handleEditorChange}
                value={this.state.descriptionMarkdown}
              />
            </div>
          </div>
          <div className="col-12 mt-3">
            <button
              className="btn-save-specialty"
              onClick={() => this.handleSubmit()}
            >
              {" "}
              Save
            </button>
          </div>
        </div>
        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImgURL}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
