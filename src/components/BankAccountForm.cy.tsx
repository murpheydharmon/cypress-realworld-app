import React from "react";
import BankAccountForm from "./BankAccountForm";

describe("BankAccountForm", () => {
  const defaultProps = {
    userId: "test-user-123",
    createBankAccount: () => {},
  };

  describe("Form Rendering & Initial State", () => {
    it("should render all form fields with correct placeholders", () => {
      cy.mount(<BankAccountForm {...defaultProps} />);

      cy.get('[data-test="bankaccount-bankName-input"]').should("be.visible");
      cy.get('[data-test="bankaccount-bankName-input"]').should(
        "have.attr",
        "placeholder",
        "Bank Name"
      );

      cy.get('[data-test="bankaccount-routingNumber-input"]').should("be.visible");
      cy.get('[data-test="bankaccount-routingNumber-input"]').should(
        "have.attr",
        "placeholder",
        "Routing Number"
      );

      cy.get('[data-test="bankaccount-accountNumber-input"]').should("be.visible");
      cy.get('[data-test="bankaccount-accountNumber-input"]').should(
        "have.attr",
        "placeholder",
        "Account Number"
      );

      cy.get('[data-test="bankaccount-submit"]').should("be.visible");
      cy.get('[data-test="bankaccount-submit"]').should("be.disabled");
    });

    it("should have empty initial values", () => {
      cy.mount(<BankAccountForm {...defaultProps} />);

      cy.get('[data-test="bankaccount-bankName-input"] input').should("have.value", "");
      cy.get('[data-test="bankaccount-routingNumber-input"] input').should("have.value", "");
      cy.get('[data-test="bankaccount-accountNumber-input"] input').should("have.value", "");
    });
  });

  describe("Validation Rules", () => {
    beforeEach(() => {
      cy.mount(<BankAccountForm {...defaultProps} />);
    });

    it("should show error for bank name less than 5 characters", () => {
      cy.get('[data-test="bankaccount-bankName-input"] input').type("ABC");
      cy.get('[data-test="bankaccount-bankName-input"] input').blur();

      cy.contains("Must contain at least 5 characters").should("be.visible");
      cy.get('[data-test="bankaccount-submit"]').should("be.disabled");
    });

    it("should accept valid bank name with 5 or more characters", () => {
      cy.get('[data-test="bankaccount-bankName-input"] input').type("Chase Bank");
      cy.get('[data-test="bankaccount-bankName-input"] input').blur();

      cy.get('[data-test="bankaccount-bankName-input"]').should("not.have.class", "Mui-error");
    });

    it("should show error for routing number not exactly 9 digits", () => {
      cy.get('[data-test="bankaccount-routingNumber-input"] input').type("12345678");
      cy.get('[data-test="bankaccount-routingNumber-input"] input').blur();

      cy.contains("Must contain a valid routing number").should("be.visible");

      cy.get('[data-test="bankaccount-routingNumber-input"] input').clear();
      cy.get('[data-test="bankaccount-routingNumber-input"] input').type("1234567890");
      cy.get('[data-test="bankaccount-routingNumber-input"] input').blur();

      cy.contains("Must contain a valid routing number").should("be.visible");
    });

    it("should accept valid 9-digit routing number", () => {
      cy.get('[data-test="bankaccount-routingNumber-input"] input').type("123456789");
      cy.get('[data-test="bankaccount-routingNumber-input"] input').blur();

      cy.get('[data-test="bankaccount-routingNumber-input"]').should("not.have.class", "Mui-error");
    });

    it("should show error for account number less than 9 digits", () => {
      cy.get('[data-test="bankaccount-accountNumber-input"] input').type("12345678");
      cy.get('[data-test="bankaccount-accountNumber-input"] input').blur();

      cy.contains("Must contain at least 9 digits").should("be.visible");
    });

    it("should show error for account number more than 12 digits", () => {
      cy.get('[data-test="bankaccount-accountNumber-input"] input').type("1234567890123");
      cy.get('[data-test="bankaccount-accountNumber-input"] input').blur();

      cy.contains("Must contain no more than 12 digits").should("be.visible");
    });

    it("should accept valid account number between 9-12 digits", () => {
      cy.get('[data-test="bankaccount-accountNumber-input"] input').type("123456789");
      cy.get('[data-test="bankaccount-accountNumber-input"] input').blur();

      cy.get('[data-test="bankaccount-accountNumber-input"]').should("not.have.class", "Mui-error");

      cy.get('[data-test="bankaccount-accountNumber-input"] input').clear();
      cy.get('[data-test="bankaccount-accountNumber-input"] input').type("123456789012");
      cy.get('[data-test="bankaccount-accountNumber-input"] input').blur();

      cy.get('[data-test="bankaccount-accountNumber-input"]').should("not.have.class", "Mui-error");
    });

    it("should show required field errors when fields are empty and touched", () => {
      cy.get('[data-test="bankaccount-bankName-input"] input').focus();
      cy.get('[data-test="bankaccount-bankName-input"] input').blur();
      cy.get('[data-test="bankaccount-routingNumber-input"] input').focus();
      cy.get('[data-test="bankaccount-routingNumber-input"] input').blur();
      cy.get('[data-test="bankaccount-accountNumber-input"] input').focus();
      cy.get('[data-test="bankaccount-accountNumber-input"] input').blur();

      cy.contains("Enter a bank name").should("be.visible");
      cy.contains("Enter a valid bank routing number").should("be.visible");
      cy.contains("Enter a valid bank account number").should("be.visible");
    });
  });

  describe("Form Submission", () => {
    it("should enable submit button when all fields are valid", () => {
      cy.mount(<BankAccountForm {...defaultProps} />);

      cy.get('[data-test="bankaccount-bankName-input"] input').type("Chase Bank");
      cy.get('[data-test="bankaccount-routingNumber-input"] input').type("123456789");
      cy.get('[data-test="bankaccount-accountNumber-input"] input').type("987654321");

      cy.get('[data-test="bankaccount-submit"]').should("not.be.disabled");
    });

    it("should call createBankAccount with correct data on valid submission", () => {
      const createBankAccountStub = cy.stub();
      cy.mount(<BankAccountForm userId="user123" createBankAccount={createBankAccountStub} />);

      cy.get('[data-test="bankaccount-bankName-input"] input').type("Chase Bank");
      cy.get('[data-test="bankaccount-routingNumber-input"] input').type("123456789");
      cy.get('[data-test="bankaccount-accountNumber-input"] input').type("987654321");

      cy.get('[data-test="bankaccount-submit"]').click();

      cy.then(() => {
        expect(createBankAccountStub).to.have.been.calledWith({
          userId: "user123",
          bankName: "Chase Bank",
          routingNumber: "123456789",
          accountNumber: "987654321",
        });
      });
    });

    it("should not submit form when validation errors exist", () => {
      const createBankAccountStub = cy.stub();
      cy.mount(<BankAccountForm userId="user123" createBankAccount={createBankAccountStub} />);

      cy.get('[data-test="bankaccount-bankName-input"] input').type("ABC"); // Too short
      cy.get('[data-test="bankaccount-routingNumber-input"] input').type("12345"); // Too short
      cy.get('[data-test="bankaccount-accountNumber-input"] input').type("123"); // Too short

      cy.get('[data-test="bankaccount-submit"]').should("be.disabled");

      cy.then(() => {
        expect(createBankAccountStub).not.to.have.been.called;
      });
    });
  });

  describe("Error State Handling", () => {
    beforeEach(() => {
      cy.mount(<BankAccountForm {...defaultProps} />);
    });

    it("should not show errors initially", () => {
      cy.get('[data-test="bankaccount-bankName-input"]').should("not.have.class", "Mui-error");
      cy.get('[data-test="bankaccount-routingNumber-input"]').should("not.have.class", "Mui-error");
      cy.get('[data-test="bankaccount-accountNumber-input"]').should("not.have.class", "Mui-error");
    });

    it("should show field errors only after user interaction", () => {
      cy.get('[data-test="bankaccount-bankName-input"]').should("not.have.class", "Mui-error");

      cy.get('[data-test="bankaccount-bankName-input"] input').type("AB");
      cy.get('[data-test="bankaccount-bankName-input"] input').blur();

      cy.get('[data-test="bankaccount-bankName-input"]').should("have.class", "Mui-error");
    });

    it("should clear errors when valid input is provided", () => {
      cy.get('[data-test="bankaccount-bankName-input"] input').type("AB");
      cy.get('[data-test="bankaccount-bankName-input"] input').blur();

      cy.get('[data-test="bankaccount-bankName-input"]').should("have.class", "Mui-error");

      cy.get('[data-test="bankaccount-bankName-input"] input').clear();
      cy.get('[data-test="bankaccount-bankName-input"] input').type("Chase Bank");

      cy.get('[data-test="bankaccount-bankName-input"]').should("not.have.class", "Mui-error");
    });
  });

  describe("Onboarding Mode", () => {
    it("should render correctly in onboarding mode", () => {
      cy.mount(<BankAccountForm {...defaultProps} onboarding={true} />);

      cy.get('[data-test="bankaccount-form"]').should("be.visible");
      cy.get('[data-test="bankaccount-submit"]').should("be.visible");
    });

    it("should handle submission in onboarding mode", () => {
      const createBankAccountStub = cy.stub();
      cy.mount(
        <BankAccountForm
          userId="user123"
          createBankAccount={createBankAccountStub}
          onboarding={true}
        />
      );

      cy.get('[data-test="bankaccount-bankName-input"] input').type("Chase Bank");
      cy.get('[data-test="bankaccount-routingNumber-input"] input').type("123456789");
      cy.get('[data-test="bankaccount-accountNumber-input"] input').type("987654321");

      cy.get('[data-test="bankaccount-submit"]').click();

      cy.then(() => {
        expect(createBankAccountStub).to.have.been.calledWith({
          userId: "user123",
          bankName: "Chase Bank",
          routingNumber: "123456789",
          accountNumber: "987654321",
        });
      });
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      cy.mount(<BankAccountForm {...defaultProps} />);
    });

    it("should have proper form labels and structure", () => {
      cy.get('[data-test="bankaccount-form"]').should("have.prop", "tagName", "FORM");

      cy.get('[data-test="bankaccount-bankName-input"] input').should("have.attr", "required");
      cy.get('[data-test="bankaccount-routingNumber-input"] input').should("have.attr", "required");
      cy.get('[data-test="bankaccount-accountNumber-input"] input').should("have.attr", "required");
    });

    it("should associate error messages with form fields", () => {
      cy.get('[data-test="bankaccount-bankName-input"] input').type("AB");
      cy.get('[data-test="bankaccount-bankName-input"] input').blur();

      cy.contains("Must contain at least 5 characters").should("be.visible");
    });
  });
});
