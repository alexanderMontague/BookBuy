import React, { Component } from "react";
import styles from "./styles.scss";

import InputWrapper from "../../components/InputWrapper";
import Select from "react-select";
import { Link } from "react-router-dom";
import { FaRecycle, FaRegCheckCircle, FaSearchDollar } from "react-icons/fa";

import {
  schoolDropdownValues,
  programDropdownValues
} from "../../assets/dropdownValues";

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
    const {
      selectedSchool,
      selectedProgram,
      courseLevel,
      mainBookInput
    } = this.state;

    const searchInfo = {
      selectedSchool,
      selectedProgram,
      courseLevel,
      mainBookInput
    };

    this.props.history.push({
      pathname: "/postings",
      search: `?params=${btoa(JSON.stringify(searchInfo))}`
    });
  };

  render() {
    return (
      <div className={styles.homeContainer}>
        {/* SEARCH PANEL */}
        <div className={styles.searchPanel}>
          <div className={styles.searchHeader}>
            Search Hundreds of Textbooks Now
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
            <FaRecycle className={styles.icon} />
            <div className={styles.featureHeader}>Environmentally Friendly</div>
            <div className={styles.featureDesc}>
              Save trees, recycle your books!
            </div>
          </div>
          <div className={styles.feature}>
            <FaRegCheckCircle className={styles.icon} />
            <div className={styles.featureHeader}>Easy to Use</div>
            <div className={styles.featureDesc}>
              Connect with students across Ontario and find your books today
            </div>
          </div>
          <div className={styles.feature}>
            <FaSearchDollar className={styles.icon} />
            <div className={styles.featureHeader}>Find the Lowest Prices</div>
            <div className={styles.featureDesc}>
              Instantly compare prices from hundreds of books!
            </div>
          </div>
        </div>

        {/* INFO PANEL */}
        <div className={styles.infoPanel}>
          <div className={styles.infoRow}>
            <div className={styles.textBlock}>
              <div className={styles.textTitle}>About Book Buy</div>
              <div className={styles.textDesc}>
                <p>
                  Book Buy offers students a simple way of finding, buying and
                  selling their textbooks
                </p>
                <p>
                  Book Buy instantly connects students from all across Ontario
                  with the textbooks they’re looking for!
                </p>
              </div>
            </div>
            <div className={[styles.pictureBlock, styles.books].join(" ")} />
          </div>
          <div className={[styles.infoRow, styles.reverseCol].join(" ")}>
            <div className={[styles.pictureBlock, styles.money].join(" ")} />
            <div className={styles.textBlock}>
              <div className={styles.textTitle}>How it Works</div>
              <div className={styles.textDesc}>
                <p>
                  BookBuy provides two unique services for students to utilize:
                </p>
                <p>
                  1) Search for cheap, used books using the 'Postings' section
                  and contact a seller
                </p>
                <p>
                  2) Create a posting to sell your old book for cash using the
                  'Sell Books' section
                </p>
                <p>Find your book now or create an account to start selling!</p>
              </div>
            </div>
          </div>
        </div>

        {/* ADD A POSTING PANEL */}
        <div className={styles.addPostingPanel}>
          <div className={styles.postingTitle}>Ready to sell your books?</div>
          <Link className={styles.postingButton} to="/auth">
            Register Now!
          </Link>
        </div>

        {/* REVIEWS PANEL */}
        {/* <div className={styles.reviewsPanel}>
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
        </div> */}
      </div>
    );
  }
}

export default Home;
