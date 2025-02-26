const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const path = require('path');
const db = require('./models'); // Importa a configuração do Sequelize

const app = express();

app.use(express.json());
app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, '..', 'public')));

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