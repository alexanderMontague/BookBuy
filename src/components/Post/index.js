import React, { useState } from "react";
import styles from "./styles.scss";
import moment from "moment";

const Post = props => {
  const {
    bookAuthor,
    bookPrice,
    bookTitle,
    courseLevel,
    datePosted,
    program,
    userInfo,
    isGrey
  } = props;

  const [isDrawerOpen, drawerToggleHandler] = useState(false);

  const drawerToggle = () => {
    drawerToggleHandler(!isDrawerOpen);
  };

  return (
    <div
      className={[
        styles.postContainer,
        isGrey || isDrawerOpen ? styles.isGrey : null
      ].join(" ")}
      onClick={drawerToggle}
    >
      <div style={{ display: "flex", alignItems: "center", height: 70 }}>
        <div className={[styles.postHeaderItem, styles.date].join(" ")}>
          {moment.unix(datePosted).format("MMM Do YYYY")}
        </div>
        <div className={[styles.postHeaderItem, styles.program].join(" ")}>
          {program.label}
        </div>
        <div className={[styles.postHeaderItem, styles.course].join(" ")}>
          {courseLevel}
        </div>
        <div className={[styles.postHeaderItem, styles.name].join(" ")}>
          {bookTitle}
        </div>
        <div className={[styles.postHeaderItem, styles.price].join(" ")}>
          ${bookPrice}
        </div>
      </div>
      {isDrawerOpen && (
        <div className={styles.drawerContainer}>
          <div className={styles.drawerInfo}>
            <div className={styles.bookTitle}>Title</div>
            <div className={styles.assetContainer}>
              <div className={styles.infoContainer}>
                <div className={styles.row}>
                  <div className={styles.label}>Label</div>
                  <div className={styles.value}>Info</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Label</div>
                  <div className={styles.value}>Info</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Label</div>
                  <div className={styles.value}>Info</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Label</div>
                  <div className={styles.value}>Info</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Label</div>
                  <div className={styles.value}>Info</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.label}>Label</div>
                  <div className={styles.value}>Info</div>
                </div>
              </div>
              <div className={styles.picture}>Image</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
