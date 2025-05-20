// 表格组件：包含审核、驳回、删除和恢复等操作
import React, { useState } from "react";
import { Table, Tag, Button, Modal, Input, message, Space, Image } from "antd";
import type { TableProps } from "antd";
import ImageGallery from "react-image-gallery";

interface TravelNote {
  _id: string;
  title: string;
  content: string;
  imgList: string[];
  state: number;
  rejectReason?: string;
  createTime: string;
  author: string;
  // 其他可能的字段
}

interface TravelTableProps {
  data: TravelNote[];
  loading: boolean;
  onDataChange: () => void;
}

const TravelTable: React.FC<TravelTableProps> = ({
  data = [],
  loading,
  onDataChange,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<TravelNote | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImages, setPreviewImages] = useState<
    { original: string; thumbnail: string }[]
  >([]);

  // 根据状态获取对应的标签
  const getStatusTag = (state: number) => {
    switch (state) {
      case 0:
        return <Tag color="warning">待审核</Tag>;
      case 1:
        return <Tag color="success">已通过</Tag>;
      case 2:
        return <Tag color="error">已驳回</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  // 渲染图片列表
  const renderImages = (imgList: string[]) => {
    if (imgList && imgList.length > 0) {
      return (
        <div className="flex overflow-auto">
          {imgList.map((img, index) => (
            <Image
              key={index}
              src={img}
              width={50}
              height={50}
              style={{ objectFit: "cover", marginRight: 8, cursor: "pointer" }}
              preview={false}
              onClick={() => handleImagePreview(imgList)}
            />
          ))}
        </div>
      );
    }
    return "无图片";
  };

  // 处理图片预览
  const handleImagePreview = (imgList: string[]) => {
    const images = imgList.map((img) => ({
      original: img,
      thumbnail: img,
    }));
    setPreviewImages(images);
    setPreviewVisible(true);
  };

  // 审核旅行笔记
  const reviewTravelNote = async (
    _id: string,
    state: number,
    rejectReason: string = ""
  ) => {
    try {
      const response = await fetch("http://localhost:3001/reviewTravelNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id,
          state,
          rejectReason,
        }),
      });

      const result = await response.text();
      if (result === "success") {
        message.success("操作成功");
        onDataChange(); // 刷新数据
      } else {
        message.error("操作失败");
      }
    } catch (error) {
      console.error("审核操作失败", error);
      message.error("操作失败");
    }
  };

  // 处理审核操作
  const handleReview = (row: TravelNote, newState: number) => {
    if (newState === 2) {
      // 驳回时显示对话框输入驳回原因
      setCurrentRow(row);
      setRejectReason("");
      setIsModalVisible(true);
    } else {
      // 通过直接调用审核API
      reviewTravelNote(row._id, newState);
    }
  };

  // 提交驳回原因
  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      message.warning("请输入驳回原因");
      return;
    }
    if (currentRow) {
      reviewTravelNote(currentRow._id, 2, rejectReason);
      setIsModalVisible(false);
    }
  };

  // 表格列定义
  const columns: TableProps<TravelNote>["columns"] = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      width: 150,
      ellipsis: true,
    },
    {
      title: "内容",
      dataIndex: "content",
      key: "content",
      width: 200,
      ellipsis: true,
    },
    {
      title: "图片",
      dataIndex: "imgList",
      key: "imgList",
      width: 150,
      render: renderImages,
    },
    {
      title: "状态",
      dataIndex: "state",
      key: "state",
      width: 100,
      render: getStatusTag,
    },
    {
      title: "驳回原因",
      dataIndex: "rejectReason",
      key: "rejectReason",
      width: 150,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      title: "创建时间",
      dataIndex: "publishTime",
      key: "createTime",
      width: 150,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "作者",
      dataIndex: "userInfo",
      key: "author",
      width: 100,
      render: (userInfo) => userInfo?.username || "-",
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 200,
      render: (_, record) => (
        <Space>
          {record.state === 0 && (
            <>
              <Button type="primary" onClick={() => handleReview(record, 1)}>
                通过
              </Button>
              <Button danger onClick={() => handleReview(record, 2)}>
                驳回
              </Button>
            </>
          )}
          {record.state === 1 && (
            <Button danger onClick={() => handleReview(record, 2)}>
              驳回
            </Button>
          )}
          {record.state === 2 && (
            <Button type="primary" onClick={() => handleReview(record, 1)}>
              通过
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        pagination={false}
        scroll={{ x: 1200 }}
        loading={loading}
      />

      {/* 驳回原因输入对话框 */}
      <Modal
        title="请输入驳回原因"
        open={isModalVisible}
        onOk={handleRejectSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="请输入驳回原因"
        />
      </Modal>

      {/* 图片预览模态框 */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="60%"
      >
        <div style={{ marginTop: 16 }}>
          <ImageGallery
            items={previewImages}
            showPlayButton={false}
            showFullscreenButton={true}
            showNav={true}
          />
        </div>
      </Modal>
    </>
  );
};

export default TravelTable;
