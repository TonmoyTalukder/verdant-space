import React from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, Card, theme } from "antd";
import type { CSSProperties } from "react";
import type { CollapseProps } from "antd";

// Questions and answers for the FAQ
const faqData = [
  {
    key: "1",
    question: "What types of plants can I buy on VerdantSpace?",
    answer:
      "VerdantSpace offers a diverse selection of plants to suit various needs and preferences. You can find flowering plants that add vibrant colors to your space, fruit plants that bring fresh produce right to your home, and home decor plants that enhance the aesthetic appeal of your living environment. Additionally, we offer herbs for culinary and medicinal purposes, as well as wood plants that provide a rustic charm. We are also excited to expand our offerings to include seeds in the near future, allowing you to start your own garden from scratch.",
  },
  {
    key: "2",
    question: "How do I take care of my plants after purchase?",
    answer:
      "Taking care of your plants properly is crucial for their growth and longevity. Each plant species has specific needs, but general care includes providing the right amount of water, ensuring adequate sunlight, and using appropriate soil and fertilizers. On our website, we provide detailed guides and articles from experts, including information on creating the ideal growing conditions, recognizing and treating common plant diseases, and seasonal care tips. Regularly checking these resources will help you maintain healthy and thriving plants.",
  },
  {
    key: "3",
    question: "Can I supply plants to VerdantSpace?",
    answer:
      "Yes, VerdantSpace welcomes plant suppliers who are interested in contributing to our diverse plant catalog. If you have high-quality plants and wish to become a supplier, you can submit your product details through our 'Supply Products' form. We review all submissions carefully to ensure that they meet our quality standards and align with our product range. Once reviewed, our team will contact you for further steps. We value our suppliers and strive to create mutually beneficial partnerships.",
  },
  {
    key: "4",
    question: "What are the benefits of having indoor plants?",
    answer:
      "Indoor plants offer numerous benefits beyond their aesthetic appeal. They help purify the air by filtering out toxins and releasing oxygen, which can improve indoor air quality. Plants also contribute to a reduction in stress and anxiety, creating a calming atmosphere. They can enhance productivity and focus, making them ideal for home offices or study areas. Additionally, indoor plants can add a touch of nature to your living space, which can be particularly beneficial in urban environments where green spaces are limited.",
  },
  {
    key: "5",
    question: "Do you sell seeds?",
    answer:
      "At present, our focus is on providing a wide range of live plants. However, we recognize the growing interest in seeds for those who wish to start their own plants from scratch. We are actively working on expanding our inventory to include a selection of seeds, which will be available soon. Please keep an eye on our website and subscribe to our newsletter for updates on new product launches and availability.",
  },
  {
    key: "6",
    question: "How can I read articles from specialists?",
    answer:
      "VerdantSpace features a variety of articles written by specialists and renowned agriculturists in our 'Articles' section. These articles cover a broad range of topics, including detailed care instructions for different plant species, the benefits of various plants, and tips on improving your gardening skills. To access these articles, simply navigate to the 'Articles' section on our website. We continuously update this section to provide fresh and valuable insights from experts in the field.",
  },
  {
    key: "7",
    question: "What is the best way to water indoor plants?",
    answer:
      "The best watering practices for indoor plants can vary depending on the plant species and its specific needs. Generally, it is advisable to water plants when the top inch of soil feels dry to the touch. Overwatering is a common mistake that can lead to root rot and other issues, so ensure that your pots have proper drainage. It's also helpful to understand each plant's unique requirements, such as how often it needs water and whether it prefers high or low humidity. Adjust your watering routine based on these factors for optimal plant health.",
  },
  {
    key: "8",
    question: "Can I find eco-friendly plant options on VerdantSpace?",
    answer:
      "Yes, VerdantSpace is committed to offering eco-friendly plant options. We prioritize plants that are grown using sustainable practices and aim to provide products that contribute positively to the environment. Many of our plants are chosen for their air-purifying qualities and minimal impact on natural resources. We also strive to work with suppliers who share our commitment to environmental responsibility. For more information about our eco-friendly options, please refer to the product descriptions on our website.",
  },
  {
    key: "9",
    question: "What should I do if my plant is not thriving?",
    answer:
      "If your plant is not thriving, there are several factors to consider. Start by checking the plant's environment, including light levels, water, and soil conditions. Look for signs of common problems such as pest infestations, nutrient deficiencies, or diseases. Our website offers a range of troubleshooting guides and care tips to help you diagnose and address these issues. If you’re still unsure, you can reach out to our customer support team for personalized advice and assistance.",
  },
  {
    key: "10",
    question: "Are there any discounts or promotions available?",
    answer:
      "VerdantSpace frequently offers discounts and promotions to provide added value to our customers. These can include seasonal sales, special offers, and exclusive discounts for newsletter subscribers. To stay updated on the latest promotions, we recommend subscribing to our newsletter and following our social media channels. We also update our website with current deals, so be sure to check regularly for any new offers.",
  },
];

// Get collapse items
const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (panelStyle) =>
  faqData.map((item) => ({
    key: item.key,
    label: item.question,
    children: <p>{item.answer}</p>,
    style: panelStyle,
  }));

const FrequentlyAskedQuestions: React.FC = () => {
  const { token } = theme.useToken();

  // Custom panel styles
  const panelStyle: CSSProperties = {
    marginBottom: 24,
    background: "#eaf4e5", // Theme color for the FAQ panel
    borderRadius: token.borderRadiusLG,
    border: "none",
    borderBottom: "1px solid #dcdcdc", // Horizontal line between questions
  };

  return (
    <div style={{ padding: "20px" }}>
      <Card
        title="Frequently Asked Questions"
        bordered={false}
        style={{
          backgroundColor: "#fffff3", // Card theme color
          maxWidth: "800px", // Maximum width for better readability
          margin: "20px auto", // Centering the card
        }}
      >
        <Collapse
          bordered={false}
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          style={{ background: "#eaf4e5" }} // Background color for the collapse container
          items={getItems(panelStyle)}
        />
      </Card>
    </div>
  );
};

export default FrequentlyAskedQuestions;
