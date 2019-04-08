import React, { useState } from "react";
import styles from "./styles.scss";
import { FaTimesCircle } from "react-icons/fa";
import moment from "moment";

const PostItem = props => {
  const { deletePost, datePosted, program, bookTitle, postId } = props;

  const [showDrawer, toggleDrawer] = useState(false);

  return (
    <div className={styles.itemContainer}>
      <div
        className={[styles.postItemContainer, showDrawer && styles.isBlue].join(
          " "
        )}
      >
        <div className={styles.postItemDate}>
          {moment.unix(datePosted).format("DD/MM/YYYY")}
        </div>
        <div className={styles.postItemProgram}>{program.value}</div>
        <div className={styles.postItemTitle}>{bookTitle}</div>
        <FaTimesCircle
          className={styles.postItemDelete}
          color="red"
          onClick={() => toggleDrawer(!showDrawer)}
        />
      </div>
      {showDrawer && (
        <div className={styles.confirmDrawer}>
          <div>Really delete this post?</div>
          <div style={{ display: "flex" }}>
            <span
              className={styles.confirmButton}
              onClick={() => deletePost(postId)}
            >
              YES
            </span>
            <span
              className={styles.confirmButton}
              onClick={() => toggleDrawer()}
            >
              NO
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem;
