import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { FaInstagram, FaFacebookSquare, FaLinkedin } from "react-icons/fa";

import styles from "./styles.scss";

const Footer = props => {
  const openLink = url => {
    window.open(url);
  };

  return (
    <div className={styles.footerContainer}>
      <div className={styles.linksContainer}>
        <Link className={styles.footerLink} to="/">
          Home
        </Link>
        <div style={{ color: "grey", margin: "auto 0" }}>&#8226;</div>
        <Link className={styles.footerLink} to="/postings">
          Postings
        </Link>
        <div style={{ color: "grey", margin: "auto 0" }}>&#8226;</div>
        <a className={styles.footerLink} href="mailto:info@bookbuy.ca">
          Contact
        </a>
        <div style={{ color: "grey", margin: "auto 0" }}>&#8226;</div>
        <Link className={styles.footerLink} to="/terms">
          Terms
        </Link>
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
      <div className={styles.socialLinks}>
        <div
          className={styles.socialLink}
          onClick={() => openLink("https://www.instagram.com/bookbuy.ca/")}
        >
          <FaInstagram />
        </div>
        <div
          className={styles.socialLink}
          onClick={() => openLink("https://www.facebook.com/www.bookbuy.ca/")}
        >
          <FaFacebookSquare />
        </div>
        <div
          className={styles.socialLink}
          onClick={() => openLink("https://www.linkedin.com/company/book-buy/")}
        >
          <FaLinkedin />
        </div>
      </div>
      <div className={styles.disclaimer}>
        © BookBuy {new Date().getFullYear()}. All Rights Reserved.
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.authState.isAuthenticated
});

export default connect(mapStateToProps)(Footer);
