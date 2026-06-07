import React from "react";
import styles from "./PageLoader.module.scss";

export default function PageLoader() {
  return (
    <div 
      className={styles.loaderContainer}
      role="status" 
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className={styles.spinner} />
      <span className={styles.loaderText}>Loading, please wait...</span>
    </div>
  );
}