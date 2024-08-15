import { HeartOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Button, ConfigProvider } from "antd";

const ResponsiveCart = () => {
  return (
    <div
      style={{
        backgroundColor: "#21390e",
        margin: 0, // Ensure no margin
        marginTop: 12,
        padding: "2.5vh 4vh", // Add padding for spacing within the component
        border: "none", // Ensure no border
        borderTop: "0px", // Remove top border if it exists
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // border: '1px solid red',
      }}
    >
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
                defaultActiveBorderColor: "#21390e",
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
          <Badge count={0} showZero>
            <Button icon={<ShoppingCartOutlined />}/>
          </Badge>
        </ConfigProvider>
    </div>
  );
};

export default ResponsiveCart;
