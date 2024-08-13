import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
const { Header, Content, Footer } = Layout;

const UserLayout = () => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar/>
      <Layout>
        <Header style={{ padding: 0, backgroundColor: "#5e9245" }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            <Outlet/>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          VerdantSpace ©{new Date().getFullYear()} Developed by <a style={{color: "#daa611" }} href="https://tonmoytalukder.github.io/">Tonmoy Talukder</a>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
