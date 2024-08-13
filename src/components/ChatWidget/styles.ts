export const styles: {
  chatWidget: React.CSSProperties;
  chatWidgetText: React.CSSProperties;
  modalWindow: React.CSSProperties;
} = {
  chatWidget: {
    backgroundColor: "#5ec32f",
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
    width: "15vw",
    height: "30vh",
    // maxWidth: "calc(100% - 48px)",
    // maxHeight: "calc(100% - 48px)",
    backgroundColor: "white",
    borderRadius: "12px",
    border: `2px solid #5ec32f`,
    overflow: "hidden",
    boxShadow: "0px 0px 16px 6px rgba(0, 0, 0, 0.33)",
  },
};
