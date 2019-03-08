import React, { Component } from "react";
import styles from "./styles.scss";

import InputWrapper from "../../components/InputWrapper";
import Select from "react-select";
import Post from "../../components/Post";
import ReactPaginate from "react-paginate";

import {
  schoolDropdownValues,
  programDropdownValues
} from "../../assets/dropdownValues";

class Postings extends Component {
  state = {
    selectedSchool: { label: "University of Guelph", value: "UofG" },
    selectedProgram: null,
    courseLevel: "",
    mainBookInput: ""
  };

  schoolSelector = option => {
    this.setState({ selectedSchool: option });
  };

  programSelector = option => {
    this.setState({ selectedProgram: option });
  };

  searchForTextbook = event => {
    event.preventDefault();
  };

  render() {
    return (
      <div className={styles.postingsContainer}>
        {/* SEARCH PANEL */}
        <div className={styles.searchPanel}>
          <div className={styles.searchHeader}>
            Search thousands of postings
          </div>
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
            </form>
          </div>
        </div>

        {/* POSTINGS SECTION */}
        <div className={styles.postContainer}>
          <div className={styles.postings}>
            <div className={styles.postHeader}>
              <div className={[styles.postHeaderItem, styles.date].join(" ")}>
                Date Posted
              </div>
              <div
                className={[styles.postHeaderItem, styles.program].join(" ")}
              >
                Program
              </div>
              <div className={[styles.postHeaderItem, styles.code].join(" ")}>
                Course Code
              </div>
              <div className={[styles.postHeaderItem, styles.name].join(" ")}>
                Name
              </div>
              <div className={[styles.postHeaderItem, styles.price].join(" ")}>
                Price
              </div>
            </div>
            <Post />
            <Post />
            <Post />
            {/* RENDER POSTS HERE */}
          </div>
          <div className={styles.pageNavContainer}>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={10}
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
