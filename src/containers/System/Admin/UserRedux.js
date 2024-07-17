import React, { Component } from "react";
import { LANGUAGE, CRUD_ACTIONS } from "../../../utils/constant";
import { CommonUtils } from "../../../utils";
import { connect } from "react-redux";
import * as action from "../../../store/actions";
import { FormattedMessage } from "react-intl";
import TableManageUser from "./TableUser";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "./UserRedux.scss";

class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      previewImgURL: "",
      isOpen: false,
      form: {
        id: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        address: "",
        phonenumber: "",
        gender: "",
        roleId: "",
        positionId: "",
        image: "",
      },
      action: "",
    };
  }

  async componentDidMount() {
    this.props.getPositionStart();
    this.props.getRoleStart();
    this.props.getGenderStart();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.genderRedux !== this.props.genderRedux) {
      this.setState({
        genderArr: this.props.genderRedux,
        form: {
          ...this.state.form,
          gender: this.props?.genderRedux[0]?.keyMap,
        },
      });
    }

    if (prevProps.roleRedux !== this.props.roleRedux) {
      this.setState({
        form: {
          ...this.state.form,
          roleId: this.props?.roleRedux[0]?.keyMap,
        },
      });
    }

    if (prevProps.positionRedux !== this.props.positionRedux) {
      this.setState({
        form: {
          ...this.state.form,
          positionId: this.props?.positionRedux[0]?.keyMap,
        },
      });
    }
    // code dưới dùng để set lại state khi submit form
    if (prevProps.userData !== this.props.userData) {
      let { genderRedux, roleRedux, positionRedux } = this.props;
      this.setState({
        ...this.state,
        action: CRUD_ACTIONS.CREATE,
        previewImgURL: "",
        form: {
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          address: "",
          phonenumber: "",
          gender:
            genderRedux && genderRedux.length > 0 ? genderRedux[0].keyMap : "",
          roleId: roleRedux && roleRedux.length > 0 ? roleRedux[0].keyMap : "",
          positionId:
            positionRedux && positionRedux.length > 0
              ? positionRedux[0].keyMap
              : "",
          image: "",
        },
      });
    }
  }

  handleOnChangeImage = async (e) => {
    let file = e.target.files[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let obeject = URL.createObjectURL(file);
      this.setState({
        previewImgURL: obeject,
        form: { ...this.state.form, image: base64 },
      });
    }
  };

  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpen: true,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let { action } = this.state;
    if (action === CRUD_ACTIONS.CREATE) {
      this.props.saveUserRedux(this.state.form);
    }

    if (action === CRUD_ACTIONS.EDIT) {
      this.props.editUserRedux(this.state.form);
    }
  };

  handleEditUserFromParent = (user) => {
    let imageBase64 = "";
    if (user.image) {
      imageBase64 = Buffer.from(user.image, "base64").toString("binary");
    }

    this.setState({
      ...this.state,
      action: CRUD_ACTIONS.EDIT,
      previewImgURL: imageBase64,
      form: {
        id: user.id,
        email: user.email,
        password: "********",
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phonenumber: user.phonenumber,
        positionId: user.positionId,
        gender: user.gender,
        roleId: user.roleId,
        image: imageBase64,
      },
    });
  };

  render() {
    let language = this.props.language;
    let gender = this?.props?.genderRedux;
    const { roleRedux, positionRedux } = this.props;

    return (
      <div className="user-redux-container">
        <div className="title ">User Redux Page</div>
        <div className="user-redux-body">
          <div className="container">
            <form
              onSubmit={(e) => {
                this.handleSubmit(e);
              }}
            >
              <div className="row mt-3">
                <div className="form-group col-md-6">
                  <label>
                    <FormattedMessage id="manage-user.email" />
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    autoComplete="new-email"
                    value={this.state.form.email}
                    onChange={(e) => {
                      this.setState({
                        form: {
                          ...this.state.form,
                          email: e.target.value,
                        },
                      });
                    }}
                    disabled={this.state.action === CRUD_ACTIONS.EDIT}
                    required
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>
                    <FormattedMessage id="manage-user.password" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Password"
                    autoComplete="new-password"
                    value={this.state.form.password}
                    onChange={(e) => {
                      this.setState({
                        form: {
                          ...this.state.form,
                          password: e.target.value,
                        },
                      });
                    }}
                    disabled={this.state.action === CRUD_ACTIONS.EDIT}
                    required
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="form-group col-md-6">
                  <label>
                    <FormattedMessage id="manage-user.firstName" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    value={this.state.form.firstName}
                    onChange={(e) => {
                      this.setState({
                        form: {
                          ...this.state.form,
                          firstName: e.target.value,
                        },
                      });
                    }}
                    required
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>
                    <FormattedMessage id="manage-user.lastName" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    value={this.state.form.lastName}
                    onChange={(e) => {
                      this.setState({
                        form: {
                          ...this.state.form,
                          lastName: e.target.value,
                        },
                      });
                    }}
                    required
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="form-group col-md-6 ">
                  <label>
                    <FormattedMessage id="manage-user.phone" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone"
                    value={this.state.form.phonenumber}
                    onChange={(e) => {
                      this.setState({
                        form: {
                          ...this.state.form,
                          phonenumber: e.target.value,
                        },
                      });
                    }}
                    required
                  />
                </div>
                <div className="form-group col-md-6 ">
                  <label>
                    <FormattedMessage id="manage-user.address" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Address"
                    value={this.state.form.address}
                    onChange={(e) => {
                      this.setState({
                        form: {
                          ...this.state.form,
                          address: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="form-group col-md-6 ">
                  <label>
                    <FormattedMessage id="manage-user.position" />
                  </label>
                  <select
                    className="form-control"
                    value={this.state.form.positionId}
                    onChange={(e) => {
                      this.setState({
                        form: {
                          ...this.state.form,
                          positionId: e.target.value,
                        },
                      });
                    }}
                  >
                    {positionRedux &&
                      positionRedux.length > 0 &&
                      positionRedux.map((item) => {
                        return (
                          <option key={item.keyMap} value={item.keyMap}>
                            {language === LANGUAGE.VI
                              ? item.valueVi
                              : item.valueEn}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="form-group col-md-6 ">
                  <label>
                    <FormattedMessage id="manage-user.gender" />
                  </label>
                  <select
                    className="form-control"
                    value={this.state.form.gender}
                    onChange={(e) => {
                      this.setState({
                        form: {
                          ...this.state.form,
                          gender: e.target.value,
                        },
                      });
                    }}
                  >
                    {gender &&
                      gender.length > 0 &&
                      gender.map((item) => {
                        return (
                          <option key={item.keyMap} value={item.keyMap}>
                            {language === LANGUAGE.VI
                              ? item.valueVi
                              : item.valueEn}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
              <div className="row mt-3">
                <div className="form-group col-md-6 ">
                  <label>
                    <FormattedMessage id="manage-user.role" />
                  </label>
                  <select
                    className="form-control"
                    value={this.state.form.roleId}
                    onChange={(e) => {
                      this.setState({
                        form: {
                          ...this.state.form,
                          roleId: e.target.value,
                        },
                      });
                    }}
                  >
                    {roleRedux &&
                      roleRedux.length > 0 &&
                      roleRedux.map((item) => {
                        return (
                          <option key={item.keyMap} value={item.keyMap}>
                            {language === LANGUAGE.VI
                              ? item.valueVi
                              : item.valueEn}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="form-group col-md-6 ">
                  <label>
                    <FormattedMessage id="manage-user.image" />
                  </label>
                  <div className="preview-image-container">
                    <input
                      id="previewImg"
                      type="file"
                      hidden
                      onChange={(e) => this.handleOnChangeImage(e)}
                    />
                    <label htmlFor="previewImg" className="label-upload">
                      Tải ảnh lên <i className="fas fa-upload"></i>
                    </label>
                    <div
                      className="preview-image"
                      style={{
                        backgroundImage: `url(${this.state.previewImgURL})`,
                      }}
                      onClick={() => this.openPreviewImage()}
                    ></div>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className={
                  this.state.action === CRUD_ACTIONS.EDIT
                    ? "btn btn-warning"
                    : "btn btn-primary"
                }
              >
                {this.state.action === CRUD_ACTIONS.EDIT ? (
                  <FormattedMessage id="manage-user.edit" />
                ) : (
                  <FormattedMessage id="manage-user.save" />
                )}
              </button>
            </form>

            <TableManageUser onEdit={this.handleEditUserFromParent} />
          </div>
        </div>
        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImgURL}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.gender,
    roleRedux: state.admin.role,
    positionRedux: state.admin.position,
    isLoadingGender: state.admin.isLoadingGender,
    userData: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(action.fetchGenderStart()),
    getRoleStart: () => dispatch(action.fetchRoleStart()),
    getPositionStart: () => dispatch(action.fetchPositionStart()),
    saveUserRedux: (data) => dispatch(action.createNewUser(data)),
    fecthUserRedux: () => {
      dispatch(action.fetchAllUsers());
    },
    editUserRedux: (data) => dispatch(action.editUser(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
