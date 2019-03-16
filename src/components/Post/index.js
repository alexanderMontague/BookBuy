import React from "react";
import styles from "./styles.scss";
import moment from "moment";

const Post = props => {
  const {
    bookAuthor,
    bookPrice,
    bookTitle,
    courseLevel,
    datePosted,
    selectedProgram,
    userInfo
  } = props;

  return (
    <div className={styles.postContainer}>
      <div className={[styles.postHeaderItem, styles.date].join(" ")}>
        {moment.unix(datePosted).format("MMM Do YYYY")}
      </div>
      <div className={[styles.postHeaderItem, styles.program].join(" ")}>
        {selectedProgram.label}
      </div>
      <div className={[styles.postHeaderItem, styles.course].join(" ")}>
        {courseLevel}
      </div>
      <div className={[styles.postHeaderItem, styles.name].join(" ")}>
        {bookAuthor}
      </div>
      <div className={[styles.postHeaderItem, styles.price].join(" ")}>
        ${bookPrice}
      </div>
    </div>
  );
};

export default Post;
