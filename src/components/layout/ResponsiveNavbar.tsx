import { MenuFoldOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Image } from "antd";
import { useState } from "react";
import ResponsiveDrawer from "../ui/ResponsiveDrawer";
import SearchTab from "../ui/SearchTab";

const ResponsiveNavbar = () => {
  const [open, setOpen] = useState(false);
  const [showSearchTab, setShowSearchTab] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const handleSearch = () => {
    setShowSearchTab(true);
  };

  return (
    <div style={{ border: "0" }}>
      <div
        style={{
          backgroundColor: "#21390e",
          height: "10vh",
          position: "fixed",
          width: "100%",
          top: 0,
          zIndex: 1,
          padding: 0,
          //   border: '1px solid #21390e',
          borderBottom: "1px solid #21390e",
          borderTop: "0px solid #21390e",
          borderRight: "0px solid #21390e",
          borderLeft: "0px solid #21390e",
        }}
      >
        <div
          style={{
            marginRight: "3.5vw",
            marginLeft: "3.5vw",
            backgroundColor: "#628753",
            height: "9.7vh",
            display: "flex",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ alignContent: "center" }}>
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
                onClick={showDrawer}
                style={{
                  borderTopLeftRadius: "0px",
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "0px",
                  borderTopRightRadius: "0px",
                }}
              >
                <MenuFoldOutlined style={{ fontSize: "24px", color: "#fff" }} />
              </Button>
            </ConfigProvider>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <Image
              src="/VerdantSpace Banner.png" // Replace with your image URL
              preview={false}
              style={{
                width: "auto", // The actual width of the image
                height: "9vh", // Maintain aspect ratio
                objectFit: "cover", // Ensures the image fills the container
              }}
            />
          </div>
          <div style={{ alignContent: "center" }}>
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
                onClick={handleSearch}
                style={{
                  borderTopLeftRadius: "0px",
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "0px",
                  borderTopRightRadius: "0px",
                }}
              >
                <SearchOutlined />
              </Button>
            </ConfigProvider>
          </div>
        </div>
        <ResponsiveDrawer open={open} setOpen={setOpen} />
      </div>

      {/* Add a spacer div or margin to push content below the navbar */}
      <div style={{ height: "8vh" }} />

      {/* Conditionally render the SearchTab */}
      {showSearchTab && <SearchTab setShowSearchTab={setShowSearchTab} />}
    </div>
  );
};

export default ResponsiveNavbar;
