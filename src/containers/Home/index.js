import React, { Component } from "react";
import styles from "./styles.scss";

import InputWrapper from "../../components/InputWrapper";
import Select from "react-select";
import { FaBook, FaRegCheckCircle, FaSearchDollar } from "react-icons/fa";

import {
  schoolDropdownValues,
  programDropdownValues
} from "../../assets/dropdownValues";
import review1 from "../../assets/head1.jpg";
import review2 from "../../assets/head2.jpg";
import review3 from "../../assets/head3.jpg";

class Home extends Component {
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
      <div className={styles.homeContainer}>
        {/* SEARCH PANEL */}
        <div className={styles.searchPanel}>
          <div className={styles.searchHeader}>
            Find the textbook you need, for cheap.
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

        {/* FEATURES PANEL */}
        <div className={styles.featuresPanel}>
          <div className={styles.feature}>
            <FaBook className={styles.icon} />
            <div className={styles.featureHeader}>Find Textbooks</div>
            <div className={styles.featureDesc}>
              Come up with some creative shit here
            </div>
          </div>
          <div className={styles.feature}>
            <FaRegCheckCircle className={styles.icon} />
            <div className={styles.featureHeader}>Easy to Use</div>
            <div className={styles.featureDesc}>say how easy it is nicky</div>
          </div>
          <div className={styles.feature}>
            <FaSearchDollar className={styles.icon} />
            <div className={styles.featureHeader}>Find the Lowest Prices</div>
            <div className={styles.featureDesc}>
              one more time, hit me with some magic
            </div>
          </div>
        </div>

        {/* INFO PANEL */}
        <div className={styles.infoPanel}>
          <div className={styles.infoRow}>
            <div className={styles.textBlock}>
              <div className={styles.textTitle}>About Textbook Trade</div>
              <div className={styles.textDesc}>Blah blah blah</div>
            </div>
            <div className={[styles.pictureBlock, styles.books].join(" ")} />
          </div>
          <div className={[styles.infoRow, styles.reverseCol].join(" ")}>
            <div className={[styles.pictureBlock, styles.money].join(" ")} />
            <div className={styles.textBlock}>
              <div className={styles.textTitle}>This is what we do...</div>
              <div className={styles.textDesc}>Blah blah blah</div>
            </div>
          </div>
        </div>

        {/* REVIEWS PANEL */}
        <div className={styles.reviewsPanel}>
          <div className={styles.reviewTitle}>What people are saying...</div>
          <div className={styles.reviewContainer}>
            <div className={styles.review}>
              <img className={styles.reviewPic} src={review1} />
              <div className={styles.reviewHeader}>Alex M</div>
              <div className={styles.reviewDesc}>This shits hot</div>
            </div>
            <div className={styles.review}>
              <img className={styles.reviewPic} src={review2} />
              <div className={styles.reviewHeader}>Nick B</div>
              <div className={styles.reviewDesc}>holy fuck I love this</div>
            </div>
            <div className={styles.review}>
              <img className={styles.reviewPic} src={review3} />
              <div className={styles.reviewHeader}>Bobby J</div>
              <div className={styles.reviewDesc}>
                i save so much on textbooks I buy more blow!
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
