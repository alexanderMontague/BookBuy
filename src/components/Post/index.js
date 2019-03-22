import React, { useState, useEffect } from "react";
import "./styles.scss";
import styles from "./styles.scss";
import moment from "moment";
import { Transition } from "react-transition-group";
import placeholder from "../../assets/noPic.jpg";
import { ClipLoader } from "react-spinners";
import firebase from "../../firebase";

const Post = props => {
  const {
    bookAuthor,
    bookPrice,
    bookTitle,
    courseLevel,
    datePosted,
    program,
    hasPicture,
    userInfo,
    postId,
    isGrey
  } = props;

  const [isDrawerOpen, drawerToggleHandler] = useState(false);
  const [bookURL, updateBookURL] = useState("");

  useEffect(() => {
    async function getBookPicture() {
      const bookURL = await firebase.getBookPicture(postId);
      updateBookURL(bookURL);
    }

    // check if book has picture, and if so fetch it
    if (hasPicture) {
      getBookPicture();
    }
  }, []);

  const drawerToggle = () => {
    drawerToggleHandler(!isDrawerOpen);
  };

  return (
    <div className={[styles.postContainer].join(" ")}>
      <div
        className={[styles.postHeader, isGrey ? styles.isGrey : null].join(" ")}
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
                <div className={styles.bookTitle}>{bookTitle}</div>
                <div className={styles.assetContainer}>
                  <div className={styles.infoContainer}>
                    <div className={styles.infoSection}>
                      <div className={styles.infoTitle}>Book Information</div>
                      <div className={styles.row}>
                        <div className={styles.label}>Book Title: </div>
                        <div className={styles.value}>{bookTitle}</div>
                      </div>
                      <div className={styles.row}>
                        <div className={styles.label}>Book Author: </div>
                        <div className={styles.value}>{bookAuthor}</div>
                      </div>
                      <div className={styles.row}>
                        <div className={styles.label}>Book Program: </div>
                        <div className={styles.value}>{program.label}</div>
                      </div>
                      <div className={styles.row}>
                        <div className={styles.label}>Course Level: </div>
                        <div className={styles.value}>{courseLevel}</div>
                      </div>
                    </div>
                    <div className={styles.infoSection}>
                      <div className={styles.infoTitle}>
                        Contact Information
                      </div>
                      <div className={styles.row}>
                        <div className={styles.label}>Contact Name: </div>
                        <div className={styles.value}>{userInfo.fullName}</div>
                      </div>
                      <div className={styles.row}>
                        <div className={styles.label}>Contact Email: </div>
                        <div className={styles.value}>{userInfo.email}</div>
                      </div>
                      <div className={styles.row}>
                        <div className={styles.label}>Contact Phone: </div>
                        <div className={styles.value}>{`(${userInfo.phone.slice(
                          0,
                          3
                        )})-${userInfo.phone.slice(
                          3,
                          6
                        )}-${userInfo.phone.slice(
                          6,
                          userInfo.phone.length
                        )}`}</div>
                      </div>
                      <div className={styles.row}>
                        <div className={styles.label}>Date Posted: </div>
                        <div className={styles.value}>
                          {moment.unix(datePosted).format("MMMM Do YYYY")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.picture}>
                    <img
                      className={styles.asset}
                      src={hasPicture ? bookURL : placeholder}
                    />
                  </div>
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
