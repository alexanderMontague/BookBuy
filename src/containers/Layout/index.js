import React, { Component } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

import firebase from "../../firebase";

import styles from "./styles.scss";
import { ClipLoader } from "react-spinners";

class Layout extends Component {
  async componentDidMount() {
    console.log("initialized", await firebase.isAuthenticated());
    // console.log("username", await firebase.getCurrentUsername());
  }

  render() {
    return (
      <div className={styles.layout}>
        <NavBar />
        {/* <ClipLoader
          sizeUnit={"px"}
          size={150}
          color={"#0069d9"}
          loading={true}
        /> */}
        <div className={styles.contentContainer}>{this.props.children}</div>
        <Footer />
      </div>
    );
  }
}

export default Layout;
