import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./styles.scss";
import { getUserStatus } from "../../actions/authActions";
import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";
import { FaBars } from "react-icons/fa";
import firebase from "../../firebase";

const NavBar = props => {
  const isMobile = window.innerWidth <= 810 ? true : false;

  const [mobileNav, toggleMobileNav] = useState(false);

  const logOutUser = () => {
    firebase.logout();
    props.getUserStatus();
    setTimeout(() => alert("Logout Successful"), 100);
  };

  const { isAuthenticated } = props;

  return (
    <nav>
      <div className={styles.navContainer}>
        <div className={styles.logoLink}>BookBuy.ca</div>
        {isMobile ? (
          <div className={styles.mobileNav}>
            <div
              className={styles.hamburgerMenu}
              onClick={() => toggleMobileNav(!mobileNav)}
            >
              <FaBars />
            </div>
            <div
              className={[
                styles.mobileSlideContainer,
                mobileNav ? styles.showMenu : null
              ].join(" ")}
            >
              <Link className={styles.mobileLink} to="/">
                Home
              </Link>
              <Link className={styles.mobileLink} to="/postings">
                Postings
              </Link>
              <Link className={styles.mobileLink} to="/sell">
                Sell Books
              </Link>
              {isAuthenticated ? (
                <Fragment>
                  <Link className={styles.mobileLink} to="/profile">
                    Profile
                  </Link>
                  <div className={styles.mobileLink} onClick={logOutUser}>
                    Logout
                  </div>
                </Fragment>
              ) : (
                <Link className={styles.mobileLink} to="/auth">
                  Register & Log In
                </Link>
              )}
            </div>
          </div>
        ) : (
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
            {isAuthenticated ? (
              <div className={styles.specialNavItem}>
                <div
                  className={styles.hover}
                  onClick={() =>
                    props.history.push({
                      pathname: "/profile"
                    })
                  }
                >
                  Profile
                </div>
                <div className={styles.hover} onClick={logOutUser}>
                  Logout
                </div>
              </div>
            ) : (
              <Link className={styles.navItem} to="/auth">
                Register & Log In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.authState.isAuthenticated
});

export default connect(
  mapStateToProps,
  { getUserStatus }
)(NavBar);
