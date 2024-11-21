export interface User {
  id: number;
  email: string;
  // ... 其他用户相关类型
}

export interface Session {
  id: string;
  userId: number;
  // ... 其他会话相关类型
}
