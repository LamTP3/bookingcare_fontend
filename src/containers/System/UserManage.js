import React, { Component } from "react";
import { connect } from "react-redux";
import "./UserManage.scss";
import {
  getAllUsers,
  createUserService,
  deleteUserService,
  editUserService,
} from "../../services/userService";
import { emitter } from "../../utils/emitter";
import ModalUser from "./ModalUser";
import ModalEditUser from "./ModalEditUser";
// import { FormattedMessage } from 'react-intl';

class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      loading: true,
      isOpenModalUser: false,
      isOpenEditUser: false,
      userEdit: {},
    };
  }

  async componentDidMount() {
    await this.displayAllUsers();
  }

  displayAllUsers = async () => {
    let response = await getAllUsers("ALL");
    if (response && response.errCode === 0) {
      this.setState({
        arrUsers: response.users,
        loading: false,
      });
    } else {
      this.setState({ loading: false });
    }
  };

  handleAddNewUser = async () => {
    this.setState({
      isOpenModalUser: true,
    });
  };

  toggleUserModal = () => {
    this.setState({
      isOpenModalUser: !this.state.isOpenModalUser,
    });
  };
  toggleUserEditModal = () => {
    this.setState({
      isOpenEditUser: !this.state.isOpenEditUser,
    });
  };

  createNewUser = async (data) => {
    try {
      let response = await createUserService(data);
      if (response && response.errCode !== 0) {
        alert(response.message);
      } else {
        await this.displayAllUsers();

        this.setState({
          isOpenModalUser: false,
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleDeleteUser = async (id) => {
    try {
      let res = await deleteUserService(id);
      if (res && res.errCode === 0) {
        await this.displayAllUsers();
      } else {
        alert(res.errMessage);
      }
    } catch (error) {}
  };

  handleEditUser = (user) => {
    this.setState({
      isOpenEditUser: true,
    });

    this.setState({
      userEdit: user,
    });
  };

  editUser = async (data) => {
    try {
      let response = await editUserService(data);
      if (response && response.errCode !== 0) {
        // alert(response.message);
        console.log(response);
      } else {
        await this.displayAllUsers();
        this.setState({
          isOpenEditUser: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { arrUsers, loading } = this.state;

    return (
      <div className="user-container">
        <ModalUser
          isOpen={this.state.isOpenModalUser}
          toggle={this.toggleUserModal}
          createNewUser={this.createNewUser}
        />
        {this.state.isOpenEditUser && (
          <ModalEditUser
            isOpen={this.state.isOpenEditUser}
            toggle={this.toggleUserEditModal}
            currentUser={this.state.userEdit}
            editUser={this.editUser}
          />
        )}
        <div className="title text-center">Manage User With Admin</div>
        <div className=" d-flex justify-content-end mx-3 ">
          <button
            className="btn btn-primary px-3"
            onClick={() => this.handleAddNewUser()}
          >
            <i className="fas fa-plus"></i> Add new users
          </button>
        </div>
        <div className="table-user mt-4 mx-3 ">
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : arrUsers.length > 0 ? (
                arrUsers.map((item, index) => (
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
