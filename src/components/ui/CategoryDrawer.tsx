import { Drawer } from "antd";
import ProductCategories from "./ProductCategories";

interface ResponsiveDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  onChangePrice: (range: number[]) => void;
  onChangeRating: (range: number[]) => void;
  onChangeSeason: (checked: string[]) => void;
  onChangeType: (checked: string[]) => void;
  onChangeOnSale: (checked: boolean) => void;
  initialOnSale: boolean;
  onResetFilters: () => void; // Add this line
}

const CategoryDrawer = ({
  isMobile,
  open,
  setOpen,
  onChangePrice,
  onChangeRating,
  onChangeSeason,
  onChangeType,
  onChangeOnSale,
  initialOnSale,
  onResetFilters,
}: ResponsiveDrawerProps) => {
  const onClose = () => {
    setOpen(false);
  };

  if (!isMobile) {
    return null; // Don't render anything if it's not mobile
  }

  return (
    <Drawer
      placement="left"
      onClose={onClose}
      open={open}
      width="40%" // Set the drawer width to 40% of the screen
      maskClosable={true} // Allows closing the drawer by clicking outside
      // headerStyle={{ display: "none" }} // Remove the header (title and close button)
      // bodyStyle={{
      //   padding: "0",
      //   backgroundColor: "#cfe8cc",
      //   color: "black",
      // }} // Style the drawer body
    >
      <div style={{ margin: '10vh 2vw', border: '2px solid #fff', borderRadius: '5px', overflowY: 'visible', overflowX: 'hidden' }}>
        <ProductCategories
          onChangePrice={onChangePrice}
          onChangeRating={onChangeRating}
          onChangeSeason={onChangeSeason}
          onChangeType={onChangeType}
          onChangeOnSale={onChangeOnSale}
          initialOnSale={initialOnSale} 
          onResetFilters={onResetFilters} // Pass the reset function
        />
      </div>
    </Drawer>
  );
};

export default CategoryDrawer;
