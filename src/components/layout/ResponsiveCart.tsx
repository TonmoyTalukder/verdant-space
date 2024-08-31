import { HeartOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Button, ConfigProvider, Modal } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import CartInfo from "../ui/CartInfo";
import WishlistDrawer from "../ui/WishlistDrawer";
import { useNavigate } from "react-router-dom";

interface CartItem {
  productId: string;
  productName: string;
  image: string;
  quantity: number;
  price: number;
}

const ResponsiveCart = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  const showCartModal = () => {
    setIsCartModalOpen(true);
  };

  // Function to calculate total quantity
  const calculateTotalQuantity = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Recalculate total quantity whenever cartItems changes
  useEffect(() => {
    const totalQty = calculateTotalQuantity(cartItems); // Calculate the total quantity
    setTotalQuantity(totalQty); // Update the state with the new total quantity
  }, [cartItems]); // Dependency on cartItems to update total quantity when items change

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
          <Button style={{marginRight: '5%'}} onClick={handleProceedToCheckout} icon={<UserOutlined />} />
          <Button style={{marginRight: '5%'}} onClick={handleWishlist} icon={<HeartOutlined />} />
          <WishlistDrawer
            wishlistOpen={wishlistOpen}
            setWishlistOpen={setWishlistOpen}
          />
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
          <Badge count={totalQuantity} showZero>
            <Button icon={<ShoppingCartOutlined />} onClick={showCartModal} />
          </Badge>
        </ConfigProvider>

        <Modal
          title="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Update Cart" 
          visible={isCartModalOpen}
          onCancel={() => setIsCartModalOpen(false)}
          footer={null}
          width="100vw"
          style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', overflowY: "scroll", overflowX: 'scroll' }} 
          bodyStyle={{ display: 'flex', justifyContent: 'center', alignContent: 'center', maxHeight: "60vh", width: '100vw', overflowY: "scroll", overflowX: 'scroll' }} // Ensure modal content scrolls if necessary
        >
          <div style={{ minHeight: "25vh" }}>
            <CartInfo 
            />
          </div>
        </Modal>
    </div>
  );
};

export default ResponsiveCart;
