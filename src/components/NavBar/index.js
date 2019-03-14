import React from "react";
import { Link } from "react-router-dom";

import styles from "./styles.scss";

import firebase from "../../firebase";

const NavBar = () => {
  // const logOutUser = () => {
  //   firebase.logout();
  // };

  // const isAuthenticated = firebase.isAuthenticated().then(val => val);

  return (
    <nav>
      <div className={styles.navContainer}>
        <div className={styles.logoLink}>Textbook Trade</div>
        <div className={styles.navLinks}>
          <Link className={styles.navItem} to="/">
            Home
          </Link>
          <Link className={styles.navItem} to="/postings">
            Postings
          </Link>
          <Link className={styles.navItem} to="/sell">
            Sell Books
          </Link>
          {false ? (
            <div className={styles.navItem} onClick={logOutUser}>
              Log Out
            </div>
          ) : (
            <Link className={styles.navItem} to="/auth">
              Register & Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
