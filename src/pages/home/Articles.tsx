import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Pagination,
  Spin,
  Alert,
  Button,
  Segmented,
  Drawer,
  Checkbox,
} from "antd";
import ArticleCard from "../../components/ui/ArticleCard";
import { useGetArticlesQuery } from "../../redux/features/articles/articlesApi";
import { RiMenuUnfold4Fill } from "react-icons/ri";

const { Group: CheckboxGroup } = Checkbox;

const Articles: React.FC = () => {
  const { data, isLoading, error } = useGetArticlesQuery(undefined);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // Sorting state
  const [sortOrder, setSortOrder] = useState<string | null>(null);

  // Filtering state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Drawer state
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Screen size detection
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sorting change
  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Handle filtering change
  const handleCategoryChange = (checkedValues: string[]) => {
    setSelectedCategories(checkedValues);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Get articles data
  const articles = data?.data || [];
  const totalArticles = articles.length;

  // Apply sorting
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortOrder === "Newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === "Oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  // Apply filtering
  const filteredArticles = sortedArticles.filter((article) => {
    if (selectedCategories.length > 0) {
      return selectedCategories.includes(article.productsType);
    }
    return true;
  });

  // Slice data for current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  return (
    <div
      style={{
        overflowX: "hidden",
        backgroundColor: "#eaf4e5", // Light green background
        maxHeight: "90vh",
      }}
    >
      <Row gutter={[16, 16]} wrap={false} style={{ height: "90vh" }}>
        {/* Filter Column for larger screens */}
        {!isMobile && (
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={4}
            style={{ borderRight: "2px solid #628753" }}
          >
            <div style={{ margin: "4vh 2vw" }}>
              <h3>Sort By</h3>
              <Segmented
                style={{ marginTop: "2vh" }}
                options={["Newest", "Oldest"]}
                value={sortOrder || undefined}
                onChange={handleSortChange}
              />

              <h3 style={{ marginTop: "4vh" }}>Filter By Type</h3>
              <CheckboxGroup
                style={{ width: "100%", marginTop: "2vh" }}
                onChange={handleCategoryChange}
                value={selectedCategories} // Controlled value
              >
                <Row>
                  <Col span={24}>
                    <Checkbox style={{ marginLeft: "1vw" }} value="Fruits">
                      Fruits
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox style={{ marginLeft: "1vw" }} value="Flower">
                      Flower
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      style={{ marginLeft: "1vw" }}
                      value="Home Decor Plant"
                    >
                      Home Decor Plant
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox style={{ marginLeft: "1vw" }} value="Wood Plant">
                      Wood Plant
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox style={{ marginLeft: "1vw" }} value="Herb">
                      Herb
                    </Checkbox>
                  </Col>
                </Row>
              </CheckboxGroup>
            </div>
          </Col>
        )}

        {isMobile && (
          <Col
            xs={2}
            sm={2}
            md={2}
            lg={2}
          >
            <Button
              // type="primary"
              onClick={() => setDrawerVisible(true)}
              style={{
                backgroundColor: "#628753",
                color: "white",
                margin: "3vh 1vw",
              }}
            >
              <RiMenuUnfold4Fill />
            </Button>

            <Drawer
              title="Filters"
              placement="left"
              onClose={() => setDrawerVisible(false)}
              visible={drawerVisible}
              width={300}
            >
              <div style={styles.filters}>
                <h3>Sort By</h3>
                <Segmented
                  options={["Newest", "Oldest"]}
                  value={sortOrder || undefined}
                  onChange={handleSortChange}
                />

                <h3>Filter By Type</h3>
                <CheckboxGroup
                  style={{ width: "100%" }}
                  onChange={handleCategoryChange}
                  value={selectedCategories} // Controlled value
                >
                  <Row>
                    <Col span={24}>
                      <Checkbox style={{ marginLeft: "1vw" }} value="Fruits">
                        Fruits
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox style={{ marginLeft: "1vw" }} value="Flower">
                        Flower
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox
                        style={{ marginLeft: "1vw" }}
                        value="Home Decor Plant"
                      >
                        Home Decor Plant
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox
                        style={{ marginLeft: "1vw" }}
                        value="Wood Plant"
                      >
                        Wood Plant
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox style={{ marginLeft: "1vw" }} value="Herb">
                        Herb
                      </Checkbox>
                    </Col>
                  </Row>
                </CheckboxGroup>
              </div>
            </Drawer>
          </Col>
        )}

        {/* Main Article Column */}
        <Col
          xs={20}
          sm={20}
          md={20}
          lg={isMobile ? 20 : 20}
          style={styles.mainColumn}
        >
          {isLoading ? (
            <Spin size="large" />
          ) : error ? (
            <Alert message="Error fetching articles" type="error" />
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {paginatedArticles.length > 0 ? (
                  paginatedArticles.map((article) => (
                    <Col key={article._id} xs={24} sm={12} lg={12}>
                      <ArticleCard article={article} />
                    </Col>
                  ))
                ) : (
                  <Col span={24}>
                    <Alert message="No articles found" type="info" />
                  </Col>
                )}
              </Row>
              {totalArticles > pageSize && (
                <Pagination
                  current={currentPage}
                  total={totalArticles}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  className="custom-pagination"
                />
              )}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

// Define CSS properties explicitly
const styles: {
  container: React.CSSProperties;
  filterColumn: React.CSSProperties;
  mainColumn: React.CSSProperties;
  filters: React.CSSProperties;
  drawerButton: React.CSSProperties;
} = {
  container: {
    // padding: "20px",
    backgroundColor: "#eaf4e5", // Light green background
    minHeight: "100vh",
    width: "100vw",
  },
  filterColumn: {
    backgroundColor: "#ffffff",
    // padding: "20px",
    borderRight: "1px solid #ddd",
    height: "100vh",
    overflowY: "auto",
  },
  mainColumn: {
    // padding: "20px",
  },
  filters: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  drawerButton: {
    position: "fixed",
    top: "20px",
    left: "20px",
    zIndex: 1000,
  },
};

export default Articles;
