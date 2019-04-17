import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./styles.scss";
import { getUserStatus } from "../../actions/authActions";
import { FaBars, FaComments } from "react-icons/fa";
import logo from "../../assets/BookBuy.png";
import Modal from "react-modal";
import firebase from "../../firebase";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "300px"
  }
};

const NavBar = props => {
  const isMobile = window.innerWidth <= 810 ? true : false;

  const [isMobileNav, toggleMobileNav] = useState(false);
  const [isLogoutModalOpen, toggleLogoutModal] = useState(false);

  const logOutUser = () => {
    firebase.logout();
    props.getUserStatus();
    setTimeout(toggleLogoutModal(true), 100);
  };

  const { isAuthenticated, isNewMessage } = props;

  return (
    <nav>
      <Modal
        isOpen={isLogoutModalOpen}
        onRequestClose={() => toggleLogoutModal(false)}
        style={modalStyles}
        contentLabel="Logout Successful"
      >
        <div className={styles.logoutModalText}>Logout Successful!</div>
        <div
          className={styles.backButton}
          onClick={() => toggleLogoutModal(false)}
        >
          Back
        </div>
      </Modal>
      <div className={styles.navContainer}>
        <div className={styles.logoLink}>
          <img className={styles.img} src={logo} />
        </div>
        {isMobile ? (
          <div className={styles.mobileNav}>
            <div
              className={styles.hamburgerMenu}
              onClick={() => toggleMobileNav(!isMobileNav)}
            >
              <div
                className={[
                  styles.hamburgerIcon,
                  isMobileNav ? styles.rotate : null
                ].join(" ")}
              >
                <FaBars />
              </div>
            </div>
            <div
              className={[
                styles.mobileSlideContainer,
                isMobileNav ? styles.showMenu : null
              ].join(" ")}
            >
              <Link
                className={styles.mobileLink}
                to="/"
                onClick={() => toggleMobileNav(!isMobileNav)}
              >
                Home
              </Link>
              <Link
                className={styles.mobileLink}
                to="/postings"
                onClick={() => toggleMobileNav(!isMobileNav)}
              >
                Postings
              </Link>
              <Link
                className={styles.mobileLink}
                to="/sell"
                onClick={() => toggleMobileNav(!isMobileNav)}
              >
                Sell Books
              </Link>
              {isAuthenticated ? (
                <Fragment>
                  <Link
                    className={styles.mobileLink}
                    to="/profile"
                    onClick={() => toggleMobileNav(!isMobileNav)}
                  >
                    Profile
                  </Link>
                  <div
                    className={styles.mobileLink}
                    onClick={() => {
                      logOutUser();
                      toggleMobileNav(!isMobileNav);
                    }}
                  >
                    Logout
                  </div>
                </Fragment>
              ) : (
                <Link
                  className={styles.mobileLink}
                  to="/auth"
                  onClick={() => toggleMobileNav(!isMobileNav)}
                >
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
                  {isNewMessage && (
                    <div style={{ paddingLeft: 10 }}>
                      <FaComments color="#ff0000" height={15} width={15} />
                    </div>
                  )}
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
  isAuthenticated: state.authState.isAuthenticated,
  isNewMessage: state.userState.isNewMessage
});

export default connect(
  mapStateToProps,
  { getUserStatus }
)(NavBar);
