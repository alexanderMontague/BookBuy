import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import styles from "./styles.scss";
import { Link } from "react-router-dom";
import FloatingLabel, {
  floatingStyles,
  focusStyles,
  inputStyles,
  labelStyles
} from "floating-label-react";
import InputWrapper from "../../components/InputWrapper";
import { ClipLoader } from "react-spinners";
import Select from "react-select";
import { getUserStatus } from "../../actions/authActions";
import firebase from "../../firebase";
import { schoolDropdownValues } from "../../assets/dropdownValues";
import Modal from "react-modal";

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
    paddingLeft: "10px",
    zIndex: "1"
  },
  label: {
    ...labelStyles,
    marginTop: ".5em",
    width: "100%",
    color: "grey",
    fontFamily: "Overpass",
    zIndex: "0"
  }
};

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "300px"
  }
};

// accessability stuff?
Modal.setAppElement("#app");

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
    regSchool: { label: "University of Guelph", value: "UofG" },

    loginEmail: "",
    loginPassword: "",
    loginError: false,
    loginLoading: false,
    loginSuccess: false,

    forgotEmail: "",
    forgotFeedback: "",
    isForgotModalOpen: false
  };

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.history.push({
        pathname: "/profile"
      });
    }
  }

  authButtonClickHandler = event => {
    this.setState({ selectedAuth: event.target.id });
  };

  formFieldInputHandler = event => {
    this.setState({ [event.target.id]: event.target.value }, () => {
      this.registerPasswordValidate();
      this.phoneValidate();
    });
  };

  registerHandler = async event => {
    event.preventDefault();
    const {
      regEmail,
      regPasswordOne,
      regName,
      regPhone,
      regSchool
    } = this.state;
    this.setState({ regLoading: true });

    try {
      await firebase.register(regEmail, regPasswordOne, {
        fullName: regName,
        phone: regPhone,
        school: regSchool
      });
      this.setState({ regSuccess: true });
      setTimeout(
        () =>
          this.props.history.push({
            pathname: "/postings"
          }),
        2000
      );
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

  phoneValidate() {
    const { regPhone, regError } = this.state;

    if (!!regPhone && regPhone.length < 10) {
      return this.setState({ regError: "Phone number must be valid!" });
    }

    return (
      regError === "Phone number must be valid!" &&
      this.setState({ regError: null })
    );
  }

  loginHandler = async event => {
    event.preventDefault();
    const { loginEmail, loginPassword } = this.state;
    this.setState({ loginLoading: true });

    try {
      await firebase.login(loginEmail, loginPassword);
      this.setState({ loginSuccess: true });
      setTimeout(
        () =>
          this.props.history.push({
            pathname: "/postings"
          }),
        1500
      );
    } catch (error) {
      if (
        error.message ===
          "The password is invalid or the user does not have a password." ||
        "There is no user record corresponding to this identifier. The user may have been deleted."
      ) {
        this.setState({
          loginError: "The email or password entered is incorrect."
        });
      } else {
        this.setState({ loginError: error.message });
      }
    } finally {
      this.setState({ loginLoading: false });
      this.props.getUserStatus();
    }
  };

  schoolSelector = option => {
    this.setState({ selectedSchool: option });
  };

  forgotPasswordHandler = () => {
    const { forgotEmail } = this.state;

    firebase.auth
      .sendPasswordResetEmail(forgotEmail)
      .then(() => {
        this.setState({
          forgotFeedback: "Password reset sent successfully. Check your email!"
        });
      })
      .catch(err => {
        this.setState({
          forgotFeedback:
            "Email is incorrect. Make sure you have registered an account!"
        });
      });
  };

  render() {
    const { selectedAuth } = this.state;

    const registerButtonStyle =
      selectedAuth === "register" ? styles.selected : null;
    const loginButtonStyle = selectedAuth === "login" ? styles.selected : null;

    return (
      <div className={styles.authSection}>
        <Modal
          isOpen={this.state.isForgotModalOpen}
          onRequestClose={() => this.setState({ isForgotModalOpen: false })}
          style={modalStyles}
          contentLabel="Forgot Password"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div className={styles.forgotMessage}>
              {this.state.forgotFeedback}
            </div>
            <FloatingLabel
              styles={inputStyle}
              type="text"
              placeholder="Enter the email used for your account"
              id="forgotEmail"
              onChange={this.formFieldInputHandler}
              value={this.state.forgotEmail}
            />
            <button
              className={styles.forgotButton}
              type="button"
              disabled={!this.state.forgotEmail}
              style={{ marginTop: 50 }}
              onClick={this.forgotPasswordHandler}
            >
              Send Reset Email
            </button>
            <div
              className={styles.backButton}
              onClick={() => this.setState({ isForgotModalOpen: false })}
            >
              Back
            </div>
          </div>
        </Modal>
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
                    <InputWrapper color="#333333" label="School">
                      <Select
                        value={this.state.regSchool}
                        onChange={this.schoolSelector}
                        options={schoolDropdownValues}
                        className={styles.schoolInput}
                      />
                    </InputWrapper>
                    <FloatingLabel
                      styles={inputStyle}
                      type="text"
                      placeholder="Full Name (Shown on your posts)"
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
                    {/* <FloatingLabel
                      styles={inputStyle}
                      type="tel"
                      placeholder="Phone Number"
                      id="regPhone"
                      onChange={this.formFieldInputHandler}
                      value={this.state.regPhone}
                    /> */}
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
                    <div style={{ paddingTop: 20 }}>
                      By registering you agree to our{" "}
                      <Link to="/terms" target="_blank">
                        Terms and Conditions
                      </Link>
                    </div>
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
                    <div
                      className={styles.forgotPassword}
                      onClick={() => this.setState({ isForgotModalOpen: true })}
                    >
                      Forgot Password?
                    </div>
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
