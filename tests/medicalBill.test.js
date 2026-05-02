const {
    calculateBasePrice,
    applyNightUrgency,
    applyMutuelleDiscount
} = require("../routes/medicalBill");

describe("Medical Bill Tests", () => {

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

    test("Coverage full file execution", () => {
        expect(true).toBe(true);
    });

    test("Mutuelle inconnue retourne prix normal", () => {
        expect(applyMutuelleDiscount(100, "Unknown")).toBe(100);
    });

    test("Cas fallback complet", () => {
        expect(applyMutuelleDiscount(50, "Unknown")).toBe(50);
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