import { useState, useEffect, useRef } from "react";
import {
  SearchOutlined,
  UserOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Image, Input, Select, Button, ConfigProvider, Badge } from "antd";
import type { InputRef } from 'antd';
import "./Banner.css";

const { Option } = Select;

const Banner = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [suggestionBoxWidth, setSuggestionBoxWidth] = useState(0);
  
  const inputRef = useRef<InputRef | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    console.log("Search Text:", searchText);
    console.log("Selected Option:", selectedOption);
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
      // console.log(inputWidth, ' ', selectWidth, ' ', buttonWidth, ' ', suggestionBoxWidth)
    }
  }, [searchText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setSuggestionsVisible(e.target.value.trim() !== "");

    // Log the search text in real-time
    console.log("Current Search Text:", e.target.value);
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
          alignContent: 'center',
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
        <div
          className="custom-select-container"
          ref={selectRef}
        >
          <Select
            placeholder="Category"
            onChange={(value) => setSelectedOption(value)}
            style={{
              width: "100%",
              marginRight: "0vw",
            }}
            className="custom-select"
          >
            <Option value="Option1">Option 1</Option>
            <Option value="Option2">Option 2</Option>
            <Option value="Option3">Option 3</Option>
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
              minHeight: '15vh',
            }}
          >
            <p style={{ color: "#888", margin: 0 }}>
              {searchText.trim() === ""
                ? "Nothing found"
                : "Suggestions will appear here..."}
            </p>
          </div>
        )}
      </div>
      {/* User, Wishlist, and Cart Icons */}
      <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
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
          <Button style={{ marginRight: "5%" }} icon={<UserOutlined style={{ fontSize: '1.7em' }} />} />
          <Button style={{ marginRight: "8%" }} icon={<HeartOutlined style={{ fontSize: '1.7em' }} />} />
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
          <Badge count={0} showZero>
            <Button icon={<ShoppingCartOutlined />}>৳ 0.00</Button>
          </Badge>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Banner;
