import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  Row,
  Slider,
  Switch,
} from "antd";
import { useContext, useEffect, useState } from "react";
import "./ProductCategories.css"; // Import the CSS file
import { UndoOutlined } from "@ant-design/icons";
import { getLinearGradientButtonStyle } from "./GradientButtonStyles";

interface ProductCategoriesProps {
  onChangePrice: (range: number[]) => void;
  onChangeRating: (range: number[]) => void;
  onChangeSeason: (checked: string[]) => void;
  onChangeType: (checked: string[]) => void;
  onChangeOnSale: (checked: boolean) => void;
  onResetFilters: () => void; // Added this prop
  initialOnSale: boolean;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
  onChangePrice,
  onChangeRating,
  onChangeSeason,
  onChangeType,
  onChangeOnSale,
  initialOnSale,
  // onResetFilters, // Destructure this prop
}) => {
  const defaultPriceRange = [10, 1500];
  const defaultRatingRange = [0, 5];

  const [switchOn, setSwitchOn] = useState<boolean>(false);

  const [priceRange, setPriceRange] = useState<number[]>(defaultPriceRange);
  const [ratingRange, setRatingRange] = useState<number[]>(defaultRatingRange);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [onSale, setOnSale] = useState<boolean>();

  // Handler for the Switch
  const handleSwitchChange = (checked: boolean) => {
    setSwitchOn(checked);

    setOnSale(checked);
    onChangeOnSale(checked);

    if (checked) {
      // Reset all Segmented states when switch is turned off
      ("On Sale");
    }
  };

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const linearGradientButton = getLinearGradientButtonStyle(rootPrefixCls);

  const handlePriceChange = (newValue: number[]) => {
    setPriceRange(newValue);
    onChangePrice(newValue);
  };

  const handleRatingChange = (newValue: number[]) => {
    setRatingRange(newValue);
    onChangeRating(newValue);
  };

  const handleSeasonChange = (checkedValues: string[]) => {
    setSelectedSeasons(checkedValues);
    onChangeSeason(checkedValues);
  };

  const handleTypeChange = (checkedValues: string[]) => {
    setSelectedTypes(checkedValues);
    onChangeType(checkedValues);
  };

  const resetFilters = () => {
    // Reset states to default values
    setPriceRange(defaultPriceRange);
    setRatingRange(defaultRatingRange);
    setSelectedSeasons([]);
    setSelectedTypes([]);
    setOnSale(false);

    // Notify parent component to reset filters
    onChangePrice(defaultPriceRange);
    onChangeRating(defaultRatingRange);
    onChangeSeason([]);
    onChangeType([]);
    onChangeOnSale(false);
  };

  useEffect(() => {
    if (initialOnSale === true) {
      setSwitchOn(true);
    }
    setOnSale(initialOnSale);
  }, [initialOnSale]);

  return (
    <div style={{ padding: "1vw" }}>
      <h2>Price Range</h2> <br />
      <ConfigProvider
        theme={{
          components: {
            Slider: {
              trackBg: "#628753",
              trackHoverBg: "#628753",
              handleColor: "#628753",
              handleActiveColor: "#628753",
            },
          },
        }}
      >
        <div>
          <Slider
            className="custom-slider"
            range
            value={priceRange} // Controlled value
            min={10}
            max={1500}
            onChange={handlePriceChange}
            // `defaultValue` is not needed here for controlled components
          />{" "}
        </div>
        <div>
          <h4>
            ৳ {priceRange[0]} - {priceRange[1]}
          </h4>
        </div>
      </ConfigProvider>{" "}
      <br />
      <br />
      <h2>Rating Range</h2> <br />
      <ConfigProvider
        theme={{
          components: {
            Slider: {
              trackBg: "#628753",
              trackHoverBg: "#628753",
              handleColor: "#628753",
              handleActiveColor: "#628753",
            },
          },
        }}
      >
        <Slider
          className="custom-slider"
          range
          value={ratingRange} // Controlled value
          min={0}
          max={5}
          onChange={handleRatingChange}
          // `defaultValue` is not needed here for controlled components
        />
        <h4>
          ✰ {ratingRange[0]} - {ratingRange[1]}
        </h4>
      </ConfigProvider>{" "}
      <br />
      <br />
      <div>
        <h2>Seasonal</h2>
        <br />
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={handleSeasonChange}
          value={selectedSeasons} // Controlled value
        >
          <Row>
            <Col span={24}>
              <Checkbox style={{ marginLeft: "1vw" }} value="Summer">
                Summer
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox style={{ marginLeft: "1vw" }} value="Winter">
                Winter
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox style={{ marginLeft: "1vw" }} value="Spring">
                Spring
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox style={{ marginLeft: "1vw" }} value="Fall">
                Fall
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox style={{ marginLeft: "1vw" }} value="All Seasons">
                All Seasons
              </Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </div>
      <br />
      <br />
      <div>
        <h2>Types</h2>
        <br />
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={handleTypeChange}
          value={selectedTypes} // Controlled value
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
              <Checkbox style={{ marginLeft: "1vw" }} value="Home Decor Plant">
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
        </Checkbox.Group>
      </div>
      <div
        style={{
          margin: "2.5vh 0vw",
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
        }}
      >
        <h3>On Sale</h3>&nbsp;&nbsp;&nbsp;
        <Switch
          className="custom-switch"
          checked={!!switchOn}
          onChange={handleSwitchChange}
          value={onSale}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ConfigProvider
          button={{
            className: linearGradientButton,
          }}
        >
          <Button
            style={{ marginTop: "2vh" }}
            type="primary"
            size="large"
            icon={<UndoOutlined />}
            onClick={resetFilters} // Call the reset function
          >
            Reset Filter
          </Button>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default ProductCategories;
