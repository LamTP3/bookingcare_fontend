import React, { Component } from "react";
import { connect } from "react-redux";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "./ManageDoctor.scss";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { getDetailInforDoctor } from "../../../services/userService";
import { CRUD_ACTIONS, LANGUAGE } from "../../../utils/constant";
import { FormattedMessage } from "react-intl";
const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //save to markdown table
      contentMarkdown: "",
      contentHTML: "",
      selectedDoctor: null,
      description: "",
      listDoctors: [],
      hasOldData: false,

      //save to doctor_infor table
      listPrice: [],
      listPayment: [],
      listProvince: [],
      listClinic: [],
      listSpecialty: [],

      selectedPrice: null,
      selectedPayment: null,
      selectedProvince: null,
      selectedClinic: null,
      selectedSpecialty: null,

      nameClinic: "",
      addressClinic: "",
      note: "",
      specialtyId: "",
      clinicId: "",
    };
  }

  async componentDidMount() {
    this.props.loadAllDoctor();
    this.props.getRequiredDoctorInfor();
  }

  buildDataInput = (inputData, type) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.forEach((item) => {
        if (type === "user") {
          let object = {};
          let labelVi = `${item.firstName} ${item.lastName}`;
          let labelEn = `${item.lastName} ${item.firstName}`;
          object.label = language === LANGUAGE.VI ? labelVi : labelEn;

          object.value = item.id;
          result.push(object);
        }
        if (type === "price") {
          let object = {};
          let labelVi = `${item.valueVi} VND`;
          let labelEn = `${item.valueEn} USD`;
          object.label = language === LANGUAGE.VI ? labelVi : labelEn;

          object.value = item.keyMap;
          result.push(object);
        }

        if (type === "payment" || type === "province") {
          let object = {};
          let labelVi = `${item.valueVi} `;
          let labelEn = `${item.valueEn}`;
          object.label = language === LANGUAGE.VI ? labelVi : labelEn;

          object.value = item.keyMap;
          result.push(object);
        }
        if (type === "specialty" || type === "clinic") {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        }
      });
    }
    return result;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctor !== this.props.allDoctor) {
      let dataSelect = this.buildDataInput(this.props.allDoctor, "user");
      this.setState({
        listDoctors: dataSelect,
      });
    }
    // logic bên trong code này dùng để giúp cho label của
    // thư viện react select hiện ra khi ta đổi ngôn ngữ
    // cũng đổi sang ngôn ngữ tương ứng
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInput(this.props.allDoctor, "user");
      this.setState({
        listDoctors: dataSelect,
      });
      let { resPrice, resPayment, resProvince } =
        this.props.allRequiredDoctorInfor;

      let dataSelectPrice = this.buildDataInput(resPrice, "price");
      let dataSelectPayment = this.buildDataInput(resPayment, "payment");
      let dataSelectProvince = this.buildDataInput(resProvince, "province");
      this.setState({
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
      });
    }

    if (
      prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor
    ) {
      let { resPrice, resPayment, resProvince, resSpecialty, resClinic } =
        this.props.allRequiredDoctorInfor;

      let dataSelectPrice = this.buildDataInput(resPrice, "price");
      let dataSelectPayment = this.buildDataInput(resPayment, "payment");
      let dataSelectProvince = this.buildDataInput(resProvince, "province");
      let dataSelectSpecialty = this.buildDataInput(resSpecialty, "specialty");
      let dataSelectClinic = this.buildDataInput(resClinic, "clinic");
      this.setState({
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
        listSpecialty: dataSelectSpecialty,
        listClinic: dataSelectClinic,
      });
    }
  }

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentHTML: html,
      contentMarkdown: text,
    });
  };

  handleSubmit = () => {
    let { hasOldData } = this.state;
    this.props.saveDetailDoctor({
      // save for markdown table
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedDoctor?.value,
      actions: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

      // save for doctor infor table
      selectedPrice: this.state.selectedPrice?.value,
      selectedPayment: this.state.selectedPayment?.value,
      selectedProvince: this.state.selectedProvince?.value,
      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      note: this.state.note,
      specialtyId: this.state.selectedSpecialty?.value,
      clinicId: this.state.selectedClinic?.value,
    });
  };

  findDoctor = async (selectedDoctor) => {
    this.setState({ selectedDoctor });
    let { listPayment, listPrice, listProvince, listSpecialty, listClinic } =
      this.state;
    let res = await getDetailInforDoctor(selectedDoctor.value);
    //nếu tìm thấy thông tin doctor thì gán hasOldData là true, nghĩa là có dữ liệu hiển thị
    if (res && res.errCode === 0 && res.data && res.data.Markdown) {
      let markdown = res.data.Markdown;

      let addressClinic = "";
      let nameClinic = "";
      let note = "";

      let paymentId = "";
      let priceId = "";
      let provinceId = "";
      let specialtyId = "";
      let clinicId = "";

      let selectedPayment = "";
      let selectedPrice = "";
      let selectedProvince = "";
      let selectedSpecialty = "";
      let selectedClinic = "";

      if (res.data.Doctor_Infor) {
        addressClinic = res.data.Doctor_Infor.addressClinic;
        nameClinic = res.data.Doctor_Infor.nameClinic;
        note = res.data.Doctor_Infor.note;
        paymentId = res.data.Doctor_Infor.paymentId;
        priceId = res.data.Doctor_Infor.priceId;
        provinceId = res.data.Doctor_Infor.provinceId;
        specialtyId = res.data.Doctor_Infor.specialtyId;
        clinicId = res.data.Doctor_Infor.clinicId;

        //  code dưới có tác dụng set giá trị default của thẻ select bằng giá trị
        // tương tứng của bác sĩ đó trong db
        selectedPayment = listPayment.find((item) => {
          return item && item.value === paymentId;
        });
        selectedPrice = listPrice.find((item) => {
          return item && item.value === priceId;
        });
        selectedProvince = listProvince.find((item) => {
          return item && item.value === provinceId;
        });
        selectedSpecialty = listSpecialty.find((item) => {
          return item && item.value === specialtyId;
        });

        selectedClinic = listClinic.find((item) => {
          return item && item.value === clinicId;
        });
      }
      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        hasOldData: true,

        nameClinic: nameClinic,
        addressClinic: addressClinic,
        note: note,
        selectedPayment: selectedPayment,
        selectedPrice: selectedPrice,
        selectedProvince: selectedProvince,
        selectedSpecialty: selectedSpecialty,
        selectedClinic: selectedClinic,
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        hasOldData: false,
        nameClinic: "",
        addressClinic: "",
        note: "",
      });
    }
  };

  handleChangeSelectDoctorInfor = async (selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({
      ...stateCopy,
    });
  };

  handleOnChangeText = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({ ...stateCopy });
  };

  render() {
    let { hasOldData } = this.state;

    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">
          <FormattedMessage id="admin.manage-doctor.title" />
        </div>
        <div className="more-infor ">
          <div className="content-left ">
            <label>
              <FormattedMessage id="admin.manage-doctor.select-doctor" />
            </label>
            <Select
              value={this.state.selectedDoctor}
              onChange={this.findDoctor}
              options={this.state.listDoctors}
              placeholder={
                <FormattedMessage id="admin.manage-doctor.select-doctor" />
              }
            />
          </div>
          <div className="content-right">
            <label>
              <FormattedMessage id="admin.manage-doctor.intro" />
            </label>
            <textarea
              className="text-area form-control"
              onChange={(event) =>
                this.handleOnChangeText(event, "description")
              }
              value={this.state.description}
            ></textarea>
          </div>
        </div>
        <div className="more-infor-extra row">
          <div className="col-4 form-group">
            <label>
              {" "}
              <FormattedMessage id="admin.manage-doctor.price" />{" "}
            </label>
            <Select
              value={this.state.selectedPrice}
              name="selectedPrice"
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listPrice}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              {" "}
              <FormattedMessage id="admin.manage-doctor.payment" />
            </label>
            <Select
              value={this.state.selectedPayment}
              name="selectedPayment"
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listPayment}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              {" "}
              <FormattedMessage id="admin.manage-doctor.province" />
            </label>
            <Select
              value={this.state.selectedProvince}
              name="selectedProvince"
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listProvince}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              {" "}
              <FormattedMessage id="admin.manage-doctor.name-clinic" />
            </label>
            <input
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "nameClinic")}
              value={this.state.nameClinic}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              {" "}
              <FormattedMessage id="admin.manage-doctor.address-clinic" />{" "}
            </label>
            <input
              className="form-control"
              onChange={(event) =>
                this.handleOnChangeText(event, "addressClinic")
              }
              value={this.state.addressClinic}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.note" />
            </label>
            <input
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "note")}
              value={this.state.note}
            />
          </div>
          <div className="row">
            <div className="col-4 form-group">
              <label>
                {" "}
                <FormattedMessage id="admin.manage-doctor.specialty" />
              </label>
              <Select
                value={this.state.selectedSpecialty}
                name="selectedSpecialty"
                onChange={this.handleChangeSelectDoctorInfor}
                options={this.state.listSpecialty}
              />
            </div>
            {/**
             * Trường bên dưới là lấy từ bảng Clinic không liên quan gì đến
             * 2 trường input là address Clinic và name Clinic ở trên
             * và lý do bị vậy là do việc thiết kế db đang có vấn đề
             * về việc bảng doctor infor lưu trường name Clinic
             * và address Clinic. Lên trường phía dưới sinh ra là biện pháp
             * phòng cháy. Lên dành thời gian để sửa db lại
             */}
            <div className="col-4 form-group">
              <label> Chọn Phòng Khám Bệnh </label>

              <Select
                value={this.state.selectedClinic}
                name="selectedClinic"
                onChange={this.handleChangeSelectDoctorInfor}
                options={this.state.listClinic}
              />
            </div>
          </div>
        </div>

        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.contentMarkdown}
          />
          <button
            className={
              hasOldData === true
                ? "save-content-doctor"
                : "create-content-doctor"
            }
            onClick={() => this.handleSubmit()}
          >
            {hasOldData === true ? (
              <span>
                <FormattedMessage id="admin.manage-doctor.save" />
              </span>
            ) : (
              <span>
                <FormattedMessage id="admin.manage-doctor.add" />
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    language: state.app.language,
    allDoctor: state.admin.allDoctor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
