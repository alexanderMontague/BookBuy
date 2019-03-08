import React from "react";
import styles from "./styles.scss";

const Post = props => {
  return (
    <div className={styles.postContainer}>
      <div className={[styles.postHeaderItem, styles.date].join(" ")}>
        02/22/2019
      </div>
      <div className={[styles.postHeaderItem, styles.program].join(" ")}>
        CIS (Computing and Information Sciences)
      </div>
      <div className={[styles.postHeaderItem, styles.course].join(" ")}>
        1500
      </div>
      <div className={[styles.postHeaderItem, styles.name].join(" ")}>
        Change By Design, Design Cool Shit!
      </div>
      <div className={[styles.postHeaderItem, styles.price].join(" ")}>$70</div>
    </div>
  );
};

export default Post;
