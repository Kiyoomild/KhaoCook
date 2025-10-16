import React, { useState, useEffect } from 'react';
import Hero from '../../components/home/Hero';
import SearchBar from '../../components/home/SearchBar'
import CategoryButtons from '../../components/home/CategoryButtons';
import MenuGrid from '../../components/home/MenuGrid';
import AboutSection from '../../components/home/AboutSection';
import './HomePage.css';

const mockMenus = [
  {
    id: '1',
    image: 'https://i.pinimg.com/736x/d6/a4/39/d6a43951c931a67ede0cd753322d898e.jpg',
    title: 'ข้าวแกงกระหรี่ทงคัตสึไข่ข้น',
    author: 'IUMUNYAIYAI',
    authorAvatar: 'https://i.pinimg.com/736x/0d/f2/93/0df293b1ffef115759e721217370db5c.jpg'
  },
  {
    id: '2',
    image: 'https://i.pinimg.com/1200x/67/7f/36/677f361b551c6c6ea89b92f84f8f3347.jpg',
    title: 'คุกกี้บัตเตอร์รูปกล้วย',
    author: 'igiveyoucarrot',
    authorAvatar: 'https://i.pinimg.com/1200x/67/aa/45/67aa453d3533e838d2cca9e9a29391d4.jpg'
  },
  {
    id: '3',
    image: 'https://i.pinimg.com/736x/f7/64/16/f76416c50ca12492903cdc25c9dc524c.jpg',
    title: 'มาม่าเกาเหลาไข่เยิ้มๆ',
    author: 'อุทัยทิพย์บอย',
    authorAvatar: 'https://i.pinimg.com/1200x/17/84/b9/1784b95416c75e52357c50e62e015f00.jpg'
  },
  {
    id: '4',
    image: 'https://i.pinimg.com/736x/53/70/cc/5370cce73009bb433770c8040411cb7b.jpg',
    title: 'ข้าวหน้าปลาไหลมอเล่',
    author: 'เอ็ดดี้พีพีดี',
    authorAvatar: 'https://i.pinimg.com/1200x/ca/06/95/ca06959bc8ce6611f034423740b84c56.jpg'
  },
  {
    id: '5',
    image: 'https://i.pinimg.com/736x/10/54/15/105415314d809d70f035511f326adde5.jpg',
    title: 'กะเพราหมึกไข่',
    author: 'IUMUNYAIYAI',
    authorAvatar: 'https://i.pinimg.com/736x/0d/f2/93/0df293b1ffef115759e721217370db5c.jpg'
  },
  {
    id: '6',
    image: 'https://i.pinimg.com/736x/b8/c6/9d/b8c69d53a64e18b53d941ddcbde998e4.jpg',
    title: 'เกี๊ยวซ่าทอดกรอบ',
    author: 'igiveyoucarrot',
    authorAvatar: 'https://i.pinimg.com/1200x/67/aa/45/67aa453d3533e838d2cca9e9a29391d4.jpg'
  },
  {
    id: '7',
    image: 'https://i.pinimg.com/1200x/2b/05/df/2b05dffab348d1440ebf7f658e1d4788.jpg',
    title: 'น่องไก่ทอดกรอบ',
    author: 'อุทัยทิพย์บอย',
    authorAvatar: 'https://i.pinimg.com/1200x/17/84/b9/1784b95416c75e52357c50e62e015f00.jpg'
  },
  {
    id: '8',
    image: 'https://i.pinimg.com/736x/2d/bc/57/2dbc574ee682320b60e74b652d7b4a64.jpg',
    title: 'ต้มจืดใส่ข้าวโพด',
    author: 'เอ็ดดี้พีพีดี',
    authorAvatar: 'https://i.pinimg.com/1200x/ca/06/95/ca06959bc8ce6611f034423740b84c56.jpg'
  },
];

const HomePage: React.FC =() => {
  const [ activeCategory, setActiveCategory ] = useState<string>('all');
  const [ menus, setMenus ] = useState(mockMenus);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchType, setSearchType] = useState<'menu' | 'account'>('menu');

  useEffect(() => {
    // TODO: ตรงนี้จะเป็นการเรียก API จริง
    loadMenus();
  }, [activeCategory, searchQuery, searchType]);

  const loadMenus = async () => {
    setLoading(true);
    try{
      // TODO: เรียก API จริง
      // if (searchQuery) {
      //     if (searchType === 'menu') {
      //         const data = await menuService.searchMenus(searchQuery, activeCategory);
      //         setMenus(data);
      //     } else {
      //         // ค้นหา account และแสดงเมนูของ account นั้น
      //         const data = await menuService.getMenusByUser(searchQuery);
      //         setMenus(data);
      //     }
      // } else {
      //     const data = await menuService.getMenus(activeCategory);
      //     setMenus(data);
      // }
            
      // ตอนนี้ใช้ mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // จำลองการค้นหา
      if (searchQuery) {
        const filtered = mockMenus.filter(menu => 
          searchType === 'menu' 
            ? menu.title.toLowerCase().includes(searchQuery.toLowerCase())
            : menu.author.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setMenus(filtered);
      } else {
          setMenus(mockMenus);
      }
    } catch (error) {
        console.error('Error loading menus:', error);
    } finally {
        setLoading(false);
    }
  };

    const handleSearch = (query: string, type: 'menu' | 'account') => {
        setSearchQuery(query);
        setSearchType(type);
        console.log(`Searching for "${query}" in ${type}`);
  };

  return (
    <div className="home-page">
      <Hero />
    <div className="home-container">
      <div className="home-main">
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />
                    
        {/* แสดงผลการค้นหา */}
        {searchQuery && (
          <div className="search-result-info">
            <p>
              {searchType === 'menu' ? '🍽️' : '👤'} 
              {' '}ผลการค้นหา "{searchQuery}" 
              {searchType === 'menu' ? ' ในเมนู' : ' ในบัญชีผู้ใช้'}
              {' '}({menus.length} รายการ)
            </p>
            <button 
              className="clear-search-btn"
              onClick={() => {
              setSearchQuery('');
              setSearchType('menu');
              }}
            >
              ✕ ล้างการค้นหา
            </button>
          </div>
        )}
                    
        {/* Category Buttons */}
        <CategoryButtons 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
                    
        {/* Menu Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>กำลังโหลดเมนู...</p>
          </div>
        ) : (
            <MenuGrid menus={menus} />
        )}
      </div>
              
    </div>
        <AboutSection />
    </div>
  );
};

export default HomePage;