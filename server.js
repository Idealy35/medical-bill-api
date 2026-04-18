const express = require('express');
const app = express();

const medicalBillRoute = require('./routes/medicalBill');

app.use(express.json());
app.use('/api', medicalBillRoute);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});