import React from "react";
import { useGetProductsQuery } from "../../redux/features/products/productsApi";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import CanvasJSReact from "@canvasjs/react-charts";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Dashboard: React.FC = () => {
  const {
    data: productsData,
    error,
    isLoading,
  } = useGetProductsQuery(undefined);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products</div>;
  }

  // Aggregate product data by category
  const categoryCounts: { [key: string]: number } = {};
  if (productsData?.data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    productsData.data.forEach((product: { type: any }) => {
      const category = product.type;
      if (category in categoryCounts) {
        categoryCounts[category] += 1;
      } else {
        categoryCounts[category] = 1;
      }
    });
  }

  // Convert aggregated data to format required by CanvasJS
  const dataPoints = Object.entries(categoryCounts).map(([label, y]) => ({
    label,
    y,
  }));

  // Chart options
  const options = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "Products available in stock",
    },
    data: [
      {
        type: "pie",
        startAngle: 75,
        toolTipContent: "<b>{label}</b>: {y} Products",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y} Products",
        dataPoints,
      },
    ],
  };

  return (
    <div style={{ width: "100%" }}>
      {/* <h1>Product Categories Dashboard</h1> */}
      <CanvasJSChart options={options} />
    </div>
  );
};

export default Dashboard;
