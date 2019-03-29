import React, { Component } from "react";
import styles from "./styles.scss";

import InputWrapper from "../../components/InputWrapper";
import Select from "react-select";
import Post from "../../components/Post";
import ReactPaginate from "react-paginate";
import firebase from "../../firebase";
import {
  schoolDropdownValues,
  programDropdownValues
} from "../../assets/dropdownValues";
import { ClipLoader } from "react-spinners";

let hasScrolled = false;
let startingHeaderOffset = 0;
window.onscroll = () => {
  const header = document.getElementById("postHeader");
  if (header) {
    if (!hasScrolled) {
      startingHeaderOffset = header.offsetTop;
      hasScrolled = true;
    }
    const currHeaderOffset = header.offsetTop;
    if (
      window.pageYOffset > currHeaderOffset &&
      window.pageYOffset > startingHeaderOffset
    ) {
      header.classList.add(styles.sticky);
    } else {
      header.classList.remove(styles.sticky);
    }
  }
};

class Postings extends Component {
  state = {
    selectedSchool: { label: "University of Guelph", value: "UofG" },
    selectedProgram: null,
    courseLevel: "",
    mainBookInput: "",
    postsLoading: true,

    filteredPostings: [],
    allPostings: []
  };

  async componentDidMount() {
    if (!!window.location.search) {
      const rawParams = new URLSearchParams(window.location.search).get(
        "params"
      );
      const searchParams = JSON.parse(atob(rawParams));
      this.setState({ ...searchParams }, () => this.searchForTextbook());
    }

    const allPostings = await firebase.getAllPostings();

    this.setState({
      filteredPostings: allPostings,
      allPostings,
      postsLoading: false
    });
  }

  schoolSelector = option => {
    this.setState({ selectedSchool: option });
  };

  programSelector = option => {
    this.setState({ selectedProgram: option });
  };

  searchForTextbook = async event => {
    event && event.preventDefault();
    this.setState({ filteredPostings: [], postsLoading: true });

    const {
      selectedSchool,
      selectedProgram,
      courseLevel,
      mainBookInput
    } = this.state;

    // get docs from firebase that match input
    let filteredPostings = await firebase.getDocsFromCollection("postings", [
      ["userInfo.school.label", "==", selectedSchool.label],
      ["program.label", "==", selectedProgram.label],
      ["courseLevel", "==", courseLevel]
    ]);

    // if there is title/author input, query that too
    if (!!mainBookInput) {
      filteredPostings = filteredPostings.filter(post => {
        return (
          post.bookTitle.toLowerCase().includes(mainBookInput.toLowerCase()) ||
          post.bookAuthor.toLowerCase().includes(mainBookInput.toLowerCase())
        );
      });
    }

    this.setState({ filteredPostings, postsLoading: false });
  };

  renderPostings = () => {
    const { filteredPostings } = this.state;

    return filteredPostings.map((posting, index) => {
      const isGrey = index % 2 !== 0;

      return (
        <Post
          key={`${JSON.stringify(posting.userInto)}${posting.bookAuthor}${
            posting.bookTitle
          }`}
          {...posting}
          isGrey={isGrey}
        />
      );
    });
  };

  resetForm = () => {
    this.setState({
      selectedProgram: null,
      courseLevel: "",
      mainBookInput: "",
      filteredPostings: this.state.allPostings
    });
    this.props.history.push({
      search: ""
    });
    this.setState({ test: true });
  };

  render() {
    return (
      <div className={styles.postingsContainer}>
        {/* SEARCH PANEL */}
        <div className={styles.searchPanel}>
          <div className={styles.searchHeader}>Find the Textbooks You Need</div>
          <div className={styles.searchForm}>
            <form onSubmit={this.searchForTextbook}>
              <div className={styles.inputRow}>
                <InputWrapper label="School" required>
                  <Select
                    value={this.state.selectedSchool}
                    onChange={this.schoolSelector}
                    options={schoolDropdownValues}
                    className={styles.schoolInput}
                  />
                </InputWrapper>
                <InputWrapper label="Program" required>
                  <Select
                    value={this.state.selectedProgram}
                    onChange={this.programSelector}
                    options={programDropdownValues}
                    className={styles.schoolInput}
                    placeholder="Select a Program"
                  />
                </InputWrapper>
                <InputWrapper label="Course Level">
                  <input
                    type="number"
                    className={styles.searchInput}
                    placeholder="Ex. 1500"
                    value={this.state.courseLevel}
                    onChange={e =>
                      this.setState({ courseLevel: e.target.value })
                    }
                  />
                </InputWrapper>
              </div>
              <div className={styles.inputRow}>
                <InputWrapper label="Title or Author">
                  <input
                    type="text"
                    className={styles.searchInputTwo}
                    placeholder="Enter keywords, book title, or author name"
                    value={this.state.mainBookInput}
                    onChange={e =>
                      this.setState({ mainBookInput: e.target.value })
                    }
                  />
                </InputWrapper>
                <InputWrapper label="&zwnj;">
                  <button
                    type="submit"
                    className={styles.searchButton}
                    disabled={
                      !this.state.selectedSchool || !this.state.selectedProgram
                    }
                  >
                    Search Postings
                  </button>
                </InputWrapper>
              </div>
              <div className={styles.resetButton} onClick={this.resetForm}>
                Reset
              </div>
            </form>
          </div>
        </div>

        {/* POSTINGS SECTION */}
        <div className={styles.postContainer}>
          <div className={styles.postings}>
            <div className={styles.postHeader} id="postHeader">
              <div className={[styles.postHeaderItem, styles.date].join(" ")}>
                Date Posted
              </div>
              <div className={[styles.postHeaderItem, styles.name].join(" ")}>
                Book Title
              </div>
              <div
                className={[styles.postHeaderItem, styles.program].join(" ")}
              >
                Program
              </div>
              <div className={[styles.postHeaderItem, styles.code].join(" ")}>
                Course Code
              </div>
              <div className={[styles.postHeaderItem, styles.price].join(" ")}>
                Price
              </div>
            </div>
            {this.state.postsLoading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 10
                }}
              >
                <ClipLoader
                  sizeUnit={"px"}
                  size={70}
                  color={"#0069d9"}
                  loading={true}
                />
              </div>
            )}
            {this.renderPostings()}
          </div>
          <div className={styles.pageNavContainer}>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={20}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={null}
              containerClassName={styles.paginationContainer}
              activeClassName={styles.active}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Postings;
