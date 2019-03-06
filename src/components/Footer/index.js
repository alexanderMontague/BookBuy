import React from "react";
import styles from "./styles.scss";

const Footer = () => {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.linksContainer}>
        <div className={styles.footerLink}>Home</div>{" "}
        <div style={{ color: "grey", margin: "auto 0" }}>&#8226;</div>
        <div className={styles.footerLink}>Postings</div>
        <div style={{ color: "grey", margin: "auto 0" }}>&#8226;</div>
        <div className={styles.footerLink}>Contact</div>
        <div style={{ color: "grey", margin: "auto 0" }}>&#8226;</div>
        <div className={styles.footerLink}>Sign Up!</div>
      </div>
      <div className={styles.disclaimer}>
        © Textbook Trade {new Date().getFullYear()}. All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
