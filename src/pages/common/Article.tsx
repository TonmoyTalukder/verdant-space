import React from "react";
import { useParams } from "react-router-dom";
import { Card, Typography, Row, Col, Tag, Image, Divider } from "antd";
import { useGetSingleArticleQuery } from "../../redux/features/articles/articlesApi";
import { TagOutlined, UserOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface TContent {
  type: "text" | "image";
  value: string;
  header?: string;
  imageDescription?: string;
}

const Article: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  // Fetch article by ID
  const {
    data: articleData,
    error,
    isLoading,
  } = useGetSingleArticleQuery(articleId);

  // Check if data is available and extract article
  const article = articleData?.data;

  // Detect if it's mobile
  const isMobile = window.innerWidth <= 768;

  console.log(isMobile);

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    return <p>Error loading article.</p>;
  }

  if (!article) return <p>Article not found.</p>;

  // Ensure article.content exists and is an array
  const content = article.content || [];

  return (
    <div
      style={{
        backgroundColor: "#eaf4e5",
        minHeight: "100vh",
        padding: "30px 0",
      }}
    >
      <Row justify="center">
        <Col xs={24} sm={22} md={16} lg={14} xl={12}>
          <Card
            style={{
              margin: "20px",
              padding: "30px",
              backgroundColor: "#fffff3",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            bordered={false}
          >
            <Title level={1} style={{ fontSize: "2.8em", color: "#3a3a3a" }}>
              {article.title}
            </Title>
            <Text
              type="secondary"
              style={{
                fontSize: "1.2em",
                marginBottom: "20px",
                display: "block",
              }}
            >
              Category: {article.productsType || "General"}
            </Text>

            <Divider variant="dotted" style={{ borderColor: "#7cb305" }} />

            <div style={{ marginTop: "20px" }}>
              {content.map((contentItem: TContent, index: number) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  {contentItem.type === "text" ? (
                    <>
                      {contentItem.header && (
                        <Title
                          level={4}
                          style={{ fontSize: "1.8em", color: "#5a5a5a" }}
                        >
                          {contentItem.header}
                        </Title>
                      )}
                      <Paragraph
                        style={{
                          fontSize: "1.2em",
                          textAlign: "justify",
                          color: "#4a4a4a",
                        }}
                      >
                        {contentItem.value}
                      </Paragraph>
                    </>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <Image
                        src={contentItem.value}
                        alt={contentItem.imageDescription || "Image"}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "400px",
                          borderRadius: "8px",
                        }}
                      />
                      {contentItem.imageDescription && (
                        <Text
                          type="secondary"
                          style={{
                            fontSize: "0.9em",
                            display: "block",
                            marginTop: "5px",
                            color: "#666",
                          }}
                        >
                          {contentItem.imageDescription}
                        </Text>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tags Section */}
            {article.tags?.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <TagOutlined style={{ marginRight: "8px", color: "#3a3a3a" }} />
                {article.tags.map((tag: string, index: number) => (
                  <Tag
                    key={index}
                    color="green"
                    style={{
                      fontSize: "1em",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      margin: "4px 0",
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            )}

            {/* Author Section */}
            <div
              style={{
                marginTop: "40px",
                borderTop: "3px solid #f0f0f0",
                paddingTop: "20px",
              }}
            >
              <Row
                align={isMobile ? "top" : "middle"}
                gutter={16}
                style={{
                  flexDirection: isMobile ? "column" : "row",
                  textAlign: isMobile ? "justify" : "justify",
                }}
              >
                <Col
                  span={isMobile ? 24 : 2}
                  style={{
                    textAlign: isMobile ? "left" : "center",
                    marginBottom: isMobile ? "20px" : "0",   
                    marginLeft: isMobile ? "40%" : "0",   
                    // border: '2px solid red',
                  }}
                >
                  <UserOutlined
                    style={{
                      fontSize: "4em",
                      color: "#3a3a3a",
                    }}
                  />
                </Col>
                <Col span={isMobile ? 24 : 22}>
                  <Title
                    level={4}
                    style={{
                      color: "#3a3a3a",
                      display: "flex",
                      alignItems: isMobile ? "center" : "left",
                      justifyContent: isMobile ? "center" : "flex-start",
                    }}
                  >
                    <EditOutlined style={{ marginRight: "10px" }} />
                    {article.authorName}
                  </Title>
                  <Divider
                    style={{
                      margin: "10px 0",
                      borderColor: "#d9d9d9",
                    }}
                  />
                  <Text style={{ color: "#4a4a4a" }}>
                    {article.authorDescription}
                  </Text>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Article;
