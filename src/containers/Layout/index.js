import React, { Component } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

import styles from "./styles.scss";

class Layout extends Component {
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
