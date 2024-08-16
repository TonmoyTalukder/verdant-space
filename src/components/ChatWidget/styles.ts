export const styles = (isMobile: boolean): {
  chatWidget: React.CSSProperties;
  chatWidgetText: React.CSSProperties;
  modalWindow: React.CSSProperties;
} => ({
  chatWidget: {
    backgroundColor:  isMobile ? "#21390e" : "#21390e",
    paddingLeft: "0.2rem",
    paddingRight: "0.2rem",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
    borderRadius: "10px",
    cursor: "pointer",
  },

  chatWidgetText: {
    // Reserved for future use if needed
  },

  modalWindow: {
    width: isMobile ? "35vw" : "15vw",
    height: "30vh",
    backgroundColor: "white",
    borderRadius: "12px",
    border: `2px solid #21390e`,
    overflow: "hidden",
    boxShadow: "0px 0px 16px 6px rgba(0, 0, 0, 0.33)",
    marginBottom: '3vh',
  },
});