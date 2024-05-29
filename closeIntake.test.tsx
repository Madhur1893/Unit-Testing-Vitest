import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ConfirmModal from "../component/ConfirmModal";
import { MemoryRouter } from "react-router-dom";
import LeadsList from "../pages/LeadsList";

const renderLeadList = () => {
  render(
    <MemoryRouter>
      <LeadsList />
    </MemoryRouter>,
  );
};

const renderModal = () => {
  <ConfirmModal
    isLoading={false}
    openModal={true}
    setOpenModal={() => vi.fn()}
    title="Are you sure?"
    message="Are you sure you want to close the intake?"
    firstActionTitle="Cancel"
    secondActionTitle="Close Intake"
    handleFirstAction={() => vi.fn()}
    handleSecondAction={() => vi.fn()}
  />;
};

describe("Close-Intake-Process", () => {
  test("render Leads data", async () => {
    renderLeadList();
    expect(screen.getByText("Lead Information")).toBeInTheDocument();
    expect(screen.getByText("Contact History")).toBeInTheDocument();
    expect(screen.getByText("Contact Results")).toBeInTheDocument();
    expect(screen.queryByText("New Intake")).not.toBeInTheDocument();
  });

  test(`Click on "Start Intake" Button`, async () => {
    renderLeadList();
    const startIntakeButton = screen.getByRole("button", { name: "Start Intake" });
    expect(startIntakeButton).toBeInTheDocument();

    fireEvent.click(startIntakeButton);

    waitFor(() => {
      expect(screen.getByRole("button", { name: "Close Intake" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Save Incomplete Intake" })).toBeInTheDocument();
      expect(screen.getByText("New Intake")).toBeInTheDocument(); // New intake form
      expect(screen.getByText("Lead Type")).toBeInTheDocument();
      expect(screen.getByText("Lead")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
      expect(screen.getByText("Contact History")).not.toBeInTheDocument();
      expect(screen.getByText("Contact Results")).not.toBeInTheDocument();
    });
  });

  test("render Survey Form and close intake button functionality", async () => {
    renderLeadList();

    const startIntakeButton = screen.getByRole("button", { name: "Start Intake" });
    expect(startIntakeButton).toBeInTheDocument();

    fireEvent.click(startIntakeButton);

    waitFor(() => {
      expect(screen.getByText("New Intake")).toBeInTheDocument(); // New intake form

      const continueButton = screen.getByRole("button", { name: "Continue" });
      expect(continueButton).toBeInTheDocument();

      fireEvent.click(continueButton);

      waitFor(() => {
        //Survey Form
        const nextButton = screen.getByRole("button", { name: "Next" });
        const completeButton = screen.getByRole("button", { name: "Complete" });
        expect(nextButton || completeButton).toBeInTheDocument();
      });

      const closeIntakeButton = screen.getByRole("button", { name: "Close Intake" });
      expect(closeIntakeButton).toBeInTheDocument();

      fireEvent.click(continueButton);

      waitFor(() => {
        renderModal();

        const modal = screen.getByRole("dialog-box");
        expect(modal).toBeInTheDocument();
        const closeIntake = screen.getByRole("button", { name: "Close Intake" });

        fireEvent.click(closeIntake);

        waitFor(() => {
          expect(modal).not.toBeInTheDocument();
          expect(screen.getByText("Results")).toBeInTheDocument();
          expect(screen.getByText("Contact Notes")).toBeInTheDocument();
          expect(screen.getByText("Outcome")).toBeInTheDocument();
        });
      });
    });
  });
});
