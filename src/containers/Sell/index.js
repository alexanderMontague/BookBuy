import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import styles from "./styles.scss";
import moment from "moment";
import FloatingLabel, {
  floatingStyles,
  focusStyles,
  inputStyles,
  labelStyles
} from "floating-label-react";
import InputWrapper from "../../components/InputWrapper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import { programDropdownValues } from "../../assets/dropdownValues";
import { FaUpload } from "react-icons/fa";
import firebase from "../../firebase";

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
    bookEdition: "",
    selectedProgram: "",
    courseLevel: "",
    bookPrice: "",
    bookPic: "",
    bookQuality: "",

    addingPost: false,
    addPostSuccessful: false
  };

  uploadBook = async event => {
    event.preventDefault();
    this.setState({ addingPost: true });
    const {
      bookTitle,
      bookAuthor,
      selectedProgram,
      courseLevel,
      bookPrice,
      bookPic,
      bookEdition,
      bookQuality
    } = this.state;

    const postId = await firebase.addPosting({
      bookTitle,
      bookAuthor,
      program: selectedProgram,
      courseLevel,
      bookPrice,
      bookQuality,
      bookEdition,
      hasPicture: !!bookPic,
      datePosted: moment().unix(),
      userInfo: {
        ...this.props.user
      }
    });

    if (postId) {
      // add picture if there is one
      !!bookPic && firebase.storage.child(`postings/${postId}`).put(bookPic);
      // add posting id to own object for reference
      firebase.updateDocument("postings", postId, { postId });
      // update spinners and show success message
      this.setState({ addingPost: false, addPostSuccessful: true });
    }
  };

  formFieldInputHandler = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  programSelector = option => {
    this.setState({ selectedProgram: option });
  };

  checkboxHandler = quality => {
    this.setState({ bookQuality: quality });
  };

  render() {
    const { isAuthenticated } = this.props;
    const { addingPost, addPostSuccessful } = this.state;

    return (
      <div className={styles.sellContainer}>
        <div className={styles.title}>
          {isAuthenticated ? "Sell Your Old Textbooks Now!" : ""}
        </div>
        <div className={styles.sellForm}>
          {isAuthenticated ? (
            !addPostSuccessful ? (
              <form className={styles.form} onSubmit={this.uploadBook}>
                <FloatingLabel
                  type="text"
                  placeholder="Title of Textbook"
                  id="bookTitle"
                  onChange={this.formFieldInputHandler}
                  value={this.state.bookTitle}
                  styles={inputStyle(false)}
                />
                <FloatingLabel
                  type="text"
                  placeholder="Author(s) or Publisher(s)"
                  id="bookAuthor"
                  onChange={this.formFieldInputHandler}
                  value={this.state.bookAuthor}
                  styles={inputStyle(false)}
                />
                <FloatingLabel
                  type="text"
                  placeholder="Edition (optional)"
                  id="bookEdition"
                  onChange={this.formFieldInputHandler}
                  value={this.state.bookEdition}
                  styles={inputStyle(false)}
                />
                <div className={styles.row}>
                  <InputWrapper
                    color="#333333"
                    label="Program"
                    inputStyle={{
                      width: window.innerWidth <= 550 ? "100%" : "auto"
                    }}
                  >
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
                    onChange={e =>
                      this.setState({ bookPic: e.target.files[0] })
                    }
                    className={styles.fileUpload}
                    accept="image/png, image/jpeg"
                  />
                  <label htmlFor="bookPic" className={styles.fileLabel}>
                    <FaUpload />
                    {this.state.bookPic
                      ? this.state.bookPic.name
                      : "Optional Picture of Book"}
                  </label>
                </div>
                <InputWrapper
                  color="#333333"
                  label="Condition"
                  inputStyle={{ paddingTop: "20px" }}
                >
                  <div className={styles.row} style={{ paddingTop: "5px" }}>
                    <label
                      className={styles.checkboxLabel}
                      onClick={() => this.checkboxHandler("excellent")}
                    >
                      <span>Excellent</span>
                      <input type="checkbox" style={{ display: "none" }} />
                      <div className={styles.checkbox}>
                        <div
                          className={
                            this.state.bookQuality === "excellent"
                              ? styles.checkActive
                              : null
                          }
                        />
                      </div>
                    </label>
                    <label
                      className={styles.checkboxLabel}
                      onClick={() => this.checkboxHandler("good")}
                    >
                      <span>Good</span>
                      <input type="checkbox" style={{ display: "none" }} />
                      <div className={styles.checkbox}>
                        <div
                          className={
                            this.state.bookQuality === "good"
                              ? styles.checkActive
                              : null
                          }
                        />
                      </div>
                    </label>
                    <label
                      className={styles.checkboxLabel}
                      onClick={() => this.checkboxHandler("worn")}
                    >
                      <span>Worn</span>
                      <input type="checkbox" style={{ display: "none" }} />
                      <div className={styles.checkbox}>
                        <div
                          className={
                            this.state.bookQuality === "worn"
                              ? styles.checkActive
                              : null
                          }
                        />
                      </div>
                    </label>
                  </div>
                </InputWrapper>
                {addingPost ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 10
                    }}
                  >
                    <ClipLoader
                      sizeUnit={"px"}
                      size={50}
                      color={"#0069d9"}
                      loading={addingPost}
                    />
                  </div>
                ) : (
                  <button
                    className={styles.submitButton}
                    type="submit"
                    disabled={
                      !this.state.bookTitle ||
                      !this.state.bookAuthor ||
                      !this.state.selectedProgram ||
                      !this.state.bookTitle ||
                      !this.state.courseLevel ||
                      !this.state.bookPrice
                    }
                  >
                    Post Book!
                  </button>
                )}
              </form>
            ) : (
              <Fragment>
                <p style={{ fontSize: "25px", color: "#0069d9" }}>
                  Your posting was added successfully!
                </p>
                <button
                  className={styles.submitButton}
                  onClick={() =>
                    this.setState({
                      addPostSuccessful: false,
                      bookTitle: "",
                      bookAuthor: "",
                      selectedProgram: "",
                      courseLevel: "",
                      bookPrice: "",
                      bookPic: ""
                    })
                  }
                >
                  Add Another Posting!
                </button>
              </Fragment>
            )
          ) : (
            <Fragment>
              <p style={{ fontSize: "25px", color: "#0069d9" }}>
                You must register to create a book posting!
              </p>
              <button
                className={styles.submitButton}
                onClick={() =>
                  this.props.history.push({
                    pathname: "/auth"
                  })
                }
              >
                Register Now!
              </button>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.authState.isAuthenticated,
  user: state.authState.user
});

export default connect(mapStateToProps)(Sell);
