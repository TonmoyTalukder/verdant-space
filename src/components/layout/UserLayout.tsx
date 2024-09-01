import { Button, Layout } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
const { Header, Content, Footer } = Layout;
import { IoIosLogOut } from "react-icons/io";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { clearUserRole } from "../../redux/features/users/authSlice";

const UserLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue =
        "Are you sure you want to reload the page? You may lost credentials.";
    };

    // Add the event listener to handle before unload for the entire app
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleLogout = () => {
    dispatch(clearUserRole())
    navigate("/");
  };


  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header
          style={{
            padding: 0,
            backgroundColor: "#628753",
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <div
            style={{
              padding: "0 2vw",
              maxHeight: "8vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
            onClick={handleLogout}
              style={{
                backgroundColor: "transparent",
                border: "1px dashed white",
                color: "white",
                fontSize: "36px",
              }}
            >
              <IoIosLogOut />
            </Button>
          </div>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          VerdantSpace ©{new Date().getFullYear()} Developed by{" "}
          <a
            style={{ color: "#daa611" }}
            href="https://tonmoytalukder.github.io/"
          >
            Tonmoy Talukder
          </a>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
