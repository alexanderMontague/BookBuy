import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./styles.scss";
import firebase from "../../firebase";
import { FaTimesCircle } from "react-icons/fa";

const PostItem = props => {
  return (
    <div className={styles.postItemContainer}>
      <div className={styles.postItemDate}>21/04/2019</div>
      <div className={styles.postItemProgram}>CIS</div>
      <div className={styles.postItemTitle}>Fundamentals of Computing</div>
      <FaTimesCircle className={styles.postItemDelete} color="red" />
    </div>
  );
};

class Profile extends Component {
  state = {
    name: this.props.user.fullName,
    phone: this.props.user.phone,
    email: this.props.user.email,
    passOld: "",
    passNew: ""
  };

  async componentDidMount() {
    const { user } = this.props;

    let filteredPostings = await firebase.getDocsFromCollection("postings", [
      ["userInfo.id", "==", user.id]
    ]);

    console.log(filteredPostings);
  }

  inputChangeHandler = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    const { isAuthenticated } = this.props;
    return (
      <div className={styles.profileContainer}>
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
              Phone:
              <input
                className={styles.input}
                type="tel"
                value={this.state.phone}
                id="phone"
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
              Old Password:
              <input
                className={styles.input}
                type="password"
                value={this.state.passOld}
                onChange={this.inputChangeHandler}
                id="passOld"
              />
            </label>
            <label className={styles.inputLabel}>
              New Password:
              <input
                className={styles.input}
                type="password"
                value={this.state.passNew}
                onChange={this.inputChangeHandler}
                id="passNew"
              />
            </label>
            <div className={styles.saveButton}>Save Changes</div>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.header}>Manage Posts</div>
          <div className={styles.detailsContainer}>
            <div className={styles.postHeader}>
              <div className={styles.postCol}>Date Posted</div>
              <div className={styles.progCol}>Program</div>
              <div className={styles.titleCol}>Title</div>
              <div className={styles.fillerItem} />
            </div>
            <div className={styles.postsContainer}>
              <PostItem />
              <PostItem />
              <PostItem />
              <PostItem />
              <PostItem />
              <PostItem />
              <PostItem />
              <PostItem />
              <PostItem />
              <PostItem />
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

export default connect(mapStateToProps)(Profile);
