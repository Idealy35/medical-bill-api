const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();

const { router: medicalBillRoute } = require('./routes/medicalBill');

// Sécurité : Configuration de CORS
app.use(cors({
    origin: '*', // À restreindre en production pour plus de sécurité
    methods: ['POST']
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

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        // console.log supprimé pour la sécurité (Information Exposure)
    });
}

module.exports = app;