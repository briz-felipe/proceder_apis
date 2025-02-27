const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const staticFiles = require('./routes/staticFiles');
const authRoutes = require('./routes/auth');
const iframeRoutes = require('./routes/iframe');
const path = require('path');
const db = require('./models');

const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.json());

app.get('/', (req, res) => {
    res.render('login/index');
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', apiRoutes);

app.use('/static', staticFiles);

app.use('/iframe', iframeRoutes);

app.use('/auth', authRoutes);

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