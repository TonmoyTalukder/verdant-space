import { useState, useEffect, useRef } from "react";
import {
  SearchOutlined,
  UserOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Image,
  Input,
  Select,
  Button,
  ConfigProvider,
  Badge,
  Rate,
  Col,
  Row,
  Modal,
} from "antd";
import type { InputRef } from "antd";
import "./Banner.css";
import { useSearchProductsQuery } from "../../redux/features/products/productsApi";
import { TProduct } from "../../types/productTypes";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { setSearchResults } from "../../redux/features/products/productsSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CartInfo from "./CartInfo";
import WishlistDrawer from "./WishlistDrawer";

const { Option } = Select;

interface CartItem {
  productId: string;
  productName: string;
  image: string;
  quantity: number;
  price: number;
}

const Banner = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [suggestionBoxWidth, setSuggestionBoxWidth] = useState(0);
  const [suggestions, setSuggestions] = useState<TProduct[]>([]);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // Check if auth is empty
  // const isAuthEmpty = !auth || Object.keys(auth).length === 0;

  const handleProceedToCheckout = () => {
    if (auth.role === null) {
      navigate("/login");
    } else {
      navigate(auth.role === "admin" ? "/admin" : "/user");
    }
  };

  const handleWishlist = () => {
    ("Wishlist");
    setWishlistOpen(true);
  };

  const showCartModal = () => {
    setIsCartModalOpen(true);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: searchResults } = useSearchProductsQuery(
    { searchTerm: searchText, type: selectedOption },
    {
      skip: !searchText, // Skip query if searchText is empty
    },
  );

  // Function to calculate total price
  const calculateTotalPrice = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0); // Calculate total price based on item price and quantity
  };

  // Function to calculate total quantity
  const calculateTotalQuantity = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    totalQuantity;
    const total = calculateTotalPrice(cartItems);
    setTotalPrice(total);

    `Cart items length: ${cartItems.length}`; // Log the length of the cart items array
  }, [cartItems, totalQuantity]);

  // Recalculate total quantity whenever cartItems changes
  useEffect(() => {
    const totalQty = calculateTotalQuantity(cartItems); // Calculate the total quantity
    setTotalQuantity(totalQty); // Update the state with the new total quantity
  }, [cartItems]); // Dependency on cartItems to update total quantity when items change

  const debouncedSearch = useRef(
    debounce((query: string) => {
      setSearchText(query);
    }, 500),
  ).current;

  const inputRef = useRef<InputRef | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  // Filter the search results on client-side for extra safety
  useEffect(() => {
    if (searchResults && searchResults.success) {
      const filteredResults = searchResults.data.filter((product: TProduct) => {
        const matchesSearchTerm =
          product.name.toLowerCase().includes(searchText.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          product.type.toLowerCase().includes(searchText.toLowerCase()) ||
          product.tags.some((tag) =>
            tag.toLowerCase().includes(searchText.toLowerCase()),
          );

        const matchesType = selectedOption
          ? product.type === selectedOption
          : true;

        return matchesSearchTerm && matchesType;
      });
      setSuggestions(filteredResults);
      // ("Filtered results: ", filteredResults);
    } else {
      setSuggestions([]);
    }
  }, [searchResults, searchText, selectedOption]);

  const handleSearch = () => {
    // Dispatch search results to the Redux store
    dispatch(setSearchResults(searchResults));
    navigate("/shop");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (
      suggestionBoxRef.current &&
      !suggestionBoxRef.current.contains(e.target as Node)
    ) {
      setSuggestionsVisible(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionBoxRef.current &&
        !suggestionBoxRef.current.contains(event.target as Node)
      ) {
        setSuggestionsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current && selectRef.current && buttonRef.current) {
      const inputWidth = inputRef.current.input?.offsetWidth || 0;
      const selectWidth = selectRef.current?.offsetWidth || 0;
      const buttonWidth = buttonRef.current.offsetWidth;
      setSuggestionBoxWidth(inputWidth + selectWidth + buttonWidth);
    }
  }, [searchText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
    setSuggestionsVisible(e.target.value.trim() !== "");
  };

  return (
    <div
      style={{
        backgroundColor: "#628753",
        height: "15vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2%",
      }}
    >
      <div
        style={{
          width: "15%",
          height: "15vh",
          overflow: "hidden",
          alignContent: "center",
        }}
      >
        <Image
          src="/VerdantSpace Banner.png"
          preview={false}
          style={{
            width: "102%",
            height: "102%",
            objectFit: "cover",
            objectPosition: "center",
            transform: "scale(1.009)",
          }}
        />
      </div>
      {/* Search Tab */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          marginLeft: "2%",
          marginRight: "2%",
          position: "relative", // Needed to position suggestion box
        }}
      >
        <Input
          placeholder="Search..."
          value={searchText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="custom-input"
          ref={inputRef}
          style={{
            width: "25vw",
            marginRight: "0vw",
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "0px",
            borderTopRightRadius: "0px",
          }}
        />
        <div className="custom-select-container" ref={selectRef}>
          <Select
            placeholder="Category"
            // defaultValue="All"
            onChange={(value) =>
              setSelectedOption(value === "All" ? null : value)
            }
            style={{
              width: "8vw",
              marginRight: "0vw",
            }}
            className="custom-select"
          >
            <Option value="All">All Categories</Option>
            <Option value="Fruit">Fruit</Option>
            <Option value="Flower">Flower</Option>
            <Option value="Home Decor Plant">Home Decor Plant</Option>
            <Option value="Wood Plant">Wood Plant</Option>
            <Option value="Herb">Herb</Option>
          </Select>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                defaultBg: "#21390e",
                defaultActiveBg: "#21390e",
                defaultHoverBg: "#21390e",
                defaultHoverBorderColor: "#21390e",
                defaultHoverColor: "#deb306",
                defaultBorderColor: "#21390e",
                defaultColor: "#fff",
                defaultActiveBorderColor: "#628753",
                defaultActiveColor: "#fff",
              },
            },
          }}
        >
          <Button
            onClick={handleSearch}
            ref={buttonRef}
            style={{
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
              borderBottomRightRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <SearchOutlined />
          </Button>
        </ConfigProvider>

        {suggestionsVisible && (
          <div
            ref={suggestionBoxRef}
            className="suggestion-box"
            style={{
              position: "absolute",
              top: "100%", // Position it directly below the search bar
              width: suggestionBoxWidth, // Set width dynamically
              zIndex: 99,
              backgroundColor: "#fff",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "1vh 2vw",
              textAlign: "center",
              borderRadius: "8px 8px 8px 8px",
              minHeight: "15vh",
              // display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            {suggestions.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "13vh",
                }}
              >
                <p style={{ color: "#888", margin: 0, textAlign: "center" }}>
                  {searchText.trim() === ""
                    ? "Start typing to see suggestions..."
                    : "No suggestions found"}
                </p>
              </div>
            ) : (
              suggestions.map((product) => (
                <Row
                  key={product._id}
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    alignContent: "center",
                    padding: "10px",
                    backgroundColor: "#f0f8ef",
                    border: "2px",
                    borderRadius: "5px",
                  }}
                >
                  <Col
                    span={24}
                    style={{
                      display: "flex",
                      justifyContent: "left",
                    }}
                  >
                    <Row
                      style={{
                        marginBottom: "1vh",
                        alignItems: "center", // Align items vertically in the middle
                        width: "100%",
                      }}
                    >
                      {/* Image Column */}
                      <Col span={4}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "3vw",
                            height: "6vh",
                            // marginRight: "2vw",
                          }}
                        />
                      </Col>

                      {/* Product Info Column */}
                      <Col span={12}>
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
            )}
          </div>
        )}
      </div>
      {/* User, Wishlist, and Cart Icons */}
      <div
        style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
      >
        <ConfigProvider
          theme={{
            components: {
              Button: {
                defaultBg: "#628753",
                defaultActiveBg: "#628753",
                defaultHoverBg: "#628753",
                defaultHoverBorderColor: "#628753",
                defaultHoverColor: "#deb306",
                defaultBorderColor: "#628753",
                defaultColor: "#fff",
                defaultActiveBorderColor: "#628753",
                defaultActiveColor: "#fff",
              },
            },
          }}
        >
          <Button
            style={{ marginRight: "5%" }}
            onClick={handleProceedToCheckout}
            icon={<UserOutlined style={{ fontSize: "1.7em" }} />}
          />
          <Button
            style={{ marginRight: "8%" }}
            onClick={handleWishlist}
            icon={<HeartOutlined style={{ fontSize: "1.7em" }} />}
          />
          <WishlistDrawer
            wishlistOpen={wishlistOpen}
            setWishlistOpen={setWishlistOpen}
          />
        </ConfigProvider>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                defaultBg: "#21390e",
                defaultActiveBg: "#21390e",
                defaultHoverBg: "#21390e",
                defaultHoverBorderColor: "#21390e",
                defaultHoverColor: "#deb306",
                defaultBorderColor: "#21390e",
                defaultColor: "#fff",
                defaultActiveBorderColor: "#628753",
                defaultActiveColor: "#fff",
              },
            },
          }}
        >
          <Badge count={cartItems.length} showZero>
            <Button icon={<ShoppingCartOutlined />} onClick={showCartModal}>
              ৳ {totalPrice.toFixed(2)}
            </Button>
          </Badge>
        </ConfigProvider>
        <Modal
          title="Update Cart"
          visible={isCartModalOpen}
          onCancel={() => setIsCartModalOpen(false)}
          footer={null}
          width="38vw"
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            overflowY: "auto",
            overflowX: "hidden",
          }}
          bodyStyle={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            maxHeight: "60vh",
            width: "35vw",
            overflowY: "auto",
            overflowX: "hidden",
          }} // Ensure modal content scrolls if necessary
        >
          <div style={{ minHeight: "25vh" }}>
            <CartInfo />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Banner;
