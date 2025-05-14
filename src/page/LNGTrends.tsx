// 展示游记数据、搜索功能、分页功能
import React, { useState, useEffect } from "react";
import { Card, Input, Pagination, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import TravelTable from "./TravelTabel";
import useUserStore from "../store/userStore";

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

const LNGTrends: React.FC = () => {
  // 使用React状态管理LNG页面特有的状态
  const [travelNotes, setTravelNotes] = useState<TravelNote[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);

  // 使用useUserStore获取用户信息
  const { userData } = useUserStore();

  // 从后端获取数据
  const fetchTravelNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3001/admin/getTravelNotes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: currentPage,
            size: pageSize,
            search: searchValue,
          }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      setTravelNotes(result.result);
      setTotal(result.total);
    } catch (error) {
      console.error("获取游记数据失败:", error);
      message.error("获取游记数据失败");
    } finally {
      setLoading(false);
    }
  };

  // 当依赖项变化时，重新获取数据
  useEffect(() => {
    fetchTravelNotes();
  }, [currentPage, pageSize, searchValue]);

  // 处理搜索输入变化
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1); // 重置到第一页
  };

  return (
    <Card>
      <Input
        prefix={<SearchOutlined />}
        placeholder="请输入搜索内容"
        value={searchValue}
        onChange={handleSearch}
        size="large"
        style={{ marginBottom: 16 }}
      />
      <p className="text-2xl font-bold my-4">游记管理</p>

      <TravelTable
        data={travelNotes}
        loading={loading}
        onDataChange={fetchTravelNotes}
        userData={userData}
      />

      <div className="my-4">
        <Pagination
          total={total}
          current={currentPage}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          onShowSizeChange={(_, size) => {
            setPageSize(size);
            setCurrentPage(1); // 修改每页条目数时，返回第一页
          }}
          showSizeChanger
          showTotal={(total) => `共 ${total} 条记录`}
        />
      </div>
    </Card>
  );
};

export default LNGTrends;
