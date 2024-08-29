// WishlistDrawer.tsx
import { Drawer, Button, List, Avatar } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { removeFromWishlist } from '../../redux/features/cart/wishlistSlice'; // Import removeFromWishlist

interface wishlistProps {
  wishlistOpen: boolean;
  setWishlistOpen: (wishlistOpen: boolean) => void;
}

const WishlistDrawer = ({ wishlistOpen, setWishlistOpen }: wishlistProps) => {
  const dispatch = useDispatch();

  // Select wishlist items from the Redux store
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const onClose = () => {
    setWishlistOpen(false);
  };

  const handleAddToCart = (item: { productId: string; productName: string; image: string; price: number }) => {
    // Add the item to the cart
    dispatch(addToCart({
      productId: item.productId,
      productName: item.productName,
      image: item.image,
      price: item.price,
      quantity: 1,
    }));

    // Remove the item from the wishlist
    dispatch(removeFromWishlist({ productId: item.productId }));
  };

  return (
    <Drawer title="Wishlist" onClose={onClose} open={wishlistOpen}>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={wishlistItems}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key="add-to-cart"
                  type="primary"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.image} />}
                title={item.productName}
                description={`Price: $${item.price.toFixed(2)}`} // Display the price
              />
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};

export default WishlistDrawer;
