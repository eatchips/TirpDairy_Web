// 保护路由 - 用于验证用户是否已登录
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// ProtectedRoute组件用于保护需要登录才能访问的路由
// 如果用户未登录，将自动重定向到登录页面
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // 从localStorage中获取管理员数据，判断用户是否已登录
  const adminData = localStorage.getItem("adminData");

  // 如果没有adminData，表示用户未登录，重定向到登录页面
  if (!adminData) {
    return <Navigate to="/" replace />;
  }

  // 如果用户已登录，则渲染子组件
  return <>{children}</>;
};

export default ProtectedRoute;
