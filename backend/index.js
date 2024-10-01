const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cors = require('cors'); 
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',  
    credentials: true                 
}));

app.use(express.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

app.get('/check-auth', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});


app.post('/register', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT username FROM users WHERE username = ?', [username], (err, row) => {
        if (err) return res.status(500).json({ error: 'Erro no servidor.' });
        if (row) return res.status(400).json({ error: 'Usuário já existe.' });

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: 'Erro ao criptografar a senha.' });

            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
                if (err) return res.status(500).json({ error: 'Erro ao registrar usuário.' });
                res.status(201).json({status: 201, message: 'Usuário registrado com sucesso!' });
            });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) return res.status(500).json({ error: 'Erro no servidor.' });
        if (!user) return res.status(400).json({ error: 'Usuário não encontrado.' });

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: 'Erro ao verificar senha.' });
            if (!isMatch) return res.status(400).json({ error: 'Senha incorreta.' });

            req.session.user = { id: user.id, username: user.username };
            res.json({status: 200, message: 'Login realizado com sucesso!' });
        });
    });
});

app.get('/users',(req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro ao recuperar os dados.' });
        res.json(rows);
    });
});



app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Erro ao fazer logout.' });
        res.json({ message: 'Logout realizado com sucesso!' });
    });
});

// Iniciar o servidor
const PORT = 5000;
app.listen(PORT, async () => {
    console.log(`Server rodando em http://localhost:${PORT}`);
});