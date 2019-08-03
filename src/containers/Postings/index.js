import React, { Component } from "react";
import styles from "./styles.scss";

import InputWrapper from "../../components/InputWrapper";
import Select from "react-select";
import Post from "../../components/Post";
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
    shownPostLimit: 20,
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

      // TODO: use new query structure
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
        500
      );
      this.setState({ fetchedPostings, postsLoading: false, openPosts: true });
    } else {
      // if regular fetch, get paginated posts
      this.fetchPostings(this.state.shownPostLimit, null);
    }
  }

  schoolSelector = option => {
    this.setState({ selectedSchool: option });
  };

  programSelector = option => {
    this.setState({ selectedProgram: option });
  };

  searchForTextbook = async event => {
    event && event.preventDefault();
    this.setState({
      fetchedPostings: [],
      postsLoading: true,
      openPosts: false
    });

    const {
      selectedSchool,
      selectedProgram,
      courseLevel,
      mainBookInput
    } = this.state;

    // get docs from firebase that match input
    let fetchedPostings = await firebase.getDocsFromCollection("postings", [
      ["userSchool.value", "==", selectedSchool.value],
      ["program.value", "==", selectedProgram.value],
      ["courseLevel", "==", courseLevel],
      ["flagged", "==", false]
    ]);

    // if there is title/author input, query that too
    if (!!mainBookInput) {
      fetchedPostings = fetchedPostings.filter(post => {
        return (
          post.bookTitle.toLowerCase().includes(mainBookInput.toLowerCase()) ||
          post.bookAuthor.toLowerCase().includes(mainBookInput.toLowerCase())
        );
      });
    }

    this.setState({ fetchedPostings, postsLoading: false });
  };

  renderPostings = () => {
    const { fetchedPostings, shownPostLimit, openPosts } = this.state;

    fetchedPostings.sort((postA, postB) => {
      if (postA.datePosted < postB.datePosted) return 1;
      else if (postA.datePosted > postB.datePosted) return -1;
      return 0;
    });

    return fetchedPostings.slice(0, shownPostLimit).map((posting, index) => {
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
    // TODO: fetch new posts and reset postings
    this.setState({
      fetchPostings: [],
      selectedProgram: null,
      courseLevel: "",
      mainBookInput: ""
    });
    this.props.history.push({
      search: ""
    });
    this.fetchPostings(20, null);
  };

  expandMorePosts = () => {
    const { shownPostLimit, lastPostRef } = this.state;
    this.fetchPostings(shownPostLimit + 10, lastPostRef);
  };

  fetchPostings = async (limit, lastDocument = null) => {
    const { lastPostRef: stateLastPostRef } = this.state;

    this.setState({ postsLoading: true });
    const [fetchedPostings, lastPostRef] = await firebase.getPaginatedPostings(
      limit,
      lastDocument
    );

    console.log("last Post", lastPostRef);

    console.log("state last post", stateLastPostRef);

    this.setState(
      {
        fetchedPostings,
        shownPostLimit: fetchedPostings.length,
        lastPostRef,
        postsLoading: false,
        getMorePosts: stateLastPostRef
          ? JSON.stringify(stateLastPostRef._document.proto) ===
            JSON.stringify(lastPostRef._document.proto)
            ? false
            : true
          : true
      },
      () => this.renderPostings()
    );
  };

  render() {
    const { fetchedPostings, shownPostLimit, getMorePosts } = this.state;
    console.log(fetchedPostings, shownPostLimit);

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
            {/* Expand more posts section */}
            {fetchedPostings.length !== 0 && getMorePosts && (
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
                  program: { label: "BUS (Business)", value: "BUS" },
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

export default Postings;
