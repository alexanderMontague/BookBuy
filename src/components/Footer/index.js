import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import styles from "./styles.scss";

const Footer = props => {
  // const darkFooter = window.location.hash === "#/postings";

  return (
    <div
      className={styles.footerContainer}
      style={{ background: false ? "#333333" : null }}
    >
      <div className={styles.linksContainer}>
        <Link className={styles.footerLink} to="/">
          Home
        </Link>
        <div style={{ color: "grey", margin: "auto 0" }}>&#8226;</div>
        <Link className={styles.footerLink} to="/postings">
          Postings
        </Link>
        <div style={{ color: "grey", margin: "auto 0" }}>&#8226;</div>
        <a className={styles.footerLink} href="mailto:nboulton@uoguelph.ca">
          Contact
        </a>
        <div style={{ color: "grey", margin: "auto 0" }}>&#8226;</div>
        {props.isAuthenticated ? (
          <Link className={styles.footerLink} to="/profile">
            Profile
          </Link>
        ) : (
          <Link className={styles.footerLink} to="/auth">
            Sign Up!
          </Link>
        )}
      </div>
      <div className={styles.disclaimer}>
        © Textbook Trade {new Date().getFullYear()}. All Rights Reserved.
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.authState.isAuthenticated
});

export default connect(mapStateToProps)(Footer);
