import React from "react";
import { Link } from "react-router-dom";

import styles from "./styles.scss";

const Footer = () => {
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
        <a className={styles.footerLink} href="mailto:nboulton@uoguelph.ca">
          Contact
        </a>
        <div style={{ color: "grey", margin: "auto 0" }}>&#8226;</div>
        <Link className={styles.footerLink} to="/auth">
          Sign Up!
        </Link>
      </div>
      <div className={styles.disclaimer}>
        © Textbook Trade {new Date().getFullYear()}. All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
