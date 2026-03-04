const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      const { questionIndex } = req.query
      
      let query = 'SELECT * FROM question_comments ORDER BY created_at DESC'
      let params = []
      
      if (questionIndex !== undefined) {
        query = 'SELECT * FROM question_comments WHERE question_index = $1 ORDER BY created_at DESC'
        params = [parseInt(questionIndex)]
      }
      
      const result = await pool.query(query, params)
      
      const comments = result.rows.map(row => ({
        id: row.id,
        questionIndex: row.question_index,
        name: row.name,
        email: row.email,
        comment: row.comment,
        createdAt: row.created_at
      }))
      
      return res.status(200).json(comments)
    }
    
    if (req.method === 'POST') {
      const { questionIndex, name, email, comment } = req.body
      
      if (!name || !email || !comment) {
        return res.status(400).json({ error: 'Missing required fields' })
      }
      
      const result = await pool.query(
        'INSERT INTO question_comments (question_index, name, email, comment) VALUES ($1, $2, $3, $4) RETURNING *',
        [questionIndex, name, email, comment]
      )
      
      const row = result.rows[0]
      return res.status(201).json({
        id: row.id,
        questionIndex: row.question_index,
        name: row.name,
        email: row.email,
        comment: row.comment,
        createdAt: row.created_at
      })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      
      if (!id) {
        return res.status(400).json({ error: 'Comment ID required' })
      }
      
      await pool.query('DELETE FROM question_comments WHERE id = $1', [parseInt(id)])
      
      return res.status(200).json({ success: true })
    }
    
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
