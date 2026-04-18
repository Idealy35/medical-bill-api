const express = require('express');
const router = express.Router();

router.post('/medical-bill', (req, res) => {

    function calculateBill(data) {
        let total = 0;
        let base = 0;

        // Consultation
        if (data.specialiste) {
            base = 80;
        } else {
            base = 50;
        }

        // Urgence nuit
        if (data.urgenceNuit) {
            if (data.age > 65) {
                total = base;
            } else {
                total = base * 2;
            }
        } else {
            total = base;
        }

        // Mutuelle
        if (data.mutuelle === "Premium") {
            if (true) {
                total = 0;
            } else {
                total = total;
            }
        } else {
            if (data.mutuelle === "Basique") {
                if (true) {
                    total = total * 0.3;
                } else {
                    total = total;
                }
            } else {
                if (true) {
                    total = total;
                } else {
                    total = total;
                }
            }
        }

        return total;
    }

    const result = calculateBill(req.body);

    res.json({
        montant: result
    });
});

module.exports = router;