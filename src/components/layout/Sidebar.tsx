import { ConfigProvider, Layout, Menu } from "antd";
import { sidebarItemsGenerator } from "../../utils/sidebarItemsGenerator";
import { adminPaths } from "../../routes/admin.routes";
import { userPaths } from "../../routes/user.routes";
import { NavLink } from "react-router-dom";
const { Sider } = Layout;

const userRole = {
  ADMIN : "admin",
  USER : "user",
}

const Sidebar = () => {

  const role = 'admin';
  let sidebarItems;

  switch (role) {
    case userRole.ADMIN:
      sidebarItems = sidebarItemsGenerator(adminPaths, userRole.ADMIN);
      break;
  
    case userRole.USER:
      sidebarItems = sidebarItemsGenerator(userPaths, userRole.USER);
      break;

    default:
      break;
  }
  return (
    <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{ color: "white", backgroundColor: "#628753" }}
      >
        <div
          style={{
            color: "white",
            textAlign: "center",
            height: "4rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <NavLink to="/" style={{color: "white"}}>
          <h1>VerdantSpace</h1>
          </NavLink>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemColor: '#ffff',
                itemSelectedColor: '#daa611 ',
              },
            },
          }}
        >
          <Menu
            style={{ backgroundColor: "#628753" }}
            mode="inline"
            // defaultSelectedKeys={["4"]}
            items={sidebarItems}
          />
        </ConfigProvider>
      </Sider>
  );
};

export default Sidebar;
