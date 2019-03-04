import React, { Component } from "react";
import styles from "./styles.scss";

import Select from "react-select";

class Home extends Component {
  state = {
    selectedSchool: { label: "University of Guelph", value: "UofG" }
  };

  schoolSelector = option => {
    this.setState({ selectedSchool: option });
  };

  render() {
    return (
      <div className={styles.homeContainer}>
        <div className={styles.searchPanel}>
          <div className={styles.searchHeader}>
            Find the textbook you need, for cheap.
          </div>
          <div className={styles.searchForm}>
            <Select
              value={this.state.selectedSchool}
              onChange={this.schoolSelector}
              options={[{ label: "University of Guelph", value: "UofG" }]}
            />
            <input type="text" className={styles.searchInput} />
          </div>
        </div>
        <div className={styles.featuresPanel}>FEATURES</div>
        <div className={styles.otherPanel}>SOME OTHER FEATURE</div>
      </div>
    );
  }
}

export default Home;
