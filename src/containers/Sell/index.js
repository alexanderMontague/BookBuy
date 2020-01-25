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
import { courses } from "../../assets/courses";
import { FaUpload, FaQuestionCircle } from "react-icons/fa";
import isbnLocation from "../../assets/media/isbnLocation.png";
import { getBookInfo } from "../../helpers/requests";
import Compressor from "compressorjs";
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
    bookISBN: "",

    addingPost: false,
    addPostSuccessful: false,
    statusMessage: ""
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
      userId: this.props.user.id,
      userSchool: this.props.user.school,
      flagged: false
    });

    if (postId) {
      // compress and edit picture
      if (!!bookPic) {
        new Compressor(bookPic, {
          quality: 0.6,
          success(compressedImage) {
            firebase.storage.child(`postings/${postId}`).put(compressedImage);
          },
          error(err) {
            console.error("image compression error", err.message);
          }
        });
      }
      // add posting id to own object for reference
      firebase.updateDocument("postings", postId, { postId });
      // update spinners and show success message
      this.setState({ addingPost: false, addPostSuccessful: true });
    }
  };

  // using google books api for isbn lookup
  getBookInfo = async () => {
    const cleanISBN = this.state.bookISBN.replace(/-/g, "");
    const bookInfo = await getBookInfo(cleanISBN);
    let salePrice = "";

    if (bookInfo.totalItems === 0) {
      this.setState({
        statusMessage: "Book could not be found. Please manually input info!"
      });
      return;
    }

    if (bookInfo.items[0].saleInfo.saleability !== "NOT_FOR_SALE") {
      salePrice = bookInfo.items[0].saleInfo.listPrice.amount;
    }

    this.setState({
      bookTitle: bookInfo.items[0].volumeInfo.title,
      bookAuthor: bookInfo.items[0].volumeInfo.authors.join(", ")
    });
  };

  formFieldInputHandler = event => {
    if (event.target.id === "courseLevel" || event.target.id === "bookPrice") {
      if (!event.target.value.match(/^\d*\.?\d*$/)) {
        document.getElementById(event.target.id).value = this.state[
          event.target.id
        ];
      }
    }
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
                <div className={styles.statusMessage}>
                  {this.state.statusMessage}
                </div>
                {/* <div className={styles.row2}>
                  <div className={styles.isbnContainer}>
                    <FloatingLabel
                      type="text"
                      placeholder="Enter ISBN to save time!"
                      id="bookISBN"
                      onChange={this.formFieldInputHandler}
                      value={this.state.bookTitle}
                      styles={inputStyle(false)}
                    />
                    <div className={styles.isbnInfo}>
                      <FaQuestionCircle />
                    </div>
                    <div className={styles.isbnInfoPanel}>
                      Enter the ISBN on the barcode to auto-complete
                      information!
                      <br />
                      <img
                        src={isbnLocation}
                        style={{
                          height: "60%",
                          width: "70%",
                          marginTop: "10px"
                        }}
                      />
                    </div>
                  </div>
                  <button
                    className={styles.searchButton}
                    type="button"
                    onClick={this.getBookInfo}
                    disabled={!this.state.bookISBN}
                  >
                    Search
                  </button>
                </div> */}
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
                      options={courses[this.props.user.school.value]}
                      className={styles.schoolInput}
                      placeholder="Select a Program"
                    />
                  </InputWrapper>
                  <FloatingLabel
                    type="text"
                    placeholder="Course Level"
                    id="courseLevel"
                    onChange={this.formFieldInputHandler}
                    value={this.state.courseLevel}
                    styles={inputStyle(true)}
                  />
                </div>
                <div className={styles.row}>
                  <FloatingLabel
                    type="text"
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
                  <div
                    className={styles.checkboxRow}
                    style={{ paddingTop: "5px" }}
                  >
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
                      bookPic: "",
                      bookEdition: "",
                      bookQuality: ""
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
