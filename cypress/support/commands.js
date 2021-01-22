// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("testSegments", (segments) => {
  cy.get(".segment").should("have.length", segments.length);

  segments.forEach((segment) => {
    const selector =
      "." + segment.label.replace("&", "\\&").replace(/\s/g, "-");
    cy.get(selector).should("be.visible").should("contain.text", segment.label);
    cy.get(selector + " > text").should("have.attr", "fill", segment.color);
  });
});

Cypress.Commands.add("testRings", (segmentsLength, rings) => {
  cy.get(".ring").should("have.length", rings.length * segmentsLength);

  rings.forEach((ring) => {
    const selector = "." + ring.label.replace(/\s/g, "-");
    cy.get(selector).should("be.visible").should("have.length", segmentsLength);
    cy.get(selector + " > title").each((title) =>
      cy.wrap(title).should("have.text", ring.label)
    );
    cy.get(selector + " textPath").each((label) =>
      cy.wrap(label).should("have.text", ring.label)
    );
  });
});
