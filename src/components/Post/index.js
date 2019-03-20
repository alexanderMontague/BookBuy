import React, { useState } from "react";
import "./styles.scss";
import styles from "./styles.scss";
import moment from "moment";
import { Transition } from "react-transition-group";

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
    <div className={[styles.postContainer].join(" ")}>
      <div
        className={[
          styles.postHeader,
          isGrey || isDrawerOpen ? styles.isGrey : null
        ].join(" ")}
        onClick={drawerToggle}
      >
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
      <Transition
        in={isDrawerOpen}
        appear={isDrawerOpen}
        timeout={500}
        classNames={{ ...styles }}
      >
        {state =>
          isDrawerOpen && (
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
          )
        }
      </Transition>
    </div>
  );
};

export default Post;
