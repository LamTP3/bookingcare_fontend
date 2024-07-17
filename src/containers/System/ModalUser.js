import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../utils/emitter";
// import { FormattedMessage } from 'react-intl';
class ModalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
    };
    this.listenToEmitter();
  }

  listenToEmitter() {
    emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
      this.handleResetForm();
    });
  } // voiws vue js thì có bus event

  handleResetForm = () => {
    this.setState({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
    });
  };
  componentDidMount() {}

  handleOnChangeInput = (event, id) => {
    // Bad Code
    // this.state[id] = event.target.value;
    // this.setState(
    //   {
    //     ...this.state,
    //   },
    //   () => {
    //     console.log(`Check Bad Code: `, this.state);
    //   }
    // );
    // Good Code
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState(
      {
        ...copyState,
      }
      //   ,
      //   () => {
      //     console.log(`Check Good Code: `, this.state);
      //   }
    );
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

  handleAddNewUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid) {
      this.props.createNewUser(this.state);
    }
  };

  render() {
    return (
      <>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          className={`modal-user-container`}
          //   size="lg"
          centered
        >
          <form>
            <ModalHeader toggle={this.props.toggle}>
              Create a new user
            </ModalHeader>
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
              <Button color="primary" onClick={this.handleAddNewUser}>
                Add New
              </Button>
              <Button color="secondary" onClick={this.handleResetForm}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
