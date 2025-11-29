const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(cors());
app.use(express.json());

// Mock Verify Token Middleware
const verifyToken = (req, res, next) => {
    req.user = { id: 1 }; 
    next();
};

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', db: 'connected', time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ==================== USERS & AUTH API ====================

// 1. Sign Up (Create User)
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password, avatar_url } = req.body; 
    
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id, username, email, avatar_url, created_at',
      [username, email, password_hash, avatar_url]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('User creation error:', error);
    if (error.code === '23505') {
        return res.status(409).json({ error: 'User with this email already exists.' });
    }
    res.status(500).json({ error: error.message });
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userResult = await pool.query(
      'SELECT id, username, email, password_hash, avatar_url FROM users WHERE email = $1',
      [email]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid Email or Password' });
    }
    
    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid Email or Password' });
    }
    
    delete user.password_hash; 
    res.json({ message: 'Login successful', user: user });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, avatar_url, created_at FROM users ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, username, email, avatar_url, created_at FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== RECIPES API ====================

// Get all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = `
      SELECT r.*, u.username, u.avatar_url 
      FROM recipeservice r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (r.title ILIKE $${params.length} OR r.description ILIKE $${params.length})`;
    }
    
    if (category && category !== 'all') {
      params.push(category);
      query += ` AND r.category = $${params.length}`;
    }
    
    query += ' ORDER BY r.created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT r.*, u.username, u.avatar_url 
      FROM recipeservice r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recipes by user
app.get('/api/users/:userId/recipes', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT r.*, u.username, u.avatar_url 
      FROM recipeservice r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔑 [FIXED] Create new recipe (POST)
app.post('/api/recipes', async (req, res) => {
  try {
    const { title, description, image, category, userId } = req.body; 
    
    const result = await pool.query(
      'INSERT INTO recipeservice (title, description, image, category, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, image, category, userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Recipe creation error:', error);
    res.status(500).json({ error: error.message, debug_code: error.code });
  }
});

// Delete recipe (DELETE)
app.delete('/api/recipes/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; 

    try {
        const result = await pool.query(
            'DELETE FROM recipeservice WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Recipe not found or unauthorized' });
        }

        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});