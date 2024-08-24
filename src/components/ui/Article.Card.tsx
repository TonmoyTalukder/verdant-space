import React, { useEffect, useState } from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import styled from 'styled-components';

const { Meta } = Card;

interface SubTitle {
  subcoverImgURL?: string;
  Text: string;
}

interface Article {
  Title: string;
  CoverImageUrl: string;
  SubTitle1: SubTitle[];
  SubTitle2?: SubTitle[];
}

interface ArticleCardProps {
  article: Article;
}

// Styled Card Component
const StyledCard = styled(Card)`
  background-color: #cfe8cc;
  .ant-card-actions {
    background-color: #cfe8cc !important;
  }

  .ant-card-cover img {
    width: 100%;
    height: 20vh; /* Adjust this as needed */
    object-fit: cover;
  }

  width: 16vw; 
  height: 100%; 
  margin: 16px;

  @media (max-width: 1350px) {
    width: 40vw; /* Width for tablets */
  }

  @media (max-width: 768px) { /* Adjust the breakpoint as needed */
    width: 40vw;
  }
`;

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [imageUrl, setImageUrl] = useState<string>("https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png");

  useEffect(() => {
    const checkImage = async (url: string) => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          setImageUrl(url);
        }
      } catch {
        setImageUrl("https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png");
      }
    };

    const imageUrlToCheck = article.SubTitle1[0]?.subcoverImgURL || "";
    if (imageUrlToCheck) {
      checkImage(imageUrlToCheck);
    }
  }, [article.SubTitle1]);

  const getLimitedText = (text: string, limit: number) => {
    if (text.length > limit) {
      return text.slice(0, limit) + '...';
    }
    return text;
  };

  return (
    <StyledCard
      bodyStyle={{ backgroundColor: '#cfe8cc' }}
      cover={
        <img
          alt={article.Title}
          src={imageUrl}
        
        />
      }
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Meta
        avatar={<Avatar src="https://api.dicebear.com/9.x/icons/svg?icon=tree" />}
        title={getLimitedText(article.Title || '', 20)}
        description={getLimitedText(article.SubTitle1[0]?.Text || '', 20)} // Limit to 20 characters
      />
    </StyledCard>
  );
};

export default ArticleCard;
