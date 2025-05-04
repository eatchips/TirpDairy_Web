// 登录功能
import React, { useEffect, useState } from "react";
import { Input, Button, Row, Col, message, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { md5 } from "js-md5";
import bgImage from "../assets/images/bg.png";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  // 定义记住我的状态
  const [rememberMe, setRememberMe] = useState(false);

  // 获取页面导航
  const nav = useNavigate();

  // 页面加载时获取本地存储的用户信息
  useEffect(() => {
    const storedData =
      localStorage.getItem("adminData1") ||
      sessionStorage.getItem("adminData1");
    if (storedData) {
      // 如果有存储的用户信息，则自动填充表单并设置记住我选项为 true
      setRememberMe(true);
      const userData = JSON.parse(storedData);
      setFormData({ username: userData.username, password: userData.password });
    }
  }, []);

  // 处理输入框内容变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 更新表单数据
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 提交表单数据
  const submitForm = async () => {
    // 检查用户名和密码是否为空
    if (!formData.username.trim() && !formData.password.trim()) {
      message.warning("账号和密码为必填项！");
      return;
    }
    // 使用 md5 加密密码
    const encryptedPassword = md5(formData.password);

    try {
      const response = await fetch("http://localhost:3001/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          password: encryptedPassword,
        }),
      });
      const data = await response.text();
      // 处理登录成功的情况
      if (data !== "error") {
        message.success("登录成功");
        // 将数据存储到本地
        localStorage.setItem("adminData", data);
        // 根据记住我状态 ，是否保存信息到本地
        if (rememberMe) {
          localStorage.setItem("adminData1", JSON.stringify(formData));
        } else {
          localStorage.removeItem("adminData1");
        }
        // 登陆成功，跳转页面
        nav("/lng");
      } else {
        // 处理登录失败的情况
        message.error("登录失败，请检查账号或者密码是否正确");
      }
    } catch (error) {
      message.error("登录请求失败");
    }
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center login"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(26,54,119,0.7)",
          padding: "80px 50px",
          minWidth: "450px",
        }}
      >
        <p className="text-white flex justify-center text-3xl mb-10">
          旅游日记-审核管理系统
        </p>
        <Row gutter={[0, 26]}>
          <Col span={24}>
            <Input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="请输入用户名"
            />
          </Col>
          <Col span={24}>
            <Input.Password
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="请输入密码"
            />
          </Col>
          <Col>
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            >
              <span style={{ color: "white" }}>记住我</span>
            </Checkbox>
          </Col>
          <Col span={24}>
            <Button onClick={submitForm} block type="primary" size="large">
              登录
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LoginPage;
