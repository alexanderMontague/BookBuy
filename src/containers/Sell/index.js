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
import { FaUpload } from "react-icons/fa";

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
    width: isDouble ? (window.innerWidth <= 550 ? "100%" : "48%") : "100%",
    color: "grey",
    fontFamily: "Overpass",
    zIndex: 0
  }
});

class Sell extends Component {
  state = {
    bookTitle: "",
    bookAuthor: "",
    selectedProgram: "",
    courseLevel: "",
    bookPrice: "",
    bookPic: ""
  };

  uploadBook = event => {
    event.preventDefault();
    console.log(this.state);
  };

  formFieldInputHandler = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  programSelector = option => {
    this.setState({ selectedProgram: option });
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
                id="courseLevel"
                onChange={this.formFieldInputHandler}
                value={this.state.courseLevel}
                styles={inputStyle(true)}
              />
            </div>
            <div className={styles.row}>
              <FloatingLabel
                type="number"
                placeholder="Price $"
                id="bookPrice"
                onChange={this.formFieldInputHandler}
                value={this.state.bookPrice}
                styles={inputStyle(true)}
              />
              <input
                type="file"
                id="bookPic"
                onChange={this.formFieldInputHandler}
                className={styles.fileUpload}
                accept="image/png, image/jpeg"
              />
              <label htmlFor="bookPic" className={styles.fileLabel}>
                <FaUpload />
                Optional Picture of Book
              </label>
            </div>
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
