const express = require('express');
const helmet = require('helmet');
const app = express();

const { router: medicalBillRoute } = require('./routes/medicalBill');

app.use(helmet());
app.disable('x-powered-by');
app.use(express.json());
app.use('/api', medicalBillRoute);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});