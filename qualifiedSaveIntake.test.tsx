import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CallLeads from "../pages/CallLeads";

const renderLeadList = () => {
  render(
    <MemoryRouter>
      <CallLeads />
    </MemoryRouter>,
  );
};

describe("Save-Complete-Qualified-Intake", () => {
  it("should render leads data", async () => {
    renderLeadList();
    expect(screen.getByText("Lead Information")).toBeInTheDocument();
    expect(screen.getByText("Contact History")).toBeInTheDocument();
    expect(screen.getByText("Call Results")).toBeInTheDocument();
    expect(screen.queryByText("New Intake")).not.toBeInTheDocument();
    const startIntakeButton = screen.getByRole("button", { name: "Start Intake" });
    expect(startIntakeButton).toBeInTheDocument();
  });

  it(`should start lead intake process`, async () => {
    renderLeadList();
    const startIntakeButton = screen.getByRole("button", { name: "Start Intake" });

    fireEvent.click(startIntakeButton);
    waitFor(() => {
      expect(screen.getByText("New Intake")).toBeInTheDocument();
      expect(screen.getByText("Lead Type")).toBeInTheDocument();
      expect(screen.getByText("Lead")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
      expect(screen.getByText("Contact History")).not.toBeInTheDocument();
      expect(screen.getByText("Contact Results")).not.toBeInTheDocument();
    });
  });

  it("should open survey form and complete intake for qualified lead", () => {
    renderLeadList();
    const startIntakeButton = screen.getByRole("button", { name: "Start Intake" });
    expect(startIntakeButton).toBeInTheDocument();
    fireEvent.click(startIntakeButton);
    waitFor(() => {
      expect(screen.getByText("New Intake")).toBeInTheDocument();

      const continueButton = screen.getByRole("button", { name: "Continue" });
      expect(continueButton).toBeInTheDocument();

      fireEvent.click(continueButton);
      waitFor(() => {
        const completeButton = screen.getByRole("button", { name: "Complete" });
        expect(completeButton).toBeInTheDocument();

        fireEvent.click(completeButton);
        expect(screen.getByText("Results")).toBeInTheDocument();
        expect(screen.getByText("Contact Notes")).toBeInTheDocument();
        expect(screen.getByText("Outcome")).toBeInTheDocument();
      });
    });
  });
});
