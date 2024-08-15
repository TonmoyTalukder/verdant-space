import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";
import { useState, useEffect, useRef } from "react";
import './SearchTab.css';

interface SearchTabProps {
  setShowSearchTab: (show: boolean) => void;
}

const SearchTab = ({ setShowSearchTab }: SearchTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const searchTabRef = useRef<HTMLDivElement>(null); // Ref to detect outside clicks

  const handleSearch = () => {
    console.log("Search Text:", searchQuery);
  };

  useEffect(() => {
    // Set the SearchTab to visible for the transition effect
    setVisible(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchTabRef.current &&
        !searchTabRef.current.contains(event.target as Node)
      ) {
        setVisible(false); // Start hiding the SearchTab
        setTimeout(() => {
          setShowSearchTab(false); // Remove the SearchTab after the transition
        }, 300); // Match this timeout with the transition duration
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSearchTab]);

  return (
    <div
      ref={searchTabRef}
      className={`search-tab ${visible ? 'visible' : ''}`}
    >
      <div className="search-tab-header">
        <Button
          onClick={() => {
            setVisible(false); // Hide with transition
            setTimeout(() => setShowSearchTab(false), 300); // Remove after transition
          }}
          style={{
            marginRight: "1vw",
            border: "none",
            backgroundColor: "transparent",
            boxShadow: "none",
            color: "#628753",
          }}
        >
          <ArrowLeftOutlined style={{ fontWeight: 'bold' }} />
        </Button>
        <Input
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            console.log("Search Text:", e.target.value); // Print search input to console
          }}
          className="custom-input"
          placeholder="Search..."
        />
        <Button
          onClick={handleSearch}
          icon={<SearchOutlined />}
          style={{
            backgroundColor: "#628753",
            color: "#fff",
            borderRadius: "4px",
            border: "none",
          }}
        />
      </div>

      {/* Suggestion box */}
      <div className="suggestion-box">
        <p style={{ color: "#888", margin: 0 }}>
          {searchQuery.trim() === "" ? "Nothing found" : "Suggestions will appear here..."}
        </p>
      </div>
    </div>
  );
};

export default SearchTab;
