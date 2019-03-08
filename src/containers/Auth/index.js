import React, { Component } from "react";
import styles from "./styles.scss";

class Auth extends Component {
  render() {
    return (
      <div className={styles.authSection}>
        <div className={styles.authContainer}>
          <div className={styles.selectorButtons}>
            <div className={[styles.selectorButton].join(" ")}>Register</div>
            <div className={[styles.selectorButton].join(" ")}>Log In</div>
          </div>
          <div className={styles.authTitle}>TITLE</div>
          <div className={styles.formContainer}>FORMSS</div>
        </div>
      </div>
    );
  }
}

export default Auth;
