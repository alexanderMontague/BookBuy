import React from "react";
import styles from "./styles.scss";

const InputWrapper = props => {
  const { label, required, color, children, inputStyle = null } = props;

  return (
    <div className={styles.inputWrapper} style={inputStyle}>
      <span className={styles.label} style={{ color }}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </span>
      {children}
    </div>
  );
};

export default InputWrapper;
