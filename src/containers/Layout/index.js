import React, { Component } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

import firebase from "../../firebase";

import styles from "./styles.scss";

class Layout extends Component {
  async componentDidMount() {
    console.log("user", firebase.auth.currentUser);
    console.log(await firebase.isInitialized());
  }

  render() {
    return (
      <div className={styles.layout}>
        <NavBar />
        <div className={styles.contentContainer}>{this.props.children}</div>
        <Footer />
      </div>
    );
  }
}

export default Layout;
