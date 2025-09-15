const express = require('express');
const app = express();
app.use(require('cookie-parser')());
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const User = require('./models/usermodel.js');
const items = require('./models/items.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to the Authentication and Authorization API');
});
app.post('/create', async (req, res) => {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
        return res.status(400).send('username, email, and password are required');
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error hashing password');
            }
            let user = await User.create({ username, email, password: hash });
            const token = Jwt.sign({ email: user.email }, "djjjjjj");
            res.cookie("token", token);
            res.send({ user });
        });
    });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).send("Email and password required");

  const user = await User.findOne({ email });
  if (!user) return res.status(401).send("Invalid email or password");

  const pass = await bcrypt.compare(password, user.password);
  if (!pass) return res.status(401).send("Invalid email or password");

  const token = Jwt.sign({ email: user.email }, "djjjjjj");
  res.cookie("token", token);
  res.send({ user: { _id: user._id, username: user.username, email: user.email } });
});


app.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.send('Logged out successfully');
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});