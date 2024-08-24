import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Button, Row, Col, Rate } from "antd";
import { useState, useEffect, useRef } from "react";
import "./SearchTab.css";
import { useSearchProductsQuery } from "../../redux/features/products/productsApi";
import { debounce } from "lodash";
import { TProduct } from "../../types/productTypes";

interface SearchTabProps {
  setShowSearchTab: (show: boolean) => void;
}

const SearchTab = ({ setShowSearchTab }: SearchTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<TProduct[]>([]);
  const searchTabRef = useRef<HTMLDivElement>(null); // Ref to detect outside clicks

  const { data: searchResults } = useSearchProductsQuery(searchQuery, {
    skip: !searchQuery,
  });

  // Debounced function to set the search query
  const debouncedSearch = useRef(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 500),
  ).current;

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

  // const logNames = () => {
  //   if (searchResults && searchResults.data && Array.isArray(searchResults.data)) {
  //     searchResults.data.forEach((item: TProduct) => {
  //       if (item.name) {
  //         console.log(item.name);
  //         setSuggestions([item.name]);
  //       } else {
  //         console.log("Item has no name property.");
  //       }
  //     });
  //   } else {
  //     console.log("No search results found.");
  //   }
  // };

  const logs = () => {
    if (
      searchResults &&
      searchResults.data &&
      Array.isArray(searchResults.data)
    ) {
      // Collect all valid items
      const validItems = searchResults.data.filter(
        (item: TProduct) => item.name,
      );

      if (validItems.length > 0) {
        // Update suggestions state with all valid items
        console.log(validItems);
        setSuggestions(validItems);
      } else {
        console.log("No valid items found.");
        setSuggestions([]); // Clear suggestions if no valid items
      }
    } else {
      console.log("No search results found.");
      setSuggestions([]); // Clear suggestions if no results
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
    setVisible(e.target.value.trim() !== "");

    // Log the search text in real-time
    console.log("Current Search Text:", e.target.value);
    console.log("searchResults.data[0].name: ", searchResults.data[0].name);
    logs();
  };

  const handleSearch = () => {
    console.log("Search Text:", searchQuery);
    // console.log(searchResults);
    logs();
  };

  return (
    <div
      ref={searchTabRef}
      className={`search-tab ${visible ? "visible" : ""}`}
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
          <ArrowLeftOutlined style={{ fontWeight: "bold" }} />
        </Button>
        <Input
          value={searchQuery}
          onChange={handleInputChange}
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
        {/* <p style={{ color: "#888", margin: 0 }}>
          {searchQuery.trim() === "" ? "Nothing found" : "Suggestions will appear here..."}
          {searchQuery.trim() === "" ? "Nothing found" : `${searchResults.data[0].name}`}
        </p> */}

        {/* {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <p key={index} style={{ color: "#333", margin: 0 }}>
              {suggestion}
            </p>
          ))
        ) : (
          <p style={{ color: "#888", margin: 0 }}>
            {searchQuery.trim() === ""
              ? "Start typing to see suggestions..."
              : "No suggestions found"}
          </p>
        )} */}

        {suggestions.length > 0 ? (
          suggestions.map((product) => (
            <Row
              key={product._id}
              style={{
                marginBottom: "10px",
                display: "flex",
                alignContent: "center", // Align items vertically
                padding: "10px", // Optional: Adds padding for better spacing
                backgroundColor: "#f9f9f9", // Optional: Background color
              }}
            >
              <Col
                span={24}
                style={{
                  display: "flex",
                  // alignItems: "center", // Align items vertically
                  justifyContent: "left", // Space between items
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "6vw", height: "6vh", marginRight: "2vw" }}
                />
                <div
                  style={{
                    display: "flex",
                    // alignItems: "center", // Align items vertically
                    justifyContent: "space-between", // Space between items
                    width: "100%",
                    marginLeft: "2vw",
                    marginRight: "1vw",
                  }}
                >
                  <div>
                    <b>{product.name}</b>&#160;&#160;&#160;
                    <span>{product.type}</span>
                    <p>{product.price}</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <Rate allowHalf disabled value={product.rating} />
                  </div>
                </div>
              </Col>
            </Row>
          ))
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: 'center', height: '13vh' }}>
            <p style={{ color: "#888", margin: 0, textAlign: "center" }}>
              {searchQuery.trim() === ""
                ? "Start typing to see suggestions..."
                : "No suggestions found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTab;
