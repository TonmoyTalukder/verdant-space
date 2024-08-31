/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Input,
  Button,
  Table,
  ConfigProvider,
  Popconfirm,
  Modal,
  Form,
  Input as AntdInput,
  Select,
  Space,
  Tag,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  useGetArticlesQuery,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} from "../../redux/features/articles/articlesApi";

const { Option } = Select;
const { TextArea } = AntdInput;

type TContent = {
  type: "text" | "image";
  value: string;
  header?: string;
  imageDescription?: string;
};

type TArticle = {
  title: string;
  authorName: string;
  authorDescription: string;
  productsType: string;
  content: TContent[];
  tags: string[];
  _id: number;
};

const AllArticles = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<TArticle | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dynamicFields, setDynamicFields] = useState<TContent[]>([]);

  // Fetch articles query
  const { data: articlesData, isLoading } = useGetArticlesQuery(undefined);

  // Update and Delete mutation hooks
  const [deleteArticle] = useDeleteArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();

  const handleDelete = async (articleId: string) => {
    try {
      await deleteArticle(articleId).unwrap();
      ("Article deleted successfully!");
    } catch (error) {
      console.error("Failed to delete article: ", error);
    }
  };

  const handleUpdate = async (values: any) => {
    const formattedValues = {
      title: values.title,
      authorName: values.authorName,
      authorDescription: values.authorDescription,
      productsType: values.productsType,
      content: dynamicFields,
      tags: tags,
    };

    try {
      await updateArticle({
        id: selectedArticle?._id,
        body: formattedValues,
      }).unwrap();
      ("Article updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update article: ", error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
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

  const showInput = () => {
    setInputVisible(true);
  };

  const handleClose = (removedTag: string) => {
    setTags(tags.filter((tag) => tag !== removedTag));
  };

  const handleAddField = (type: "text" | "image") => {
    if (type === "text") {
      setDynamicFields([
        ...dynamicFields,
        { type: "text", value: "", header: "" },
      ]);
    } else if (type === "image") {
      setDynamicFields([
        ...dynamicFields,
        { type: "image", value: "", imageDescription: "" },
      ]);
    }
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = [...dynamicFields];
    updatedFields.splice(index, 1);
    setDynamicFields(updatedFields);
  };

  const openModal = (article: TArticle) => {
    setSelectedArticle(article);
    setDynamicFields(article.content || []);
    setTags(article.tags || []);
    setIsModalOpen(true);
    form.setFieldsValue({
      title: article.title,
      authorName: article.authorName,
      authorDescription: article.authorDescription,
      productsType: article.productsType,
      content: article.content,
      tags: article.tags,
    });
  };

  const filteredArticles = articlesData?.data
    .filter((article: any) => {
      const matchesSearchText =
        article.title.toLowerCase().includes(searchText?.toLowerCase() || "") ||
        article.authorName
          .toLowerCase()
          .includes(searchText?.toLowerCase() || "") ||
        article.productsType
          .toLowerCase()
          .includes(searchText?.toLowerCase() || "") ||
        article.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchText?.toLowerCase() || ""),
        );

      return matchesSearchText;
    })
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const handleFieldChange = (
    index: number,
    key: "value" | "header" | "imageDescription",
    value: string,
  ) => {
    const updatedFields = [...dynamicFields];
    updatedFields[index] = {
      ...updatedFields[index],
      [key]: value, // Update the specific key (value, header, imageDescription)
    };
    setDynamicFields(updatedFields);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
    },
    {
      title: "Type",
      dataIndex: "productsType",
      key: "productsType",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Tag key={tag} closable onClose={() => handleClose(tag)}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, article: any) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openModal(article)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this article?"
            onConfirm={() => handleDelete(article._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider renderEmpty={() => <div>No articles found.</div>}>
      <Input
        placeholder="Search by Title, Author, Type, or Tags"
        prefix={<SearchOutlined />}
        value={searchText || ""}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={filteredArticles}
        rowKey="_id"
        loading={isLoading}
        style={{
          maxHeight: "72vh",
          overflow: "auto",
        }}
      />
      <Modal
        title="Edit Article"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Update
          </Button>,
        ]}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
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
              <Option value="Fruits">Fruits</Option>
              <Option value="Flower">Flower</Option>
              <Option value="Home Decor Plant">Home Decor Plant</Option>
              <Option value="Wood Plant">Wood Plant</Option>
              <Option value="Herb">Herb</Option>
            </Select>
          </Form.Item>

          {/* Dynamic Fields */}
          <Form.List name="content">
            {() => (
              <>
                {dynamicFields.map((field, index) => (
                  <Form.Item
                    key={index}
                    label={
                      <Space>
                        Content #{index + 1} ({field.type})
                        <Button
                          type="link"
                          onClick={() => handleRemoveField(index)}
                        >
                          <CloseOutlined />
                        </Button>
                      </Space>
                    }
                  >
                    {field.type === "text" ? (
                      <>
                        <Input
                          placeholder="Enter header (optional)"
                          value={field.header}
                          onChange={(e) =>
                            handleFieldChange(index, "header", e.target.value)
                          }
                        />
                        <TextArea
                          value={field.value}
                          onChange={(e) =>
                            handleFieldChange(index, "value", e.target.value)
                          }
                          placeholder="Enter text content"
                          rows={4}
                        />
                      </>
                    ) : (
                      <>
                        <Input
                          placeholder="Enter image URL"
                          value={field.value}
                          onChange={(e) =>
                            handleFieldChange(index, "value", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Enter image description"
                          value={field.imageDescription}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "imageDescription",
                              e.target.value,
                            )
                          }
                        />
                      </>
                    )}
                  </Form.Item>
                ))}
              </>
            )}
          </Form.List>

          <Space>
            <Button
              type="dashed"
              onClick={() => handleAddField("text")}
              icon={<PlusOutlined />}
            >
              Add Text Content
            </Button>
            <Button
              type="dashed"
              onClick={() => handleAddField("image")}
              icon={<PlusOutlined />}
            >
              Add Image Content
            </Button>
          </Space>

          {/* Tags */}
          <Form.Item label="Tags">
            <Space>
              {tags.map((tag, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleClose(tag)}
                  style={{ marginBottom: 4 }}
                >
                  {tag}
                </Tag>
              ))}
              {inputVisible ? (
                <Input
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              ) : (
                <Button size="small" type="dashed" onClick={showInput}>
                  <PlusOutlined /> New Tag
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default AllArticles;
