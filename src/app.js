const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const staticFiles = require('./routes/staticFiles');
const authRoutes = require('./routes/auth');
const iframeRoutes = require('./routes/iframe');
const path = require('path');
const db = require('./models');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login','index.html'));
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', apiRoutes);

app.use('/static', staticFiles);

app.use('/iframe', iframeRoutes);

app.use('/auth', authRoutes);

// app.get("/static/main.js", (req, res) => {
//     res.sendFile(path.join(__dirname, '..','public','js', 'main.js'));
// });


app.get('/page', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'root', 'index.html'));
});

app.get('/data', (req, res) => {
    res.json({ title: 'Consegui, porra!', message: 'teste paragrafo.', buttonText: 'Clique aqui' });
});

// Teste de conexão com o banco de dados
db.sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        return db.sequelize.sync(); // Sincroniza todos os modelos
    })
    .then(() => {
        console.log('Tabelas sincronizadas com sucesso.');
    })
    .catch(err => {
        console.error('Não foi possível conectar ao banco de dados:', err);
    });

module.exports = app;