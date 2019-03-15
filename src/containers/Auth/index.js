import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import styles from "./styles.scss";

import FloatingLabel, {
  floatingStyles,
  focusStyles,
  inputStyles,
  labelStyles
} from "floating-label-react";
import { ClipLoader } from "react-spinners";
import { getUserStatus } from "../../actions/authActions";
import firebase from "../../firebase";

const inputStyle = {
  floating: {
    ...floatingStyles,
    color: "#333333"
  },
  focus: {
    ...focusStyles,
    borderColor: "#333333"
  },
  input: {
    ...inputStyles,
    borderBottomWidth: 1,
    width: "100%",
    color: "#333333",
    background: "inherit",
    fontFamily: "Overpass",
    paddingLeft: "10px"
  },
  label: {
    ...labelStyles,
    marginTop: ".5em",
    width: "100%",
    color: "grey",
    fontFamily: "Overpass"
  }
};

class Auth extends Component {
  state = {
    selectedAuth: "register",

    regName: "",
    regEmail: "",
    regPhone: "",
    regPasswordOne: "",
    regPasswordTwo: "",
    regError: false,
    regLoading: false,
    regSuccess: false,

    loginEmail: "",
    loginPassword: "",
    loginError: false,
    loginLoading: false,
    loginSuccess: false
  };

  componentDidMount() {
    this.props.isAuthenticated ? (window.location.hash = "#/profile") : null;
  }

  authButtonClickHandler = event => {
    this.setState({ selectedAuth: event.target.id });
  };

  formFieldInputHandler = event => {
    this.setState({ [event.target.id]: event.target.value }, () => {
      this.registerPasswordValidate();
    });
  };

  registerHandler = async () => {
    const { regEmail, regPasswordOne, regName, regPhone } = this.state;
    this.setState({ regLoading: true });

    try {
      await firebase.register(regEmail, regPasswordOne, {
        fullName: regName,
        phone: regPhone
      });
      this.setState({ regSuccess: true });
      setTimeout(() => (window.location.hash = "#/sell"), 3000);
    } catch (error) {
      this.setState({ regError: error.message });
    } finally {
      this.setState({ regLoading: false });
      this.props.getUserStatus();
    }
  };

  registerPasswordValidate = () => {
    const { regPasswordOne, regPasswordTwo } = this.state;

    if (
      !!regPasswordOne &&
      !!regPasswordTwo &&
      regPasswordOne !== regPasswordTwo
    ) {
      return this.setState({ regError: "Passwords do not match!" });
    } else if (
      !!regPasswordOne &&
      !!regPasswordTwo &&
      regPasswordOne === regPasswordTwo &&
      regPasswordOne.length >= 6
    ) {
      return this.setState({ regError: null });
    }

    if (!!regPasswordOne && !!regPasswordTwo && regPasswordOne.length < 6) {
      return this.setState({
        regError: "Password must be at least 6 characters long!"
      });
    }

    return this.setState({ regError: null });
  };

  loginHandler = async () => {
    const { loginEmail, loginPassword } = this.state;
    this.setState({ loginLoading: true });

    try {
      await firebase.login(loginEmail, loginPassword);
      this.setState({ loginSuccess: true });
      setTimeout(() => (window.location.hash = "#/sell"), 3000);
    } catch (error) {
      this.setState({ loginError: error.message });
    } finally {
      this.setState({ loginLoading: false });
      this.props.getUserStatus();
    }
  };

  render() {
    const { selectedAuth } = this.state;

    const registerButtonStyle =
      selectedAuth === "register" ? styles.selected : null;
    const loginButtonStyle = selectedAuth === "login" ? styles.selected : null;

    return (
      <div className={styles.authSection}>
        <div className={styles.authContainer}>
          {this.state.regSuccess || this.state.loginSuccess ? (
            <div className={styles.authSuccess}>
              {this.state.regSuccess ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div>Registration Successful!</div>
                  <div>You will now be logged in.</div>
                </div>
              ) : (
                "Login Successful!"
              )}
            </div>
          ) : (
            <Fragment>
              <div className={styles.selectorButtons}>
                <div
                  className={[styles.selectorButton, registerButtonStyle].join(
                    " "
                  )}
                  onClick={this.authButtonClickHandler}
                  id="register"
                >
                  Register
                </div>
                <div
                  className={[styles.selectorButton, loginButtonStyle].join(
                    " "
                  )}
                  onClick={this.authButtonClickHandler}
                  id="login"
                >
                  Log In
                </div>
              </div>
              <div className={styles.authTitle}>
                {selectedAuth === "register"
                  ? "Register For Free!"
                  : "Welcome Back!"}
              </div>
              <div className={styles.errorMessage}>
                {this.state.regError || this.state.loginError}
              </div>
              <Fragment>
                {selectedAuth === "register" ? (
                  <form
                    className={styles.form}
                    onSubmit={this.registerHandler}
                    key="regForm"
                  >
                    <FloatingLabel
                      styles={inputStyle}
                      type="text"
                      placeholder="Full Name"
                      id="regName"
                      onChange={this.formFieldInputHandler}
                      value={this.state.regName}
                    />
                    <FloatingLabel
                      styles={inputStyle}
                      type="email"
                      placeholder="Email Address"
                      id="regEmail"
                      onChange={this.formFieldInputHandler}
                      value={this.state.regEmail}
                    />
                    <FloatingLabel
                      styles={inputStyle}
                      type="tel"
                      placeholder="Phone Number"
                      id="regPhone"
                      onChange={this.formFieldInputHandler}
                      value={this.state.regPhone}
                    />
                    <FloatingLabel
                      styles={inputStyle}
                      type="password"
                      placeholder="Password"
                      id="regPasswordOne"
                      onChange={this.formFieldInputHandler}
                      value={this.state.regPasswordOne}
                    />
                    <FloatingLabel
                      styles={inputStyle}
                      type="password"
                      placeholder="Re-enter Password"
                      id="regPasswordTwo"
                      onChange={this.formFieldInputHandler}
                      value={this.state.regPasswordTwo}
                    />
                    {this.state.regLoading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: 10
                        }}
                      >
                        <ClipLoader
                          sizeUnit={"px"}
                          size={50}
                          color={"#0069d9"}
                          loading={this.state.regLoading}
                        />
                      </div>
                    ) : (
                      <button
                        className={styles.submitButton}
                        type="submit"
                        disabled={
                          !this.state.regName ||
                          !this.state.regEmail ||
                          !this.state.regPhone ||
                          !this.state.regPasswordOne ||
                          !this.state.regPasswordTwo ||
                          !!this.state.regError
                        }
                      >
                        Register
                      </button>
                    )}
                  </form>
                ) : (
                  <form
                    className={styles.form}
                    onSubmit={this.loginHandler}
                    key="loginForm"
                    style={{ marginTop: 65 }}
                  >
                    <FloatingLabel
                      styles={inputStyle}
                      type="email"
                      placeholder="Email Address"
                      id="loginEmail"
                      onChange={this.formFieldInputHandler}
                      value={this.state.loginEmail}
                    />
                    <FloatingLabel
                      styles={inputStyle}
                      type="password"
                      placeholder="Password"
                      id="loginPassword"
                      onChange={this.formFieldInputHandler}
                      value={this.state.loginPassword}
                    />
                    {this.state.loginLoading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: 50
                        }}
                      >
                        <ClipLoader
                          sizeUnit={"px"}
                          size={50}
                          color={"#0069d9"}
                          loading={this.state.loginLoading}
                        />
                      </div>
                    ) : (
                      <button
                        className={styles.submitButton}
                        type="submit"
                        disabled={
                          !this.state.loginEmail || !this.state.loginPassword
                        }
                        style={{ marginTop: 50 }}
                      >
                        Log In
                      </button>
                    )}
                  </form>
                )}
              </Fragment>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authState.isAuthenticated
});

export default connect(
  mapStateToProps,
  { getUserStatus }
)(Auth);
