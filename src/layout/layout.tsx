// 菜单栏、内容布局、底部版权信息
import { useState } from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { DashboardOutlined, RollbackOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd/es/menu";
import type { MenuInfo } from "rc-menu/lib/interface";
const { Content, Footer, Sider } = Layout;

function BasicUsage(props: MenuProps) {
  // active菜单栏的当前选中值
  const [active, setActive] = useState("");
  const nav = useNavigate();
  const menuChange = (info: MenuInfo) => {
    nav(info.key as string);
    setActive(info.key as string);
  };

  // 定义菜单项
  const menuItems = [
    {
      key: "",
      icon: <DashboardOutlined />,
      label: "游记管理",
    },
  ];

  return (
    <>
      <Menu
        selectedKeys={[active]}
        onClick={menuChange}
        mode="inline"
        theme="dark"
        items={menuItems}
        {...props}
      />
      <div
        className="flex justify-center items-center space-x-2 mt-4 cursor-pointer"
        onClick={() => {
          nav("/");
          localStorage.removeItem("adminData");
        }}
        style={{
          color: "#fff",
          marginTop: "24px",
          padding: "12px 24px",
        }}
      >
        <RollbackOutlined />
        <span>退出登录</span>
      </div>
    </>
  );
}

export default function BasicDivider() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <BasicUsage />
      </Sider>
      <Layout>
        <Content>
          <section className={"px-10 py-6"}>
            <Outlet />
            {/*   类似 vue 中 router-view */}
          </section>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          旅游日记审核管理平台 @ 2024携程
        </Footer>
      </Layout>
    </Layout>
  );
}
