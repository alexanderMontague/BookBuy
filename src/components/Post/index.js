import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import "./styles.scss";
import styles from "./styles.scss";
import moment from "moment";
import placeholder from "../../assets/noPic.png";
import { ClipLoader } from "react-spinners";
import firebase from "../../firebase";
import { withRouter } from "react-router";

const Post = props => {
  const {
    bookAuthor,
    bookPrice,
    bookTitle,
    bookEdition,
    bookQuality,
    courseLevel,
    datePosted,
    program,
    hasPicture,
    userId,
    postId,
    isGrey,
    isExpandPost,
    expandMorePosts,
    isAuthenticated,
    history,
    user,
    userSchool
  } = props;

  const [isDrawerOpen, drawerToggleHandler] = useState(false);
  const [bookURL, updateBookURL] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const drawerToggle = async () => {
    drawerToggleHandler(!isDrawerOpen);

    // once post is opened get user info
    if (Object.keys(userInfo).length === 0) {
      const postUserInfo = await firebase.getDocsFromCollection("users", [
        ["id", "==", userId]
      ]);
      setUserInfo(postUserInfo[0]);
    }

    // once post is opened get picture if one
    if (bookURL === "" && hasPicture) {
      const bookURL = await firebase.getBookPicture(postId);
      updateBookURL(bookURL);
    }
  };

  // send user to profile page with who to send first message to
  const contactSeller = () => {
    const sellerInfo = {
      id: userInfo.id,
      fullName: userInfo.fullName,
      bookTitle,
      postId,
      messages: []
    };

    history.push({
      pathname: "/profile",
      search: `?send=${btoa(JSON.stringify(sellerInfo))}`
    });
  };

  return (
    <Fragment>
      {isExpandPost && (
        <div className={styles.expandText} onClick={expandMorePosts}>
          Expand more posts!
        </div>
      )}
      <div
        className={[
          styles.postHeader,
          isGrey ? styles.isGrey : null,
          isExpandPost ? styles.expandPosts : null
        ].join(" ")}
        onClick={isExpandPost ? () => expandMorePosts() : drawerToggle}
      >
        <div className={[styles.postHeaderItem, styles.date].join(" ")}>
          {moment.unix(datePosted).format("MMMM Do YYYY")}
        </div>
        <div className={[styles.postHeaderItem, styles.name].join(" ")}>
          {bookTitle}
        </div>
        <div className={[styles.postHeaderItem, styles.program].join(" ")}>
          {program.label}
        </div>
        <div className={[styles.postHeaderItem, styles.course].join(" ")}>
          {courseLevel}
        </div>
        <div className={[styles.postHeaderItem, styles.price].join(" ")}>
          ${bookPrice}
        </div>
      </div>
      {true && (
        <div
          className={[
            styles.drawerContainer,
            isDrawerOpen ? styles.slideAnimation : null
          ].join(" ")}
        >
          <div
            className={styles.drawerInfo}
            style={{ background: isGrey ? "#d6dce0" : null }}
          >
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
                    <div className={styles.label}>
                      Book Author or Publisher:
                    </div>
                    <div className={styles.value}>{bookAuthor}</div>
                  </div>
                  {!!bookEdition && (
                    <div className={styles.row}>
                      <div className={styles.label}>Book Edition: </div>
                      <div className={styles.value}>{bookEdition}</div>
                    </div>
                  )}
                  <div className={styles.row}>
                    <div className={styles.label}>Book Program: </div>
                    <div className={styles.value}>{program.label}</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>Course Level: </div>
                    <div className={styles.value}>{courseLevel}</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>Book Quality: </div>
                    <div className={styles.value}>
                      {!!bookQuality
                        ? bookQuality.charAt(0).toUpperCase() +
                          bookQuality.slice(1)
                        : "Not Given"}
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>Price: </div>
                    <div className={styles.value}>${bookPrice}</div>
                  </div>
                </div>
                <div className={styles.infoSection}>
                  <div className={styles.infoTitle}>Contact Information</div>
                  <div className={styles.row}>
                    <div className={styles.label}>School: </div>
                    <div className={styles.value}>{userSchool.label}</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>Contact Name: </div>
                    <div className={styles.value}>{userInfo.fullName}</div>
                  </div>
                  {/* <div className={styles.row}>
                    <div className={styles.label}>Contact Email: </div>
                    <div className={styles.value}>{userInfo.email}</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.label}>Contact Phone: </div>
                    <div className={styles.value}>{userInfo.phone}</div>
                  </div> */}
                  <div className={styles.row}>
                    <div className={styles.label}>Date Posted: </div>
                    <div className={styles.value}>
                      {moment.unix(datePosted).format("MMMM Do YYYY")}
                    </div>
                  </div>
                  <div className={styles.row}>
                    {!user ? (
                      <button
                        className={styles.contactButton}
                        onClick={isAuthenticated ? contactSeller : () => {}}
                      >
                        Register to contact seller!
                      </button>
                    ) : (
                      user.id !== userId && (
                        <button
                          className={styles.contactButton}
                          onClick={isAuthenticated ? contactSeller : () => {}}
                        >
                          Contact Seller!
                        </button>
                      )
                    )}
                  </div>
                  <div />
                </div>
              </div>
              <div className={styles.picture}>
                {bookURL === "" && hasPicture ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 10
                    }}
                  >
                    <ClipLoader
                      sizeUnit={"px"}
                      size={70}
                      color={"#0069d9"}
                      loading={true}
                    />
                  </div>
                ) : (
                  <img
                    className={styles.asset}
                    src={hasPicture ? bookURL : placeholder}
                    alt="Textbook Picture"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.authState.isAuthenticated,
  user: state.authState.user
});

export default connect(mapStateToProps)(withRouter(Post));
