import React, { Component } from "react";
import styles from "./styles.scss";

import FloatingLabel, {
  floatingStyles,
  focusStyles,
  inputStyles,
  labelStyles
} from "floating-label-react";
import InputWrapper from "../../components/InputWrapper";
import Select from "react-select";
import { programDropdownValues } from "../../assets/dropdownValues";

const inputStyle = isDouble => ({
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
    color: "#333333",
    background: "inherit",
    fontFamily: "Overpass",
    paddingLeft: "10px",
    width: "100%"
  },
  label: {
    ...labelStyles,
    marginTop: ".5em",
    width: isDouble ? "48%" : "100%",
    color: "grey",
    fontFamily: "Overpass",
    zIndex: 0
  }
});

class Sell extends Component {
  state = {};

  uploadBook = event => {
    event.preventDefault();
  };

  formFieldInputHandler = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  render() {
    return (
      <div className={styles.sellContainer}>
        <div className={styles.title}>Sell your old textbooks Now!</div>
        <div className={styles.sellForm}>
          <form className={styles.form} onSubmit={this.uploadBook}>
            <FloatingLabel
              type="text"
              placeholder="Title"
              id="bookTitle"
              onChange={this.formFieldInputHandler}
              value={this.state.bookTitle}
              styles={inputStyle(false)}
            />
            <FloatingLabel
              type="text"
              placeholder="Author"
              id="bookAuthor"
              onChange={this.formFieldInputHandler}
              value={this.state.bookAuthor}
              styles={inputStyle(false)}
            />
            <div className={styles.row}>
              <InputWrapper color="#333333" label="Program">
                <Select
                  value={this.state.selectedProgram}
                  onChange={this.programSelector}
                  options={programDropdownValues}
                  className={styles.schoolInput}
                  placeholder="Select a Program"
                />
              </InputWrapper>
              <FloatingLabel
                type="number"
                placeholder="Course Level"
                id="bookLevel"
                onChange={this.formFieldInputHandler}
                value={this.state.bookLevel}
                styles={inputStyle(true)}
              />
            </div>
            <FloatingLabel
              type="text"
              placeholder="Price $"
              id="bookPrice"
              onChange={this.formFieldInputHandler}
              value={this.state.bookPrice}
              styles={inputStyle(true)}
            />
            <button className={styles.submitButton} type="submit">
              Post Book!
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Sell;
