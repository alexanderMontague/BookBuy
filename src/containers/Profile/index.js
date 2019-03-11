import React, { Component } from "react";
import styles from "./styles.scss";

import { FaTimesCircle } from "react-icons/fa";

const PostItem = props => {
  return (
    <div className={styles.postItemContainer}>
      <div className={styles.postItemDate}>21/04/2019</div>
      <div className={styles.postItemProgram}>CIS</div>
      <div className={styles.postItemTitle}>Fundamentals of Computing</div>
      <FaTimesCircle className={styles.postItemDelete} color="red" />
    </div>
  );
};

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
            <div className={styles.postHeader}>
              <div className={styles.postCol}>Date Posted</div>
              <div className={styles.progCol}>Program</div>
              <div className={styles.titleCol}>Title</div>
              <div className={styles.fillerItem} />
            </div>
            <div className={styles.postsContainer}>
              <PostItem />
              <PostItem />
              <PostItem />
              <PostItem />
              <PostItem />
              <PostItem />
              <PostItem />
              <PostItem />
              <PostItem />
              <PostItem />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
