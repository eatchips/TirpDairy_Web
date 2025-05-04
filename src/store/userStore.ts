// 用户状态管理 - 使用Zustand管理用户登录状态
import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

// 定义用户状态的接口
interface UserState {
  // 用户信息
  userData: {
    username: string;
    role: number;
    [key: string]: any;
  } | null;
  
  // 登录状态
  isLoggedIn: boolean;
  
  // 登录方法
  login: (userData: { username: string; role: number; [key: string]: any }) => void;
  
  // 登出方法
  logout: () => void;
}

// 定义持久化选项类型
type UserPersist = (
  config: StateCreator<UserState>,
  options: PersistOptions<UserState>
) => StateCreator<UserState>;

// 创建用户状态管理store
// 使用persist中间件将状态持久化到localStorage
const useUserStore = create<UserState>()(
  (persist as UserPersist)(
    (set) => ({
      // 初始状态
      userData: null,
      isLoggedIn: false,
      
      // 登录方法 - 设置用户数据和登录状态
      login: (userData) => set({ userData, isLoggedIn: true }),
      
      // 登出方法 - 清除用户数据和登录状态
      logout: () => {
        // 清除localStorage中的数据
        localStorage.removeItem('user-storage');
        // 更新状态
        set({ userData: null, isLoggedIn: false });
      },
    }),
    {
      // 持久化配置
      name: 'user-storage', // localStorage中的键名
    }
  )
);

export default useUserStore;