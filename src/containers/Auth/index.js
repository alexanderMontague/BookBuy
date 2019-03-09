import React, { Component, Fragment } from "react";
import styles from "./styles.scss";

class Auth extends Component {
  state = {
    selectedAuth: "register",

    regName: "",
    regEmail: "",
    regPhone: "",
    regPasswordOne: "",
    regPasswordTwo: "",

    loginEmail: "",
    loginPassword: ""
  };

  authButtonClickHandler = event => {
    this.setState({ selectedAuth: event.target.id });
  };

  formFieldInputHandler = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  registerHandler = () => {
    console.log(this.state);
  };

  loginHandler = () => {
    console.log(this.state);
  };

  render() {
    const { selectedAuth } = this.state;

    const registerButtonStyle =
      selectedAuth === "register" ? styles.selected : null;
    const loginButtonStyle = selectedAuth === "login" ? styles.selected : null;

    return (
      <div className={styles.authSection}>
        <div className={styles.authContainer}>
          <div className={styles.selectorButtons}>
            <div
              className={[styles.selectorButton, registerButtonStyle].join(" ")}
              onClick={this.authButtonClickHandler}
              id="register"
            >
              Register
            </div>
            <div
              className={[styles.selectorButton, loginButtonStyle].join(" ")}
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
          <Fragment>
            {selectedAuth === "register" ? (
              <form className={styles.form} onSubmit={this.registerHandler}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Full Name"
                  id="regName"
                  onChange={this.formFieldInputHandler}
                  value={this.state.regName}
                />
                <input
                  className={styles.input}
                  type="email"
                  placeholder="Email Address"
                  id="regEmail"
                  onChange={this.formFieldInputHandler}
                  value={this.state.regEmail}
                />
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="Phone Number"
                  id="regPhone"
                  onChange={this.formFieldInputHandler}
                  value={this.state.regPhone}
                />
                <input
                  className={styles.input}
                  type="password"
                  placeholder="Password"
                  id="regPasswordOne"
                  onChange={this.formFieldInputHandler}
                  value={this.state.regPasswordOne}
                />
                <input
                  className={styles.input}
                  type="password"
                  placeholder="Re-enter Password"
                  id="regPasswordTwo"
                  onChange={this.formFieldInputHandler}
                  value={this.state.regPasswordTwo}
                />
                <button className={styles.submitButton} type="submit">
                  Register
                </button>
              </form>
            ) : (
              <form
                className={[styles.form].join(" ")}
                onSubmit={this.loginHandler}
              >
                <input
                  className={styles.input}
                  type="email"
                  placeholder="Email Address"
                  id="loginEmail"
                  onChange={this.formFieldInputHandler}
                  value={this.state.loginEmail}
                />
                <input
                  className={styles.input}
                  type="password"
                  placeholder="Password"
                  id="loginPassword"
                  onChange={this.formFieldInputHandler}
                  value={this.state.loginPassword}
                />
                <button className={styles.submitButton} type="submit">
                  Log In
                </button>
              </form>
            )}
          </Fragment>
        </div>
      </div>
    );
  }
}

export default Auth;
