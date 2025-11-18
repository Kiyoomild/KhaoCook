// services/userService.ts
export interface User {
  username: string;
  avatar: string;
  email?: string;
}

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

let userData: User[] = [...defaultUsers];

export const userService = {
  //ดึงข้อมูล user ทั้งหมด
  getAllUsers: (): User[] => {
    return [...userData]; // return copy เพื่อป้องกันการแก้ไขโดยตรง
  },

  //ดึงข้อมูล User คนนั้น
  getUserByUsername: (username: string): User | undefined => {
    return userData.find(u => u.username.toLowerCase() === username.toLowerCase());
  },

  //ดึง Avatar ของ User (ถ้าไม่เจอ ใช้ default)
  getUserAvatar: (username: string): string => {
    const user = userService.getUserByUsername(username);
    //Default avatar
    return user?.avatar || 'https://i.pinimg.com/736x/e3/cd/b2/e3cdb2270072841808e25fced8500d1d.jpg';
  },

  //เพิ่ม User ใหม่
  addUser: (user: User): void => {
    const existingUser = userData.find(u => u.username.toLowerCase() === user.username.toLowerCase());

    if (!existingUser) {
      userData.push(user);
      console.log('User added:', user);
    } else {
      console.log('User already exists:', user.username);
    }
  },

  //Update avatar
  updateUserAvatar: (username: string, avatar: string): boolean => {
    const userIndex = userData.findIndex(u => u.username.toLowerCase() === username.toLowerCase());

    if (userIndex === -1) {
      console.log('User not found:', username);
      return false;
    }
    userData[userIndex].avatar = avatar;
    console.log('Avatar update for:', username);
    return true;
  },

  //ลบ User
  deleteUser: (username: string): boolean => {
    const initialLength = userData.length;
    userData = userData.filter(u => u. username.toLowerCase() !== username.toLowerCase());

    const deleted = userData.length !== initialLength;
    if (deleted) {
      console.log('User delete:', username);
    }
    return deleted;
  },

  //Reset ข้อมูลกลับเป็น Default
  resetUsers: (): void => {
    userData = [...defaultUsers];
    console.log('Users reset to default');
  },

  //ดูจำนวน user ปัจจุบัน
  getUserCount: (): number => {
    return userData.length;
  }
};
