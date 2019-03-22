import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./styles.scss";
import { getUserStatus } from "../../actions/authActions";
import firebase from "../../firebase";

const NavBar = props => {
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
