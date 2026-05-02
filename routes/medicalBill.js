const express = require("express");
const router = express.Router();

/* =========================
   1. CALCUL PRIX DE BASE
========================= */
function calculateBasePrice(typeConsultation) {
    if (typeConsultation === "Specialiste") {
        return 80;
    }
    return 50;
}

/* =========================
   2. URGENCE DE NUIT
========================= */
function applyNightUrgency(price, urgence, age) {
    if (urgence !== "Nuit") return price;
    if (age > 65) return price;
    return price * 2;
}

/* =========================
   3. MUTUELLE
========================= */
function applyMutuelleDiscount(price, mutuelle) {
    if (mutuelle === "Premium") return 0;
    if (mutuelle === "Basique") return price - (price * 70) / 100;
    return price;
}

/* =========================
   4. ROUTE API
========================= */
router.post("/medical-bill", (req, res) => {
    const { typeConsultation, urgence, age, mutuelle } = req.body;

    let price = calculateBasePrice(typeConsultation);
    price = applyNightUrgency(price, urgence, age);
    const resteACharge = applyMutuelleDiscount(price, mutuelle);

    res.json({
        base: price,
        resteACharge
    });
});

module.exports = {
    calculateBasePrice,
    applyNightUrgency,
    applyMutuelleDiscount
};