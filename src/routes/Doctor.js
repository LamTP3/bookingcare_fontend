import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
// import ManageSchedule from "../containers/System/Doctor/ManageSchedule";
import ManagePatient from "../containers/System/Doctor/ManagePatient";
import Header from "../containers/HeaderSystem/Header";
class Doctor extends Component {
  render() {
    const { isLoggedIn, systemMenuPath } = this.props;
    return (
      <>
        {isLoggedIn && <Header />}
        <div className="system-container">
          <div className="system-list">
            <Switch>
              {/** vào menuApp để mở /doctor/manage-schedule
               *   để này thì vào được tuy nhiên nếu để /system/manage-schedule
               *   thì không vào được
               *
               */}
              {/* <Route
                path="/doctor/manage-schedule"
                component={ManageSchedule}
              /> */}
              <Route path="/doctor/manage-patient" component={ManagePatient} />
              {/**
               * code dưới dùng để mặc định nếu nhập đường link lạ thì sẽ
               * điều hướng về đường link mặc định của roleId này
               */}
              <Route
                component={() => {
                  return <Redirect to={systemMenuPath} />;
                }}
              />
            </Switch>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
