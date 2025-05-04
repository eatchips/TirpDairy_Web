// 公共路由 - 可以直接访问的路由
import React from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

// PublicRoute组件用于包装不需要登录就能访问的页面
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export default PublicRoute;
