import React, { Component } from "react";
import styles from "./styles.scss";

import InputWrapper from "../../components/InputWrapper";

class Profile extends Component {
  render() {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.infoContainer}>
          <div className={styles.header}>Update Profile Info</div>
          <div className={styles.detailsContainer}>
            <label className={styles.inputLabel}>
              Name:
              <input className={styles.input} type="text" />
            </label>
            <label className={styles.inputLabel}>
              Phone:
              <input className={styles.input} type="tel" />
            </label>
            <label className={styles.inputLabel}>
              Email:
              <input className={styles.input} type="email" />
            </label>
            <label className={styles.inputLabel}>
              Old Password:
              <input className={styles.input} type="password" />
            </label>
            <label className={styles.inputLabel}>
              New Password:
              <input className={styles.input} type="password" />
            </label>
            <div className={styles.saveButton}>Save Changes</div>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.header}>Manage Posts</div>
          <div className={styles.detailsContainer}>
            <div>Posting One</div>
            <div>Posting One</div>
            <div>Posting One</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
