import React from "react";
import { Tag, Button } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./ArticleCard.css"; // Import external CSS file for styles

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
    window.scrollTo(0, 0);
    navigate(`/article/${article._id}`); // Navigate to the Article component with article ID
  };

  return (
    <div className="article-card">
      {imageContent && (
        <div className="image-container">
          <img
            src={imageContent.value}
            alt={imageContent.imageDescription || "Article Image"}
            className="article-image"
          />
        </div>
      )}
      <div className="text-container">
        <h2 className="article-title">{article.title}</h2>
        <h3 className="article-author">{article.authorName}</h3>
        <p className="article-description">{truncatedText}</p>
        <div className="tags-container">
          {article.tags.map((tag) => (
            <Tag key={tag} color="green" className="article-tag">
              {tag}
            </Tag>
          ))}
        </div>
        <Button
          type="primary"
          icon={<ReadOutlined />}
          className="read-more-button"
          onClick={handleReadMoreClick}
        >
          Read More
        </Button>
      </div>
    </div>
  );
};

export default ArticleCard;
