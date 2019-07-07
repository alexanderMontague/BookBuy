import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./styles.scss";
import firebase from "../../firebase";
import { getUserStatus } from "../../actions/authActions";
import PostItem from "../../components/PostItem";
import Chat from "../../components/Chat";

class Profile extends Component {
  state = {
    name: this.props.user.fullName,
    email: this.props.user.email,
    passNew1: "",
    passNew2: "",
    userPostings: []
  };

  async componentDidMount() {
    const { user } = this.props;

    // fetch user's posts
    const userPostings = await firebase.getDocsFromCollection("postings", [
      ["userId", "==", user.id]
    ]);
    userPostings.sort((postA, postB) => {
      if (postA.datePosted < postB.datePosted) return 1;
      else if (postA.datePosted > postB.datePosted) return -1;
      return 0;
    });
    this.setState({ userPostings });
  }

  inputChangeHandler = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  deletePost = async postId => {
    // delete post
    await firebase.deleteDocument("postings", postId);

    // get updated posts
    const userPostings = await firebase.getDocsFromCollection("postings", [
      ["userId", "==", this.props.user.id]
    ]);

    // sort posts
    userPostings.sort((postA, postB) => {
      if (postA.datePosted < postB.datePosted) return 1;
      else if (postA.datePosted > postB.datePosted) return -1;
      return 0;
    });

    this.setState({ userPostings });

    // delete post picture from storage if there is one
    firebase.storage
      .child(`postings/${postId}`)
      .delete()
      .then(() => {
        // successful delete
      })
      .catch(err => {
        // if there is no picture it will error out but ¯\_(ツ)_/¯
      });

    // delete all user chats referencing that post
    const referencedChats = await firebase.getDocsFromCollection("messages", [
      ["post", "==", postId]
    ]);
    referencedChats.forEach(async post => {
      await firebase.deleteDocument("messages", post.id);
    });
  };

  renderUserPosts = () => {
    const { userPostings } = this.state;

    return userPostings.map(post => {
      return (
        <PostItem
          key={`${post.bookTitle}${post.datePosted}`}
          {...post}
          deletePost={this.deletePost}
        />
      );
    });
  };

  updateUserInformation = async () => {
    const { name, email, passNew1, passNew2 } = this.state;

    await firebase.updateDocument("users", this.props.user.id, {
      fullName: name,
      email
    });

    this.props.getUserStatus();

    if (email !== this.props.user.email) {
      await firebase.userObject().updateEmail(email);
    }

    if (
      !!passNew1 &&
      !!passNew2 &&
      passNew1 === passNew2 &&
      passNew1.length >= 6 &&
      passNew2.length >= 6
    ) {
      try {
        await firebase.userObject().updatePassword(passNew1);
        this.setState({ passNew1: "", passNew2: "" });
      } catch (error) {
        alert(error.message); // TODO: proper error handling
      }
    }
  };

  render() {
    const { isAuthenticated, user } = this.props;

    return (
      <div className={styles.profileContainer}>
        <Chat />
        <div className={styles.topContent}>
          <div className={styles.infoContainer}>
            <div className={styles.header}>Update Profile Info</div>
            <div className={styles.detailsContainer}>
              <label className={styles.inputLabel}>
                Name:
                <input
                  className={styles.input}
                  type="text"
                  value={this.state.name}
                  id="name"
                  onChange={this.inputChangeHandler}
                />
              </label>
              <label className={styles.inputLabel}>
                Email:
                <input
                  className={styles.input}
                  type="email"
                  value={this.state.email}
                  id="email"
                  onChange={this.inputChangeHandler}
                />
              </label>
              <label className={styles.inputLabel}>
                New Password:
                <input
                  className={styles.input}
                  type="password"
                  value={this.state.passNew1}
                  onChange={this.inputChangeHandler}
                  id="passNew1"
                  placeholder="At least 6 letters long"
                />
              </label>
              <label className={styles.inputLabel}>
                Retype New Password:
                <input
                  className={styles.input}
                  type="password"
                  value={this.state.passNew2}
                  onChange={this.inputChangeHandler}
                  id="passNew2"
                />
              </label>
              <button
                className={styles.saveButton}
                disabled={
                  user &&
                  this.state.name === user.fullName &&
                  this.state.email === user.email &&
                  ((!this.state.passNew1 && !this.state.passNew2) ||
                    ((this.state.passNew1 !== this.state.passNew2 &&
                      this.state.passNew1.length < 6) ||
                      this.state.passNew2.length < 6))
                }
                onClick={this.updateUserInformation}
              >
                Save Changes
              </button>
            </div>
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.header}>Manage Posts</div>
            <div className={styles.detailsContainer}>
              <div className={styles.postHeader}>
                <div className={styles.postCol}>Date Posted</div>
                <div className={styles.progCol}>Program</div>
                <div className={styles.titleCol}>Book Title</div>
                <div className={styles.fillerItem} />
              </div>
              <div className={styles.postsContainer}>
                {this.renderUserPosts()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authState.user,
  isAuthenticated: state.authState.isAuthenticated
});

export default connect(
  mapStateToProps,
  { getUserStatus }
)(Profile);
