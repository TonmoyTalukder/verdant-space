/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  ConfigProvider,
  Pagination,
  Row,
  Segmented,
  Switch,
} from "antd";
import { RiMenuUnfold4Fill } from "react-icons/ri";
import CategoryDrawer from "../../components/ui/CategoryDrawer";
import ProductCard from "../../components/ui/ProductCard";
import "./AllProducts.css";
import ProductCategories from "../../components/ui/ProductCategories";
import { useGetProductsQuery } from "../../redux/features/products/productsApi";
import { TProduct } from "../../types/productTypes";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

interface TSearchResults {
  success: boolean;
  message: string;
  data: TProduct[];
}

const AllProducts = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [value1, setValue1] = useState<string | number | null>(null);
  const [value2, setValue2] = useState<string | number | null>(null);
  const [value3, setValue3] = useState<string | number | null>(null);
  const [sortProducts, setSortProducts] = useState<boolean>(true);

  const [filteredProducts, setFilteredProducts] = useState<TProduct[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([10, 1500]);
  const [ratingRange, setRatingRange] = useState<number[]>([0, 5]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [onSaleProduct, setOnSaleProduct] = useState<boolean>(false);

  const pageSize = 8;

  // Fetch products data using the useGetProductsQuery hook
  const {
    data: productsData,
    error,
    isLoading,
  } = useGetProductsQuery(undefined);

  // Get search results from Redux state
  // const searchResults = useSelector((state: RootState) => state.products.searchResults) as TSearchResults | null;
  const searchResults = useSelector(
    (state: RootState) => state.products.searchResults
  ) as unknown as TSearchResults | null;

  // Handle screen resize to determine mobile view
  const handleResize = () => {
    setIsMobile(window.innerWidth < 767);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.onSaleFilter && !onSaleProduct) {
      setOnSaleProduct(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [
    location.state?.onSaleFilter,
    onSaleProduct,
    navigate,
    location.pathname,
  ]);

  useEffect(() => {
    if (location.state?.latestFilter && value3 !== "New to Old") {
      setValue3("New to Old");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.latestFilter, value3, navigate, location.pathname]);

  // Handle switch toggle for sorting
  const handleSwitchChange = (checked: boolean) => {
    setSortProducts(checked);
    if (!checked) {
      setValue1(null);
      setValue2(null);
      setValue3(null);
    }
  };

  // Reset all filters to default values
  const resetFilters = () => {
    setPriceRange([10, 1500]);
    setRatingRange([0, 5]);
    setSelectedSeasons([]);
    setSelectedTypes([]);
    setValue1(null);
    setValue2(null);
    setValue3(null);
    setOnSaleProduct(false);
  };

  // Apply filters and sorting on products
  const filterAndSortProducts = (products: TProduct[]): TProduct[] => {
    if (!products || products.length === 0) return [];

    let result = products;

    // Filter by price range
    result = result.filter(
      (product: TProduct) =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    );

    // Filter by rating range
    result = result.filter(
      (product: TProduct) =>
        product.rating >= ratingRange[0] && product.rating <= ratingRange[1],
    );

    // Filter by selected seasons
    if (selectedSeasons.length > 0) {
      result = result.filter((product: TProduct) =>
        selectedSeasons.includes(product.seasonal),
      );
    }

    // Filter by selected types
    if (selectedTypes.length > 0) {
      result = result.filter((product: TProduct) =>
        selectedTypes.includes(product.type),
      );
    }

    // Filter by on sale
    if (onSaleProduct) {
      result = result.filter(
        (product: TProduct) => product.sale.onSale === "yes",
      );
    }

    // Apply sorting
    if (value1 === "Low to High") {
      result.sort(
        (a: { price: number }, b: { price: number }) => a.price - b.price,
      );
    } else if (value1 === "High to Low") {
      result.sort(
        (a: { price: number }, b: { price: number }) => b.price - a.price,
      );
    }

    if (value2 === "A-Z") {
      result.sort((a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name),
      );
    } else if (value2 === "Z-A") {
      result.sort((a: { name: string }, b: { name: string }) =>
        b.name.localeCompare(a.name),
      );
    }

    if (value3 === "New to Old") {
      result.sort(
        (
          a: { updatedAt: string | number | Date },
          b: { updatedAt: string | number | Date },
        ) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    } else if (value3 === "Old to New") {
      result.sort(
        (
          a: { updatedAt: string | number | Date },
          b: { updatedAt: string | number | Date },
        ) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      );
    }

    return result;
  };

  useEffect(() => {
    // If searchResults are available, use them; otherwise, use productsData
    const sourceProducts = searchResults?.data?.length
      ? searchResults.data
      : productsData?.data || [];

    const sortedFilteredProducts = filterAndSortProducts(sourceProducts);

    setFilteredProducts(sortedFilteredProducts);
    setCurrentPage(1);
  }, [
    productsData,
    searchResults,
    priceRange,
    ratingRange,
    selectedSeasons,
    selectedTypes,
    onSaleProduct,
    value1,
    value2,
    value3,
  ]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalProducts = filteredProducts.length;

  return (
    <div>
      <Row
      style={{
        borderRadius: "0px 0px 50px 50px",
        margin: "0vh 0.4vw",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)"
      }}
      >
        {!isMobile && (
          <Col
            style={{
              height: "100vh",
              backgroundColor: "#cfe8cc",
              overflowY: "visible",
              overflowX: "hidden",
              borderRadius: "0px 0px 0px 20px",
            }}
            span={4}
          >
            <div
              style={{
                margin: "4vh 1.5vw",
                border: "2px solid #fff",
                borderRadius: "5px",
              }}
            >
              <ProductCategories
                onChangePrice={setPriceRange}
                onChangeRating={setRatingRange}
                onChangeSeason={setSelectedSeasons}
                onChangeType={setSelectedTypes}
                onChangeOnSale={setOnSaleProduct}
                onResetFilters={resetFilters}
                initialOnSale={onSaleProduct}
              />
            </div>
          </Col>
        )}

        {isMobile && (
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
            <Button onClick={() => setOpen(true)} style={{ margin: "1%" }}>
              <RiMenuUnfold4Fill />
            </Button>
          </ConfigProvider>
        )}

        <CategoryDrawer
          open={open && isMobile}
          setOpen={setOpen}
          isMobile={true}
          onChangePrice={setPriceRange}
          onChangeRating={setRatingRange}
          onChangeSeason={setSelectedSeasons}
          onChangeType={setSelectedTypes}
          onChangeOnSale={setOnSaleProduct}
          onResetFilters={resetFilters}
          initialOnSale={onSaleProduct}
        />

        <Col
          style={{
            height: "100vh",
            width: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            backgroundColor: '#eaf4e5',
            borderRadius: "0px 0px 20px 0px",
          }}
          span={isMobile ? 20 : 20}
          offset={isMobile ? 0 : 0}
        >
          <div style={{ padding: "20px" }}>
            <h1>
              Sort Products{" "}
              <Switch
                className="custom-switch"
                checked={!!sortProducts}
                onChange={handleSwitchChange}
              />
            </h1>
            <br />
            <Row gutter={[16, 16]}>
              <Col span={isMobile ? 2 : 1}>
                <b>Price: </b>
              </Col>
              <Col span={isMobile ? 22 : 23}>
                <Segmented
                  options={["Low to High", "High to Low"]}
                  value={value1}
                  onChange={setValue1}
                  disabled={!sortProducts}
                />
              </Col>

              <Col span={isMobile ? 2 : 1}>
                <b>Name: </b>
              </Col>
              <Col span={isMobile ? 22 : 23}>
                <Segmented
                  options={["A-Z", "Z-A"]}
                  value={value2}
                  onChange={setValue2}
                  disabled={!sortProducts}
                />
              </Col>

              <Col span={isMobile ? 2 : 1}>
                <b>Date: </b>
              </Col>
              <Col span={isMobile ? 22 : 23}>
                <Segmented
                  options={["New to Old", "Old to New"]}
                  value={value3}
                  onChange={setValue3}
                  disabled={!sortProducts}
                />
              </Col>
            </Row>
            <br />

            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error loading products</div>
            ) : paginatedProducts.length > 0 ? (
              <Row gutter={[16, 16]}>
                {paginatedProducts.map((product) => (
                  <Col key={product._id} span={isMobile ? 24 : 6}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div>No products found</div>
            )}
            <br />
            {totalProducts > pageSize && (
              <Pagination
                current={currentPage}
                total={totalProducts}
                pageSize={pageSize}
                onChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AllProducts;
