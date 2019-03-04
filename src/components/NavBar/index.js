import React from "react";

import styles from "./styles.scss";

const NavBar = () => {
  return (
    <nav>
      <div className={styles.navContainer}>
        <div className={styles.logoLink}>Textbook Trade</div>
        <div className={styles.navLinks}>
          <div className={styles.navItem}>Home</div>
          <div className={styles.navItem}>Postings</div>
          <div className={styles.navItem}>Sign Up!</div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
