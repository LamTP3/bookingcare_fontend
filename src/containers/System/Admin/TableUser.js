import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
const mdParser = new MarkdownIt();

function handleEditorChange({ html, text }) {
  console.log("handleEditorChange", html, text);
}

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
    };
  }

  async componentDidMount() {
    this.props.fecthUserRedux();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.userData !== this.props.userData) {
      this.setState({
        userData: this.props.userData,
      });
    }
  }

  handleDeleteUser = (id) => {
    this.props.deleteUserRedux(id);
  };

  handleEditUser = (item) => {
    this.props.onEdit(item);
  };

  render() {
    const { userData } = this.state;
    return (
      <div className="my-5">
        <div className="title text-center mb-3 ">User Table</div>
        <table id="customers">
          <thead>
            <tr>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userData && userData.length > 0 ? (
              userData.map((item, index) => (
                <tr key={index}>
                  <td>{item.email}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.address}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => this.handleEditUser(item)}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => this.handleDeleteUser(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-5">
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fecthUserRedux: () => {
      dispatch(actions.fetchAllUsers());
    },
    deleteUserRedux: (id) => {
      dispatch(actions.deleteUser(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
