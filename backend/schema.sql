-- ===================================
-- KhaoCook Database Schema
-- ===================================

-- Extension สำหรับ password hashing (ถ้าต้องการ)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ===================================
-- ลบตารางเก่า (ระวัง! จะลบข้อมูลทั้งหมด)
-- ===================================
DROP TABLE IF EXISTS recipeComments CASCADE;
DROP TABLE IF EXISTS recipeService CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ===================================
-- Table: users
-- ===================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'ตารางเก็บข้อมูลผู้ใช้งาน';
COMMENT ON COLUMN users.password_hash IS 'รหัสผ่านที่เข้ารหัสด้วย bcrypt';

-- ===================================
-- Table: recipeService
-- ===================================
CREATE TABLE recipeService (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    user_id INTEGER NOT NULL,
    author_avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_recipe_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

COMMENT ON TABLE recipeService IS 'ตารางเก็บข้อมูลสูตรอาหาร';
COMMENT ON COLUMN recipeService.user_id IS 'ID ของผู้สร้างสูตร';

-- ===================================
-- Table: recipeComments
-- ===================================
CREATE TABLE recipeComments (
    id SERIAL PRIMARY KEY,
    comment_text TEXT NOT NULL,
    recipe_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_comment_recipe
        FOREIGN KEY (recipe_id) 
        REFERENCES recipeService(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_comment_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

COMMENT ON TABLE recipeComments IS 'ตารางเก็บคอมเมนต์ของสูตรอาหาร';
COMMENT ON COLUMN recipeComments.comment_text IS 'เนื้อหาของคอมเมนต์';

-- ===================================
-- Indexes เพื่อเพิ่มความเร็ว Query
-- ===================================

-- Users indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created ON users(created_at DESC);

-- Recipe indexes
CREATE INDEX idx_recipe_user_id ON recipeService(user_id);
CREATE INDEX idx_recipe_created ON recipeService(created_at DESC);
CREATE INDEX idx_recipe_title ON recipeService(title);

-- Comments indexes
CREATE INDEX idx_comments_recipe_id ON recipeComments(recipe_id);
CREATE INDEX idx_comments_user_id ON recipeComments(user_id);
CREATE INDEX idx_comments_created ON recipeComments(created_at DESC);

-- ===================================
-- Function: อัพเดท updated_at อัตโนมัติ
-- ===================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger สำหรับ recipeService
CREATE TRIGGER trigger_update_recipe_updated_at
    BEFORE UPDATE ON recipeService
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- ข้อมูลทดสอบ (Development Only)
-- ===================================

-- สร้าง User ทดสอบ (password: "password123")
INSERT INTO users (username, email, password_hash, avatar, avatar_url) VALUES
('admin', 'admin@khaocook.com', '$2b$10$rQZ5vK5k5K5k5K5k5K5k5OX5X5X5X5X5X5X5X5X5X5X5X5X5X5', 'admin-avatar.png', 'https://i.pravatar.cc/150?img=1'),
('john_doe', 'john@example.com', '$2b$10$rQZ5vK5k5K5k5K5k5K5k5OX5X5X5X5X5X5X5X5X5X5X5X5X5X5', NULL, 'https://i.pravatar.cc/150?img=2'),
('jane_smith', 'jane@example.com', '$2b$10$rQZ5vK5k5K5k5K5k5K5k5OX5X5X5X5X5X5X5X5X5X5X5X5X5X5', 'jane-avatar.png', 'https://i.pravatar.cc/150?img=3');

-- สร้างสูตรอาหารทดสอบ
INSERT INTO recipeService (title, description, image, user_id, author_avatar) VALUES
('ผัดไทยกุ้งสด', 'ผัดไทยสูตรต้นตำรับ หอมกลิ่นใบกะเพรา รสชาติกลมกล่อม', 'pad-thai.jpg', 1, 'admin-avatar.png'),
('ต้มยำกุ้งน้ำข้น', 'ต้มยำกุ้งรสจัดจ้าน เผ็ดร้อน เปร้ยว มันส์', 'tom-yum.jpg', 2, NULL),
('ส้มตำไทย', 'ส้มตำแบบดั้งเดิม เผ็ดจี๊ดจ๊าด', 'som-tam.jpg', 1, 'admin-avatar.png'),
('แกงเขียวหวานไก่', 'แกงเขียวหวานสูตรคุณยาย หอมกะทิ', 'green-curry.jpg', 3, 'jane-avatar.png'),
('ข้าวผัดอเมริกัน', 'ข้าวผัดสไตล์อเมริกัน อร่อยง่ายๆ', 'fried-rice.jpg', 2, NULL);

-- สร้างคอมเมนต์ทดสอบ
INSERT INTO recipeComments (comment_text, recipe_id, user_id) VALUES
('อร่อยมากครับ ทำตามได้เลย!', 1, 2),
('สูตรนี้ดีมาก ขอบคุณครับ', 1, 3),
('เผ็ดไปหน่อย แต่อร่อยดี', 2, 1),
('ทำง่าย รสชาติดี', 3, 2),
('แกงนี้หอมมาก ชอบเลย', 4, 1),
('ข้าวผัดอร่อยมาก จะทำบ่อยๆ', 5, 3);

-- ===================================
-- Query ตรวจสอบข้อมูล
-- ===================================

-- ดูจำนวนข้อมูลในแต่ละตาราง
SELECT 
    'users' as table_name, COUNT(*) as total_rows FROM users
UNION ALL
SELECT 
    'recipeService', COUNT(*) FROM recipeService
UNION ALL
SELECT 
    'recipeComments', COUNT(*) FROM recipeComments;

-- ดูสูตรอาหารพร้อมผู้สร้าง
SELECT 
    r.id,
    r.title,
    r.description,
    u.username as author,
    r.created_at
FROM recipeService r
JOIN users u ON r.user_id = u.id
ORDER BY r.created_at DESC;

-- ดูคอมเมนต์พร้อมข้อมูลผู้แสดงความคิดเห็น
SELECT 
    rc.id,
    rc.comment_text,
    rs.title as recipe_title,
    u.username as commenter,
    rc.created_at
FROM recipeComments rc
JOIN recipeService rs ON rc.recipe_id = rs.id
JOIN users u ON rc.user_id = u.id
ORDER BY rc.created_at DESC;

-- ===================================
-- ข้อความยืนยัน
-- ===================================
DO $$
BEGIN
    RAISE NOTICE 'Database schema created successfully!';
    RAISE NOTICE 'Tables: users (%), recipeService (%), recipeComments (%)', 
        (SELECT COUNT(*) FROM users),
        (SELECT COUNT(*) FROM recipeService),
        (SELECT COUNT(*) FROM recipeComments);
END $$;
```

