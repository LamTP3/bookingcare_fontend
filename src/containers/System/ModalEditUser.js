import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import _ from "lodash";
// import { FormattedMessage } from 'react-intl';
class ModalEditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
    };
  }

  componentDidMount() {
    let user = this.props.currentUser;

    if (user && !_.isEmpty(user)) {
      this.setState({
        id: user.id,
        email: user.email,
        password: "harcode",
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
      });
    }
  }

  handleOnChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrInput = ["email", "password", "firstName", "lastName", "address"];

    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValid = false;
        alert("Missing parameter: " + arrInput[i]);
        break;
      }
    }

    return isValid;
  };

  handleSaveUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid) {
      this.props.editUser(this.state);
    }
  };

  render() {
    return (
      <>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          className={`modal-user-container`}
          centered
        >
          <form>
            <ModalHeader toggle={this.props.toggle}>Edit user</ModalHeader>
            <ModalBody>
              <div className="modal-user-body">
                <div className="input-container">
                  <label>Email: </label>
                  <input
                    type="text"
                    value={this.state.email}
                    autoComplete="new-email"
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "email")
                    }
                    disabled
                  />
                </div>
                <div className="input-container">
                  <label>Password: </label>
                  <input
                    type="password"
                    value={this.state.password}
                    autoComplete="new-password"
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "password")
                    }
                    disabled
                  />
                </div>
                <div className="input-container">
                  <label>First Name: </label>
                  <input
                    type="text"
                    value={this.state.firstName}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "firstName")
                    }
                  />
                </div>
                <div className="input-container">
                  <label>Last Name: </label>
                  <input
                    type="text"
                    value={this.state.lastName}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "lastName")
                    }
                  />
                </div>
                <div className="input-container">
                  <label>Address: </label>
                  <input
                    type="text"
                    value={this.state.address}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "address")
                    }
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.handleSaveUser}>
                Save changes
              </Button>
              <Button color="secondary" onClick={this.props.toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
