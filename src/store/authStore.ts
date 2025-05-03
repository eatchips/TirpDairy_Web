import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AdminUser {
    username: string;
    role: number;
}

interface AuthState {
    user: AdminUser | null;
    isAuthenticated: boolean;
    login: (userData: string) => void;
    logout: () => void;
}

// 创建持久化的认证状态store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData: string) => {
        try {
          const parsedUser = JSON.parse(userData);
          // 验证parsedUser是否符合AdminUser接口
          if (typeof parsedUser === 'object' && 
              parsedUser !== null && 
              'username' in parsedUser && 
              'role' in parsedUser) {
            set({ user: parsedUser as AdminUser, isAuthenticated: true });
            // 保存到localStorage，保持与原代码兼容
            localStorage.setItem('adminData', userData);
          } else {
            throw new Error('用户数据格式不正确');
          }
        } catch (error) {
          console.error('登录数据解析失败', error);
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        // 清除localStorage，保持与原代码兼容
        localStorage.removeItem('adminData');
        // 如果确实需要移除adminData1，保留下面这行，否则可以考虑删除
        localStorage.removeItem('adminData1');
      },
    }),
    {
      name: 'auth-storage', // 存储的名称
      storage: createJSONStorage(() => localStorage), // 显式指定使用localStorage
    }
  )
);