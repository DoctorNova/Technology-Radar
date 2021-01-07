describe("Visit Technology Radar", () => {
    it("Test Rings", () => {
        const testRings = (rings) => {
            cy.visit("?entries=[]&rings=" + JSON.stringify(rings));
        }
        testRings(["Adopt", "Trial", "assess", "hold"]);
        testRings([1, 2, 3, 4]);
        testRings(["Ring A", "Ring B", "Ring C   ", "  Ring D ", "ring f", 2, 5, false]);
    })
})