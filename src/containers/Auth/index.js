import React, { Component, Fragment } from "react";
import styles from "./styles.scss";

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
          <Fragment>
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
                <button className={styles.submitButton} type="submit">
                  Register!
                </button>
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
