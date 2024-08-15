import { useState } from "react";
import {
  SearchOutlined,
  UserOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Image, Input, Select, Button, ConfigProvider, Badge } from "antd";
import "./Banner.css";

const { Option } = Select;

const Banner = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSearch = () => {
    console.log("Search Text:", searchText);
    console.log("Selected Option:", selectedOption);
  };

  return (
    <div
      style={{
        backgroundColor: "#628753",
        height: "15vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // Ensure space between elements
        padding: "0 2%",
      }}
    >
      <div
        style={{
          width: "15%", // Set the width for the cropped area
          overflow: "hidden", // Hide overflow to crop the image
        }}
      >
        <Image
          src="/VerdantSpace Banner.png" // Replace with your image URL
          preview={false}
          style={{
            width: "15vw", // The actual width of the image
            height: "auto", // Maintain aspect ratio
            objectFit: "cover", // Ensures the image fills the container
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
        }}
      >
        <Input
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="custom-input"
          style={{
            width: "25vw",
            marginRight: "0vw",
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "0px",
            borderTopRightRadius: "0px",
          }} // Adjust width and margin as needed
        />
        <div className="custom-select-container">
          <Select
            placeholder="Category"
            onChange={(value) => setSelectedOption(value)}
            style={{
              width: "7vw",
              marginRight: "0vw",
            }} // Adjust width and margin as needed
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
          <Button style={{marginRight: '5%'}} icon={<UserOutlined />} />
          <Button style={{marginRight: '5%'}} icon={<HeartOutlined />} />
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
            <Button icon={<ShoppingCartOutlined />}>
              ৳ 0.00
            </Button>
          </Badge>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Banner;
