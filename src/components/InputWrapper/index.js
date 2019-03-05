import React from "react";
import styles from "./styles.scss";

const InputWrapper = props => {
  return (
    <div className={styles.inputWrapper}>
      <span className={styles.label}>
        {props.label}
        {props.required && <span className={styles.required}> *</span>}
      </span>
      {props.children}
    </div>
  );
};

export default InputWrapper;
