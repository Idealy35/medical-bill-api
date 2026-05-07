const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();

const { router: medicalBillRoute } = require('./routes/medicalBill');

// Sécurité : Configuration de CORS avec une liste blanche statique pour SonarQube
const allowedOrigins = ['http://localhost:3000', 'https://votre-domaine-production.com'];
app.use(cors({
    origin: allowedOrigins,
    methods: ['POST'],
    credentials: false
}));

// Sécurité : Rate limiting pour éviter les attaques par force brute ou DoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limite chaque IP à 100 requêtes par fenêtre
});
app.use(limiter);

app.use(helmet());
app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' })); // Limite la taille du body pour éviter les DoS
app.use('/api', medicalBillRoute);

module.exports = app;