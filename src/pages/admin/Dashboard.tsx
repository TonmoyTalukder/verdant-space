import React, { useEffect, useRef } from "react";
import { useGetProductsQuery } from "../../redux/features/products/productsApi";
import { Row, Col, Card, Spin, Typography } from "antd";
import "./Dashboard.css"; // Import custom CSS

// Types
interface Product {
  type: string;
}

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    data: productsData,
    error,
    isLoading,
  } = useGetProductsQuery(undefined);

  useEffect(() => {
    if (productsData?.data && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Aggregate product data by category
        const categoryCounts: { [key: string]: number } = {};

        productsData.data.forEach((product: Product) => {
          const category = product.type;
          if (category in categoryCounts) {
            categoryCounts[category] += 1;
          } else {
            categoryCounts[category] = 1;
          }
        });

        // Total number of products
        const total = Object.values(categoryCounts).reduce(
          (sum, value) => sum + value,
          0
        );

        // Define colors for the chart
        const colors = [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ];
        let startAngle = 0;
        let colorIndex = 0;

        // Clear canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw pie chart
        Object.entries(categoryCounts).forEach(([label, count]) => {
          const sliceAngle = (count / total) * 2 * Math.PI;

          // Draw Pie Slice
          ctx.beginPath();
          ctx.moveTo(150, 150); // Move to center of canvas
          ctx.arc(150, 150, 150, startAngle, startAngle + sliceAngle); // Create arc
          ctx.closePath();
          ctx.fillStyle = colors[colorIndex % colors.length];
          ctx.fill();

          // Draw Labels
          const middleAngle = startAngle + sliceAngle / 2;
          const labelX = 150 + 100 * Math.cos(middleAngle);
          const labelY = 150 + 100 * Math.sin(middleAngle);
          ctx.fillStyle = "#000";
          ctx.font = "bold 12px Arial";
          ctx.fillText(`${label} (${count})`, labelX, labelY);

          // Update start angle for next slice
          startAngle += sliceAngle;
          colorIndex += 1;
        });
      }
    }
  }, [productsData]);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading products</div>;
  }

  return (
    <Row justify="center" style={{ marginTop: "50px" }}>
      <Col xs={24} sm={16} md={12} lg={10} xl={8}>
        <Card className="dashboard-card">
          <Title level={4} className="dashboard-title">
            Products Available in Stock by Category
          </Title>
          <canvas
            ref={canvasRef}
            width="300"
            height="300"
            className="dashboard-canvas"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;
