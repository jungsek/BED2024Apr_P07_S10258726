const sql = require('mssql');
const config = require('../dbConfig'); // Ensure correct path to dbConfig

class User {
  constructor(id, username, email) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  static async createUser(user) {
    try {
      let pool = await sql.connect(config);
      let result = await pool.request()
        .input('username', sql.VarChar, user.username)
        .input('email', sql.VarChar, user.email)
        .query('INSERT INTO Users (username, email) OUTPUT INSERTED.* VALUES (@username, @email)');
      return new User(result.recordset[0].id, result.recordset[0].username, result.recordset[0].email);
    } catch (err) {
      console.error(err);
      throw new Error('Failed to create user');
    }
  }

  static async getAllUsers() {
    try {
      let pool = await sql.connect(config);
      let result = await pool.request().query('SELECT * FROM Users');
      return result.recordset.map(row => new User(row.id, row.username, row.email));
    } catch (err) {
      console.error(err);
      throw new Error('Failed to retrieve users');
    }
  }

  static async getUserById(id) {
    try {
      let pool = await sql.connect(config);
      let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Users WHERE id = @id');
      if (result.recordset.length === 0) return null;
      let row = result.recordset[0];
      return new User(row.id, row.username, row.email);
    } catch (err) {
      console.error(err);
      throw new Error('Failed to retrieve user');
    }
  }

  static async updateUser(id, updatedUser) {
    try {
      let pool = await sql.connect(config);
      await pool.request()
        .input('id', sql.Int, id)
        .input('username', sql.VarChar, updatedUser.username)
        .input('email', sql.VarChar, updatedUser.email)
        .query('UPDATE Users SET username = @username, email = @email WHERE id = @id');
      return await User.getUserById(id);
    } catch (err) {
      console.error(err);
      throw new Error('Failed to update user');
    }
  }

  static async deleteUser(id) {
    try {
      let pool = await sql.connect(config);
      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Users WHERE id = @id');
      return { message: 'User deleted successfully' };
    } catch (err) {
      console.error(err);
      throw new Error('Failed to delete user');
    }
  }

  static async searchUsers(searchTerm) {
    const connection = await sql.connect(config);
    try {
      const query = `
        SELECT *
        FROM Users
        WHERE username LIKE '%${searchTerm}%'
          OR email LIKE '%${searchTerm}%'
      `;
      const result = await connection.request().query(query);
      return result.recordset;
    } catch (error) {
      throw new Error("Error searching users");
    } finally {
      await connection.close();
    }
  }

  static async getUsersWithBooks() {
    const connection = await sql.connect(config);
    try {
      const query = `
        SELECT u.id AS user_id, u.username, u.email, b.id AS book_id, b.title, b.author
        FROM Users u
        LEFT JOIN UserBooks ub ON ub.user_id = u.id
        LEFT JOIN Books b ON ub.book_id = b.id
        ORDER BY u.username;
      `;
      const result = await connection.request().query(query);

      const usersWithBooks = {};
      for (const row of result.recordset) {
        const userId = row.user_id;
        if (!usersWithBooks[userId]) {
          usersWithBooks[userId] = {
            id: userId,
            username: row.username,
            email: row.email,
            books: [],
          };
        }
        usersWithBooks[userId].books.push({
          id: row.book_id,
          title: row.title,
          author: row.author,
        });
      }

      return Object.values(usersWithBooks);
    } catch (error) {
      throw new Error("Error fetching users with books");
    } finally {
      await connection.close();
    }
  }
}

module.exports = User;
