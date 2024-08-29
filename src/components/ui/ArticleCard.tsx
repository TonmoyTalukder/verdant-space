import React from "react";
import { Tag, Button } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

// Define types for the content and article
interface TContent {
  type: "text" | "image";
  value: string;
  header?: string;
  imageDescription?: string;
}

interface TArticle {
  title: string;
  authorName: string;
  authorDescription: string;
  productsType: string;
  content: TContent[];
  tags: string[];
  _id: number;
}

// Props for the ArticleCard component
interface ArticleCardProps {
  article: TArticle;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  // Get the first image and first text content
  const imageContent = article.content.find((c) => c.type === "image");
  const textContent = article.content.find((c) => c.type === "text");

  // Safely handle textContent for display
  const truncatedText = textContent
    ? textContent.value.length > 150
      ? `${textContent.value.substring(0, 150)}...`
      : textContent.value
    : "";

  const handleReadMoreClick = () => {
    navigate(`/article/${article._id}`); // Navigate to the Article component with article ID
  };

  return (
    <div style={styles.card}>
      {imageContent && (
        <div style={styles.imageContainer}>
          <img
            src={imageContent.value}
            alt={imageContent.imageDescription || "Article Image"}
            style={styles.image}
          />
        </div>
      )}
      <div style={styles.textContainer}>
        <h2 style={styles.title}>{article.title}</h2>
        <h3 style={styles.author}>{article.authorName}</h3>
        <p style={styles.description}>{truncatedText}</p>
        <div style={styles.tagsContainer}>
          {article.tags.map((tag) => (
            <Tag key={tag} color="green" style={styles.tag}>
              {tag}
            </Tag>
          ))}
        </div>
        <Button
          type="primary"
          icon={<ReadOutlined />}
          style={styles.readMoreButton}
          onClick={handleReadMoreClick}
        >
          Read More
        </Button>
      </div>
    </div>
  );
};

// Define CSS properties explicitly
const styles: {
  card: React.CSSProperties;
  imageContainer: React.CSSProperties;
  image: React.CSSProperties;
  textContainer: React.CSSProperties;
  title: React.CSSProperties;
  author: React.CSSProperties;
  description: React.CSSProperties;
  tagsContainer: React.CSSProperties;
  tag: React.CSSProperties;
  readMoreButton: React.CSSProperties;
} = {
  card: {
    display: "flex",
    width: "80%",
    maxWidth: "800px",
    margin: "20px auto",
    border: "1px solid #ddd",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
    backgroundColor: "#f5f9f4", // Light green background
    background: "linear-gradient(135deg, #e0f2e9, #ffffff)", // Green to white gradient
  },
  imageContainer: {
    flexShrink: 0,
    width: "40%",
    height: "300px", // Set a fixed height
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  textContainer: {
    padding: "20px",
    width: "60%",
    backgroundColor: "#eaf4e5", // Slightly darker green for contrast
  },
  title: {
    fontSize: "2.5em",
    margin: "0 0 10px 0",
    fontWeight: "bold",
    color: "#21390e", // Darker green color for text
  },
  author: {
    fontSize: "1.2em",
    color: "#628753", // Medium green color
    margin: "5px 0",
  },
  description: {
    fontSize: "1em",
    color: "#555",
    marginBottom: "15px",
  },
  tagsContainer: {
    marginBottom: "15px",
  },
  tag: {
    marginRight: "5px",
    fontSize: "0.9em",
    color: "#628753", // Light green tag background
  },
  readMoreButton: {
    marginTop: "10px",
    fontSize: "1em",
    borderRadius: "8px",
    backgroundColor: "#628753", // Dark green button
    borderColor: "#628753",
  },
};

export default ArticleCard;
