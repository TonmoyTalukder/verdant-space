/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Space,
  notification,
  Tag,
} from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/es/form";
import { useAddArticleMutation } from "../../redux/features/articles/articlesApi";

const { TextArea } = Input;

interface DynamicField {
  type: "text" | "image";
  id: number;
}

export type TArticle = {
  title: string;
  authorName: string;
  authorDescription: string;
  productsType: string;
  content: Array<{
    type: "text" | "image";
    value: string;
    header?: string;
    imageDescription?: string;
  }>;
  tags: string[]; // Added tags field
  isDeleted?: boolean;
};

const CreateArticle: React.FC = () => {
  const [form] = Form.useForm<FormInstance>();
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [addArticle, { isLoading }] = useAddArticleMutation();

  const onFinish = async (values: any) => {
    try {
      const content = values.dynamicFields.map((field: any) => {
        if (field.text) {
          return { type: "text", header: field.header, value: field.text };
        } else if (field.imagePath) {
          return {
            type: "image",
            value: field.imagePath,
            description: field.imageDescription || "",
          };
        }
      });

      const payload: TArticle = {
        title: values.title,
        authorName: values.authorName,
        authorDescription: values.authorDescription,
        productsType: values.productsType,
        content: content,
        tags: tags, // Include tags in the payload
        isDeleted: false,
      };

      await addArticle(payload).unwrap();

      notification.success({
        message: "Success",
        description: "Article posted successfully!",
      });

      form.resetFields();
      setDynamicFields([]);
      setTags([]);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to post article. Please try again!",
      });
    }
  };

  const handleAddTextField = () => {
    setDynamicFields([...dynamicFields, { type: "text", id: Date.now() }]);
  };

  const handleAddImageField = () => {
    setDynamicFields([...dynamicFields, { type: "image", id: Date.now() }]);
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = [...dynamicFields];
    updatedFields.splice(index, 1);
    setDynamicFields(updatedFields);
  };

  const handleClose = (removedTag: string) => {
    const updatedTags = tags.filter((tag) => tag !== removedTag);
    setTags(updatedTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  return (
    <Card
      title="📝 Write A New Article"
      style={{
        maxWidth: 800,
        margin: "auto",
        padding: "20px",
        maxHeight: "68vh",
        overflowY: "scroll",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button
          type="dashed"
          onClick={handleAddTextField}
          icon={<PlusOutlined />}
          style={{ marginRight: "10px" }}
        >
          Add Text Area
        </Button>
        <Button
          type="dashed"
          onClick={handleAddImageField}
          icon={<PlusOutlined />}
        >
          Add Image Path
        </Button>
      </div>

      <div style={{ display: "flex" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{
            flex: 1,
            maxHeight: "70vh",
            paddingRight: "40px",
            paddingBottom: "20px",
          }}
        >
          <Form.Item
            label="Article Title"
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input placeholder="Enter the article title" />
          </Form.Item>

          <Form.Item
            label="Author Name"
            name="authorName"
            rules={[
              { required: true, message: "Please input the author name!" },
            ]}
          >
            <Input placeholder="Enter the author's name" />
          </Form.Item>

          <Form.Item
            label="Author Description"
            name="authorDescription"
            rules={[
              {
                required: true,
                message: "Please input the author description!",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Write a short description of the author"
            />
          </Form.Item>

          <Form.Item
            label="Products Type"
            name="productsType"
            rules={[
              { required: true, message: "Please select the product type!" },
            ]}
          >
            <Select placeholder="Select a product category">
              <Select.Option value="Fruits">Fruits</Select.Option>
              <Select.Option value="Flower">Flower</Select.Option>
              <Select.Option value="Home Decor Plant">
                Home Decor Plant
              </Select.Option>
              <Select.Option value="Wood Plant">Wood Plant</Select.Option>
              <Select.Option value="Herb">Herb</Select.Option>
            </Select>
          </Form.Item>

          {/* Dynamic Fields */}
          <Form.List name="dynamicFields">
            {(_fields, { remove }) => (
              <>
                {dynamicFields.map((field, index) => (
                  <Form.Item
                    key={field.id}
                    label={
                      <Space>
                        {field.type === "text"
                          ? `Text Area ${index + 1}`
                          : `Image Path ${index + 1}`}
                        <CloseOutlined
                          onClick={() => {
                            handleRemoveField(index);
                            remove(index);
                          }}
                          style={{ cursor: "pointer", color: "red" }}
                        />
                      </Space>
                    }
                    style={{ width: "100%" }}
                  >
                    {field.type === "text" ? (
                      <>
                        <Form.Item
                          name={[index, "header"]}
                          label="Header (Optional)"
                          rules={[
                            {
                              required: false,
                              message: "Please enter a header!",
                            },
                          ]}
                        >
                          <Input placeholder="Enter header" />
                        </Form.Item>
                        <Form.Item
                          name={[index, "text"]}
                          rules={[
                            { required: true, message: "Please enter text!" },
                          ]}
                        >
                          <TextArea
                            placeholder="Enter text"
                            rows={4}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </>
                    ) : (
                      <>
                        <Form.Item
                          name={[index, "imagePath"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter image path!",
                            },
                          ]}
                        >
                          <Input placeholder="Enter image path" />
                        </Form.Item>
                        <Form.Item
                          name={[index, "imageDescription"]}
                          style={{ marginTop: "10px" }}
                        >
                          <Input placeholder="Image description (Optional)" />
                        </Form.Item>
                      </>
                    )}
                  </Form.Item>
                ))}
              </>
            )}
          </Form.List>

          {/* Tags Input Field */}
          <Form.Item label="Tags">
            {tags.map((tag) => {
              const isLongTag = tag.length > 20;
              const tagElem = (
                <Tag key={tag} closable onClose={() => handleClose(tag)}>
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </Tag>
              );
              return tagElem;
            })}
            {inputVisible && (
              <Input
                type="text"
                size="small"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
                style={{ width: 100, marginTop: "5px" }}
              />
            )}
            {!inputVisible && (
              <Button
                type="dashed"
                onClick={showInput}
                icon={<PlusOutlined />}
                style={{ marginTop: "5px" }}
              >
                Add Tag
              </Button>
            )}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              style={{ marginTop: "20px" }}
            >
              Submit Article
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default CreateArticle;
