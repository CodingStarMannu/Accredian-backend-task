
const bcrypt = require('bcrypt');
const db = require('../models/db');


exports.signup = async (req, res) => {
    const { firstname, lastname, email, password, confirm_password } = req.body;
  console.log(firstname, lastname, email,"Password:" , password, "Confirm Password :" , confirm_password)
    // Checking if passwords match
    if (password !== confirm_password) {
      return res.status(400).send('Passwords do not match');
    }
  
    // Hashing the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Inserting user data into the database
    db.query(
        'INSERT INTO user.users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)',
        [firstname, lastname, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error('MySQL insert error:', err);
          // Handling duplicate email scenario
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).send('Email address is already in use');
          }
          res.status(500).send('Internal Server Error');
        } else {
          console.log('User signed up successfully');
          res.status(201).send('User signed up successfully');
        }
      }
    );
  };
  
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email, password);
  
      // Retrieving user data from the database
      db.query('SELECT * FROM user.users WHERE email = ?', [email], async (err, results) => {
        console.log('Query executed');
  
        if (err) {
          console.error('MySQL select error:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Results:', results);
  
          if (results.length > 0) {
            const match = await bcrypt.compare(password, results[0].password);
            console.log('Password match:', match);
  
            if (match) {
              console.log('User login successful');
              res.status(200).json({ message: 'User login successful' });
            } else {
              console.log('Invalid credentials');
              res.status(401).json({ error: 'Invalid credentials' });
            }
          } else {
            console.log('User not found');
            res.status(404).json({ error: 'User not found' });
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  