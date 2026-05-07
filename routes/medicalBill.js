const express = require("express");
const { body, validationResult } = require("express-validator");
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
router.post(
    "/medical-bill",
    // Validation robuste avec express-validator pour la sécurité (Rating A)
    [
        body("typeConsultation").isString().notEmpty().trim().escape(),
        body("age").isNumeric().isInt({ min: 0, max: 120 }),
        body("urgence").optional().isString().trim().escape(),
        body("mutuelle").optional().isString().trim().escape()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { typeConsultation, urgence, age, mutuelle } = req.body;

            let price = calculateBasePrice(typeConsultation);
            price = applyNightUrgency(price, urgence, age);
            const resteACharge = applyMutuelleDiscount(price, mutuelle);

            res.json({
                base: price,
                resteACharge
            });
        } catch (err) {
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
);

module.exports = {
    router,
    calculateBasePrice,
    applyNightUrgency,
    applyMutuelleDiscount
};