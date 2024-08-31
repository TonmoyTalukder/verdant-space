import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Button, Row, Col, Rate } from "antd";
import { useState, useEffect, useRef } from "react";
import "./SearchTab.css";
import { useSearchProductsQuery } from "../../redux/features/products/productsApi";
import { debounce } from "lodash";
import { TProduct } from "../../types/productTypes";
import { useDispatch } from "react-redux";
import { setSearchResults } from "../../redux/features/products/productsSlice";
import { useNavigate } from "react-router-dom";

interface SearchTabProps {
  setShowSearchTab: (show: boolean) => void;
}

const SearchTab = ({ setShowSearchTab }: SearchTabProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<TProduct[]>([]);
  const searchTabRef = useRef<HTMLDivElement>(null); // Ref to detect outside clicks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch search results from the API
  const { data: searchResults } = useSearchProductsQuery({
    searchTerm: searchQuery,
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

  // Update suggestions based on search results
  const updateSuggestions = () => {
    if (
      searchResults &&
      searchResults.data &&
      Array.isArray(searchResults.data)
    ) {
      // Filter valid items
      const validItems = searchResults.data.filter(
        (item: TProduct) => item.name,
      );

      if (validItems.length > 0) {
        setSuggestions(validItems);
      } else {
        setSuggestions([]); // Clear suggestions if no valid items
      }
    } else {
      setSuggestions([]); // Clear suggestions if no results
    }
  };

  useEffect(() => {
    updateSuggestions();
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
    setVisible(value.trim() !== "");

    // Log current search text
    console.log("Current Search Text:", value);
    console.log("Current searchResults:", searchResults);
  };

  const handleSearch = () => {
    dispatch(setSearchResults(searchResults));
    navigate("/shop");
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
        {suggestions.length > 0 ? (
          suggestions.map((product) => (
            <Row
              key={product._id}
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <Col
                span={24}
                style={{ display: "flex", justifyContent: "left" }}
              >
                <Row
                  style={{
                    marginBottom: "1vh",
                    alignItems: "center", // Align items vertically in the middle
                    width: "100%",
                  }}
                >
                  {/* Image Column */}
                  <Col span={6}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "6vw",
                        height: "6vh",
                        // marginRight: "2vw",
                      }}
                    />
                  </Col>

                  {/* Product Info Column */}
                  <Col span={10}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            color: "blue",
                            textDecoration: "underline",
                            fontWeight: "800",
                            cursor: "pointer", // Make it look clickable
                            textAlign: "left",
                          }}
                          onClick={() => {
                            // Navigate to the product page
                            window.location.href = `/#/product/${product.productId}`;
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLParagraphElement).style.color =
                              "#d1ad0d"; // Change color on hover
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLParagraphElement).style.color =
                              "blue"; // Revert color on mouse leave
                          }}
                        >
                          {product.name}
                        </p>
                        <p style={{ textAlign: "left" }}>{product.type}</p>
                        <p style={{ textAlign: "left" }}>
                          Price: ৳ {product.price}
                        </p>
                      </div>
                    </div>
                  </Col>

                  {/* Rating Column */}
                  <Col span={8} style={{ textAlign: "center" }}>
                    <Rate allowHalf disabled value={product.rating} />
                  </Col>
                </Row>
              </Col>
            </Row>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "13vh",
            }}
          >
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
