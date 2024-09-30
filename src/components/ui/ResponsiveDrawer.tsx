import { ConfigProvider, Drawer, Menu, MenuProps } from "antd";
import { NavLink } from "react-router-dom";

interface ResponsiveDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const items: MenuProps["items"] = [
  {
    key: "Home",
    label: <NavLink to="/home"> Home </NavLink>,
  },
  {
    key: "Shop",
    label: <NavLink to="/shop">Shop</NavLink>,
  },
  {
    key: "Supply Us",
    label: <NavLink to="/supply">Supply Us</NavLink>,
  },
  {
    key: "Article",
    label: <NavLink to="/articles">Articles</NavLink>,
  },
  {
    key: "FAQ",
    label: <NavLink to="/faq">FAQ</NavLink>,
  },
];

const ResponsiveDrawer = ({ open, setOpen }: ResponsiveDrawerProps) => {
  const onClose = () => {
    setOpen(false);
  };

  const handleMenuClick = () => {
    setOpen(false); // Close the drawer when any menu item is clicked
  };

  return (
    <Drawer
      placement="left"
      onClose={onClose}
      open={open}
      width="45%" // Set the drawer width to 45% of the screen
      maskClosable={true} // Allows closing the drawer by clicking outside
      styles={{
        header: { display: "none" }, // Use styles.header instead of headerStyle
        body: {
          padding: "0",
          backgroundColor: "#21390e",
          color: "#fff",
        }, // Use styles.body instead of bodyStyle
      }}
    >
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemColor: "#fff",
              itemHoverColor: "#e3e5b5",
              itemSelectedBg: "#98c70e",
              itemSelectedColor: "#21390e",
            },
          },
        }}
      >
        <Menu
          mode="vertical"
          items={items}
          onClick={handleMenuClick}
          style={{
            flex: 1,
            backgroundColor: "#21390e",
            //   color: "#fff",
            borderRight: "none", // Remove the default border
            marginTop: "7vh",
            fontWeight: "900",
          }}
          // Override default Menu item styles
          // theme="dark" // Apply a dark theme to match the drawer background
          inlineIndent={16} // Indent for nested items (if any)
        />
      </ConfigProvider>
    </Drawer>
  );
};

export default ResponsiveDrawer;
