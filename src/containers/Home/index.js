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

const renderTitleText = index => {
  const titleText = "Search Hundreds of Textbooks Now";
  const titleElem = document.getElementById("titleText");
  if (index == titleText.length || titleElem === null) return;
  titleElem.innerHTML = titleElem.innerHTML + titleText[index];
  setTimeout(() => renderTitleText(index + 1), 100);
};

class Home extends Component {
  state = {
    selectedSchool: { label: "University of Guelph", value: "UofG" },
    selectedProgram: null,
    courseLevel: "",
    mainBookInput: ""
  };

  componentDidMount() {
    renderTitleText(0);
  }

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
          <div id="titleText" className={styles.searchHeader} />
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
              Reduce waste by reusing and recycling books!
            </div>
          </div>
          <div className={styles.feature}>
            <FaRegCheckCircle className={styles.icon} />
            <div className={styles.featureHeader}>Easy to Use</div>
            <div className={styles.featureDesc}>
              Connect with students across Ontario to find your books today
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
                <ul styles="margin: 0;">
                  <li className={styles.bulletPoint}>
                    Book Buy offers students a simple way of finding, buying and
                    selling their textbooks without the need to release personal
                    information like an email or phone number.
                  </li>
                  <li className={styles.bulletPoint}>
                    Book Buy instantly connects students from all across Ontario
                    with the textbooks they’re looking for, in one single place.
                    No more searching through endless facebook groups.
                  </li>
                  <li className={styles.bulletPoint}>
                    Read more about us by visiting our{" "}
                    <Link to="/terms" target="_blank">
                      Terms Page!
                    </Link>
                  </li>
                </ul>
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

                <div className={styles.stepItem}>
                  <div className={styles.stepContainer}>
                    <div className={styles.stepLabel}>STEP</div>
                    <div className={styles.stepValue}>01</div>
                  </div>
                  <div className={styles.divider} />
                  <div className={styles.stepText}>
                    Search for cheap, used books using the 'Postings' section
                    and contact a seller
                  </div>
                </div>

                <div className={styles.stepItem}>
                  <div className={styles.stepContainer}>
                    <div className={styles.stepLabel}>STEP</div>
                    <div className={styles.stepValue}>02</div>
                  </div>
                  <div className={styles.divider} />
                  <div className={styles.stepText}>
                    Create a posting to sell your old book for cash using the
                    'Sell Books' section
                  </div>
                </div>

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
