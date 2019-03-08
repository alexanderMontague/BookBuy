import React, { Component } from "react";
import styles from "./styles.scss";

import InputWrapper from "../../components/InputWrapper";

class Auth extends Component {
  state = {
    selectedAuth: "register"
  };

  authButtonClickHandler = event => {
    this.setState({ selectedAuth: event.target.id });
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
          <div className={[styles.formContainer].join(" ")}>
            {selectedAuth === "register" ? (
              <form className={styles.form}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Full Name"
                />
                <input
                  className={styles.input}
                  type="email"
                  placeholder="Email Address"
                />
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="Phone Number"
                />
                <input
                  className={styles.input}
                  type="password"
                  placeholder="Password"
                />
                <input
                  className={styles.input}
                  type="password"
                  placeholder="Re-enter Password"
                />
              </form>
            ) : (
              <form className={[styles.form].join(" ")}>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="Email Address"
                />
                <input
                  className={styles.input}
                  type="password"
                  placeholder="Password"
                />
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Auth;
