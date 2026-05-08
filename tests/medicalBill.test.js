

const request = require("supertest");
const app = require("../server");
const {
    calculateBasePrice,
    applyNightUrgency,
    applyMutuelleDiscount
} = require("../routes/medicalBill");

describe("Medical Bill Unit Tests", () => {

    test("Base price - General", () => {
        expect(calculateBasePrice("General")).toBe(50);
    });

    test("Base price - Specialiste", () => {
        expect(calculateBasePrice("Specialiste")).toBe(80);
    });

    test("Mutuelle inconnue = prix inchangé", () => {
        expect(applyMutuelleDiscount(100, "None")).toBe(100);
    });

    test("Pas d'urgence = prix inchangé", () => {
        expect(applyNightUrgency(50, "Jour", 30)).toBe(50);
    });

    test("Mutuelle inconnue retourne prix normal", () => {
        expect(applyMutuelleDiscount(100, "Unknown")).toBe(100);
    });

    test("Age > 65 sans urgence = prix normal", () => {
        expect(applyNightUrgency(80, "Jour", 70)).toBe(80);
    });

    test("Urgence de nuit +100%", () => {
        expect(applyNightUrgency(50, "Nuit", 30)).toBe(100);
    });

    test("Urgence supprimée si age > 65", () => {
        expect(applyNightUrgency(50, "Nuit", 70)).toBe(50);
    });

    test("Mutuelle Premium = 0", () => {
        expect(applyMutuelleDiscount(100, "Premium")).toBe(0);
    });

    test("Mutuelle Basique = 70% pris en charge", () => {
        expect(applyMutuelleDiscount(100, "Basique")).toBe(30);
    });

});

describe("API Route Integration Tests", () => {
    test("POST /api/medical-bill - Success", async () => {
        const response = await request(app)
            .post("/api/medical-bill")
            .send({
                typeConsultation: "Specialiste",
                urgence: "Nuit",
                age: 30,
                mutuelle: "Basique"
            });
        
        expect(response.status).toBe(200);
        expect(response.body.base).toBe(160); // 80 * 2
        expect(response.body.resteACharge).toBe(48); // 160 * 0.3
    });

    test("POST /api/medical-bill - Invalid Data", async () => {
        const response = await request(app)
            .post("/api/medical-bill")
            .send({
                typeConsultation: "Specialiste"
                // age missing
            });
        
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].path).toBe("age");
    });

    test("POST /api/medical-bill - General with no urgency", async () => {
        const response = await request(app)
            .post("/api/medical-bill")
            .send({
                typeConsultation: "General",
                urgence: "Jour",
                age: 30,
                mutuelle: "None"
            });
        
        expect(response.status).toBe(200);
        expect(response.body.base).toBe(50);
        expect(response.body.resteACharge).toBe(50);
    });

    test("CORS Policy - Blocked Origin", async () => {
        const response = await request(app)
            .post("/api/medical-bill")
            .set('Origin', 'http://malicious-site.com')
            .send({
                typeConsultation: "General",
                age: 30
            });
        
        // Avec une liste statique, cors renvoie l'origin seulement s'il est autorisé
        expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });

    test("CORS Policy - Allowed Origin", async () => {
        const response = await request(app)
            .post("/api/medical-bill")
            .set('Origin', 'http://localhost:3000')
            .send({
                typeConsultation: "General",
                age: 30
            });
        expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });

    test("Rate Limiting - Should allow multiple requests", async () => {
        // Test basique pour s'assurer que le middleware n'empêche pas le fonctionnement
        const response = await request(app)
            .post("/api/medical-bill")
            .send({
                typeConsultation: "General",
                age: 30
            });
        expect(response.status).toBe(200);
        expect(response.headers['x-ratelimit-limit']).toBeDefined();
    });
});
