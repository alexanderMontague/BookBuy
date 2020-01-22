import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./styles.scss";

import InputWrapper from "../../components/InputWrapper";
import Select from "react-select";
import Post from "../../components/Post";
import firebase from "../../firebase";
import { schools, courses } from "../../assets/courses";

import { ClipLoader } from "react-spinners";

let hasScrolled = false;
let startingHeaderOffset = 0;
window.onscroll = () => {
  const container = document.getElementById("postContainer");
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
      container.classList.add(styles.addPadding);
      header.classList.add(styles.sticky);
    } else {
      container.classList.remove(styles.addPadding);
      header.classList.remove(styles.sticky);
    }
  }
};

class Postings extends Component {
  state = {
    selectedSchool: [],
    selectedProgram: null,
    courseLevel: "",
    mainBookInput: "",
    postsLoading: true,
    shownPostLimit: 0,
    fetchedPostings: [],
    lastPostRef: null,
    getMorePosts: true,
    openPosts: false
  };

  async componentDidMount() {
    // book search params coming from home
    if (window.location.search.includes("?params=")) {
      const rawParams = new URLSearchParams(window.location.search).get(
        "params"
      );
      const searchParams = JSON.parse(atob(rawParams));
      this.setState({ ...searchParams }, () => this.searchForTextbook());
    }
    // book ID coming from chat
    else if (window.location.search.includes("?id=")) {
      const postId = new URLSearchParams(window.location.search).get("id");
      const fetchedPostings = await firebase.getDocsFromCollection("postings", [
        ["postId", "==", postId],
        ["flagged", "==", false]
      ]);

      // if linked to post, scroll into view automagically
      setTimeout(
        () =>
          window.scroll({
            top:
              window.innerWidth <= 450
                ? document.body.scrollHeight - 500
                : document.body.scrollHeight,
            left: 0,
            behavior: "smooth"
          }),
        200
      );
      this.setState({ fetchedPostings, postsLoading: false, openPosts: true });
    } else {
      // if regular fetch, get 20 posts on load
      this.fetchPostings(20, null);
    }
  }

  schoolSelector = option => {
    this.setState({ selectedSchool: option, selectedProgram: null });
  };

  programSelector = option => {
    this.setState({ selectedProgram: option });
  };

  searchForTextbook = async event => {
    event && event.preventDefault();
    this.setState(
      {
        fetchedPostings: [],
        lastPostRef: null,
        postsLoading: true,
        openPosts: false,
        shownPostLimit: 0
      },
      () => this.fetchPostings(10, null)
    );
  };

  renderPostings = () => {
    const { fetchedPostings, openPosts } = this.state;

    fetchedPostings.sort((postA, postB) => {
      if (postA.datePosted < postB.datePosted) return 1;
      else if (postA.datePosted > postB.datePosted) return -1;
      return 0;
    });

    return fetchedPostings.map((posting, index) => {
      const isGrey = index % 2 !== 0;

      return (
        <Post
          key={`${posting.userId}${posting.bookAuthor}${posting.bookTitle}`}
          {...posting}
          isGrey={isGrey}
          openPosts={openPosts}
        />
      );
    });
  };

  resetForm = () => {
    this.setState(
      {
        selectedSchool: [],
        fetchedPostings: [],
        lastPostRef: null,
        selectedProgram: null,
        courseLevel: "",
        mainBookInput: "",
        shownPostLimit: 0,
        openPosts: false
      },
      // fetch 20 posts on reset
      () => this.fetchPostings(20, null)
    );
    this.props.history.push({
      search: ""
    });
  };

  expandMorePosts = () => {
    const { shownPostLimit, lastPostRef } = this.state;
    // fetch 10 more posts each show more click
    this.fetchPostings(shownPostLimit + 10, lastPostRef);
  };

  fetchPostings = async (limit, lastDocument = null) => {
    const {
      lastPostRef,
      fetchedPostings,
      shownPostLimit,
      selectedSchool,
      selectedProgram,
      courseLevel,
      mainBookInput
    } = this.state;

    this.setState({ postsLoading: true });
    // get paginated posts and last document reference
    const [
      newFetchedPostings,
      newLastPostRef
    ] = await firebase.getPaginatedPostings(limit, lastDocument, {
      school: selectedSchool.value,
      program: selectedProgram ? selectedProgram.value : null,
      level: courseLevel,
      authorTitle: mainBookInput
    });

    // aggregate new postings, set last doc ref, determine if showing more posts
    this.setState(
      {
        fetchedPostings: [...fetchedPostings, ...newFetchedPostings],
        shownPostLimit: shownPostLimit + newFetchedPostings.length,
        lastPostRef: newLastPostRef,
        postsLoading: false,
        getMorePosts: newLastPostRef ? true : false
      },
      () => this.renderPostings()
    );
  };

  getCoursesFromSchool() {
    return this.state.selectedSchool
      ? courses[this.state.selectedSchool.value]
      : null;
  }

  render() {
    const { fetchedPostings, getMorePosts, openPosts } = this.state;
    const { isMobile } = this.props;

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
                    options={schools}
                    className={styles.schoolInput}
                    placeholder="Select a School"
                  />
                </InputWrapper>
                <InputWrapper label="Program" required>
                  <Select
                    value={this.state.selectedProgram}
                    onChange={this.programSelector}
                    options={this.getCoursesFromSchool()}
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
                    placeholder="Enter keywords, book title or author name"
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
          <div className={styles.postings} id="postContainer">
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
                {isMobile ? "Code" : "Course Code"}
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
            {/* Expand more posts section */}
            {fetchedPostings.length !== 0 && getMorePosts && !openPosts && (
              // pass along dummy post as graphic to load more posts
              <Post
                {...{
                  bookAuthor: "BookBuy",
                  bookEdition: "",
                  bookPrice: "0",
                  bookQuality: "",
                  bookTitle: "More Textbooks",
                  courseLevel: "100",
                  datePosted: 1554339752,
                  flagged: false,
                  hasPicture: false,
                  postId: "JQ2BPSeb8JD51u7lXFCq",
                  program: { label: "BKBY (BookBuy)", value: "BOOKBUY" },
                  userId: "bT1L5gvZnKTW15zq4whF0qkJy6J2",
                  userSchool: {
                    label: "University of Guelph",
                    value: "UofG"
                  }
                }}
                isExpandPost
                expandMorePosts={this.expandMorePosts}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isMobile: state.interfaceState.isMobile
});

export default connect(mapStateToProps)(Postings);
