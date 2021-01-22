/// <reference types="cypress" />
import React from "react";
import { mount, unmount } from "@cypress/react";
import TechnologyRadar from "./TechnologyRadar";
import entries from "../../cypress/fixtures/entries.json";

describe("Test Technology Radar Segments", () => {
  beforeEach(() => {
    cy.viewport(1000, 1000);
  });

  afterEach(() => {
    unmount();
  });

  it("test default segments", () => {
    mount(<TechnologyRadar entries={[]} />);

    const segments = [
      { label: "Techniques", color: "#3DB5BE" },
      { label: "Tools", color: "#83AD78" },
      { label: "Platforms", color: "#E88744" },
      { label: "Languages & Frameworks", color: "#8D2145" },
    ];

    cy.testSegments(segments);
  });

  it("test two custom segments", () => {
    const segments = [
      { label: "Test segment A", color: "blue" },
      { label: "Test segment B", color: "red" },
    ];

    mount(<TechnologyRadar entries={[]} segments={segments} />);

    cy.testSegments(segments);
  });

  it("test nine custom segments", () => {
    const segments = [
      { label: "Test segment A", color: "blue" },
      { label: "Test segment B", color: "red" },
      { label: "Test segment C", color: "red" },
      { label: "Test segment D", color: "red" },
      { label: "Test segment E", color: "red" },
      { label: "Test segment F", color: "red" },
      { label: "Test segment G", color: "red" },
      { label: "Test segment H", color: "red" },
      { label: "Test segment I", color: "red" },
    ];

    mount(<TechnologyRadar entries={[]} segments={segments} />);

    cy.testSegments(segments);
  });
});

describe("Test Technology Radar Rings", () => {
  beforeEach(() => {
    cy.viewport(1000, 1000);
  });

  afterEach(() => {
    unmount();
  });

  it("test default rings", () => {
    mount(<TechnologyRadar entries={[]} />);

    cy.testRings(4, [
      { label: "Adopt", color: "#808080" },
      { label: "Trial", color: "#B3B3B3" },
      { label: "Assess", color: "#CCCCCC" },
      { label: "Hold", color: "#F2F2F2" },
    ]);
  });

  it("test one custom ring", () => {
    const rings = [
      {
        label: "Test Ring",
      },
    ];

    mount(<TechnologyRadar entries={[]} rings={rings} />);

    cy.testRings(4, rings);
  });

  it("test ten custom rings", () => {
    const rings = [
      { label: "Ring in the center", color: "#F2F2F2" },
      { label: "Ring 2", color: "#8D2145" },
      { label: "Ring 3", color: "#3DB5BE" },
      { label: "Ring 4", color: "#83AD78" },
      { label: "Ring 5", color: "#E88744" },
      { label: "Ring 6", color: "#8D2145" },
      { label: "Ring 7", color: "#8D2145" },
      { label: "Ring 8", color: "#3DB5BE" },
      { label: "Ring 9", color: "#83AD78" },
      { label: "Ring 10", color: "#E88744" },
    ];

    mount(<TechnologyRadar entries={[]} rings={rings} />);

    cy.testRings(4, rings);
  });
});

describe("Test Technology Radar Entries", () => {
  beforeEach(() => {
    cy.viewport(1000, 1000);
  });

  afterEach(() => {
    unmount();
  });

  it("Test entries", () => {
    const segments = [
      { label: "Languages", color: "#8D2145" },
      { label: "Frameworks", color: "#8D2145" },
      { label: "Data Management", color: "#3DB5BE" },
      { label: "Tools", color: "#83AD78" },
      { label: "Other Topics", color: "#E88744" },
    ];

    const rings = [
      { label: "I am confident", color: "#808080" },
      { label: "I am on my way to beeing confident", color: "#B3B3B3" },
      { label: "I know the fundametals", color: "#CCCCCC" },
      { label: "I want to learn", color: "#F2F2F2" },
    ];

    mount(
      <TechnologyRadar segments={segments} rings={rings} entries={entries} />
    );

    cy.get(".entry").should("have.length", entries.length);
  });
});
