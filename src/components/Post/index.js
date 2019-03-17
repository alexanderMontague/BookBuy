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
      className={[styles.postContainer, isGrey ? styles.isGrey : null].join(
        " "
      )}
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
          <div className={styles.drawerInfo}>Drawer</div>
        </div>
      )}
    </div>
  );
};

export default Post;
