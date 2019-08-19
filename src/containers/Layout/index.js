import React, { Component } from "react";
import { connect } from "react-redux";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import styles from "./styles.scss";
import { redirectToProfile } from "../../actions/uiActions";
import { getUserStatus } from "../../actions/authActions";
import {
  updateUserSentChats,
  updateUserReceivedChats
} from "../../actions/userActions";
import { ClipLoader } from "react-spinners";
import firebase from "../../firebase";

class Layout extends Component {
  componentDidMount() {
    if (window.location.search === "?gotoProfile=true") {
      this.props.redirectToProfile(true);
    }

    this.props.getUserStatus({ history: this.props.history });
  }

  componentDidUpdate(prevProps) {
    const { user, updateUserSentChats, updateUserReceivedChats } = this.props;

    // once we fetch the users info, create stream to get chats
    if (prevProps.user === null && user) {
      firebase.db
        .collection("messages")
        .where("sender", "==", user.id)
        .onSnapshot(
          snapshot => updateUserSentChats(snapshot.docs.map(doc => doc.data())),
          err => console.error("chat sender error", err)
        );

      // block so received chats are looked at second
      setTimeout(() => {}, 0);

      firebase.db
        .collection("messages")
        .where("recipient", "==", user.id)
        .onSnapshot(
          snapshot =>
            updateUserReceivedChats(snapshot.docs.map(doc => doc.data())),
          err => console.error("chat recipient error", err)
        );
    }
  }

  render() {
    const { authLoading, isProtected, isAuthenticated } = this.props;
    if (isProtected && isAuthenticated === false) {
      this.props.history.push({
        pathname: "/"
      });
    }

    return (
      <div className={authLoading ? styles.loadingOverlay : ""}>
        <NavBar {...this.props} />
        <div className={styles.contentContainer}>
          {authLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <ClipLoader
                sizeUnit={"px"}
                size={150}
                color={"#0069d9"}
                loading={true}
              />
            </div>
          ) : (
            this.props.children
          )}
        </div>
        <Footer {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authLoading: state.authState.authLoading,
  isAuthenticated: state.authState.isAuthenticated,
  user: state.authState.user
});

export default connect(
  mapStateToProps,
  {
    getUserStatus,
    updateUserSentChats,
    updateUserReceivedChats,
    redirectToProfile
  }
)(Layout);
