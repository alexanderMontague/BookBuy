import React, { Component } from "react";
import styles from "./styles.scss";

import InputWrapper from "../../components/InputWrapper";

class Profile extends Component {
  render() {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.infoContainer}>
          <div className={styles.header}>Profile Info</div>
          <div className={styles.detailsContainer}>
            <InputWrapper color="#000000" label="Name">
              <div>Name: _______</div>
            </InputWrapper>
            <div>Phone: _______</div>
            <div>Email: _______</div>
            <div>Password: _______</div>
            <div>Save Changes</div>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.header}>Postings</div>
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
