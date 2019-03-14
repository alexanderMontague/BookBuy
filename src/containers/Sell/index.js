import React, { Component } from "react";
import styles from "./styles.scss";

import FloatingLabel, {
  floatingStyles,
  focusStyles,
  inputStyles,
  labelStyles
} from "floating-label-react";

const inputStyle = {
  floating: {
    ...floatingStyles,
    color: "#333333"
  },
  focus: {
    ...focusStyles,
    borderColor: "#333333"
  },
  input: {
    ...inputStyles,
    borderBottomWidth: 1,
    width: "100%",
    color: "#333333",
    background: "inherit",
    fontFamily: "Overpass",
    paddingLeft: "10px"
  },
  label: {
    ...labelStyles,
    marginTop: ".5em",
    width: "100%",
    color: "grey",
    fontFamily: "Overpass"
  }
};

class Sell extends Component {
  state = {};

  uploadBook = event => {
    event.preventDefault();
  };

  render() {
    return (
      <div className={styles.sellContainer}>
        <div className={styles.title}>Sell your old textbooks Now!</div>
        <div className={styles.sellForm}>
          <form className={styles.form} onSubmit={this.uploadBook}>
            <FloatingLabel
              type="email"
              placeholder="Email Address"
              id="loginEmail"
              onChange={this.formFieldInputHandler}
              value={this.state.loginEmail}
              styles={inputStyle}
            />
            <FloatingLabel
              type="password"
              placeholder="Password"
              id="loginPassword"
              onChange={this.formFieldInputHandler}
              value={this.state.loginPassword}
              styles={inputStyle}
            />
            <button className={styles.submitButton} type="submit">
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Sell;
