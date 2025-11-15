// services/userService.ts
export interface User {
  username: string;
  avatar: string;
  email?: string;
}

const USERS_KEY = 'users';

// Mock users data เริ่มต้น
const defaultUsers: User[] = [
  {
    username: 'Kiyoomild',
    avatar: 'https://i.pinimg.com/736x/e3/cd/b2/e3cdb2270072841808e25fced8500d1d.jpg'
  },
  {
    username: 'IUMUNYAIYAI',
    avatar: 'https://i.pinimg.com/736x/0d/f2/93/0df293b1ffef115759e721217370db5c.jpg'
  },
  {
    username: 'igiveyoucarrot',
    avatar: 'https://i.pinimg.com/1200x/67/aa/45/67aa453d3533e838d2cca9e9a29391d4.jpg'
  },
  {
    username: 'อุทัยทิพย์บอย',
    avatar: 'https://i.pinimg.com/1200x/17/84/b9/1784b95416c75e52357c50e62e015f00.jpg'
  },
  {
    username: 'เอ็ดดี้พีพีดี',
    avatar: 'https://i.pinimg.com/1200x/ca/06/95/ca06959bc8ce6611f034423740b84c56.jpg'
  }
];

function loadUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    // ถ้ายังไม่มีข้อมูล ให้ save default users
    saveUsers(defaultUsers);
    return defaultUsers;
  }
  return JSON.parse(data);
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const userService = {
  // ดึงข้อมูล user ทั้งหมด
  getAllUsers: (): User[] => loadUsers(),

  // ดึงข้อมูล user คนนั้น
  getUserByUsername: (username: string): User | undefined => {
    const users = loadUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
  },

  // ดึง avatar ของ user (ถ้าไม่เจอใช้ default)
  getUserAvatar: (username: string): string => {
    const user = userService.getUserByUsername(username);
    // Default avatar ถ้าไม่เจอ user
    return user?.avatar || 'https://i.pinimg.com/736x/e3/cd/b2/e3cdb2270072841808e25fced8500d1d.jpg';
  },

  // เพิ่ม user ใหม่
  addUser: (user: User): void => {
    const users = loadUsers();
    const existingUser = users.find(u => u.username.toLowerCase() === user.username.toLowerCase());
    
    if (!existingUser) {
      users.push(user);
      saveUsers(users);
      console.log('User added:', user);
    } else {
      console.log('User already exists:', user.username);
    }
  },

  // อัพเดท avatar
  updateUserAvatar: (username: string, avatar: string): boolean => {
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (userIndex === -1) {
      console.log('User not found:', username);
      return false;
    }
    
    users[userIndex].avatar = avatar;
    saveUsers(users);
    console.log('Avatar updated for:', username);
    return true;
  },

  // ลบ user (ถ้าต้องการ)
  deleteUser: (username: string): boolean => {
    const users = loadUsers();
    const filteredUsers = users.filter(u => u.username.toLowerCase() !== username.toLowerCase());
    
    if (filteredUsers.length === users.length) return false;
    
    saveUsers(filteredUsers);
    return true;
  }
};
