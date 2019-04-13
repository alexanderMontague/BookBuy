import React, { Component } from "react";
import { connect } from "react-redux";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import styles from "./styles.scss";
import { getUserStatus } from "../../actions/authActions";
import { ClipLoader } from "react-spinners";

class Layout extends Component {
  componentDidMount() {
    this.props.getUserStatus();
  }

  render() {
    const { authLoading, isProtected, isAuthenticated } = this.props;
    if (isProtected && isAuthenticated === false) {
      this.props.history.push({
        pathname: "/"
      });
    }

    return (
      <div className={authLoading ? styles.loadingOverlay : ""}>
        <NavBar {...this.props} />
        <div className={styles.contentContainer}>
          {authLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <ClipLoader
                sizeUnit={"px"}
                size={150}
                color={"#0069d9"}
                loading={true}
              />
            </div>
          ) : (
            this.props.children
          )}
        </div>
        <Footer {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authLoading: state.authState.authLoading,
  isAuthenticated: state.authState.isAuthenticated
});

export default connect(
  mapStateToProps,
  { getUserStatus }
)(Layout);
