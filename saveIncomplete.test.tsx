import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ConfirmModal from "../component/ConfirmModal";
import { MemoryRouter } from "react-router-dom";
import CallLeads from "../pages/CallLeads";

const renderLeadList = () => {
  render(
    <MemoryRouter>
      <CallLeads />
    </MemoryRouter>,
  );
};

const renderModal = () => {
  <ConfirmModal
    isLoading={false}
    openModal={true}
    setOpenModal={() => vi.fn()}
    title="Incomplete Intake Saved"
    message="This client's information has been saved as incomplete. The data will be recovered if a new intake is started.</br></br>It is now safe to close the intake."
    firstActionTitle="Cancel"
    secondActionTitle="Close Intake"
    handleFirstAction={() => vi.fn()}
    handleSecondAction={() => vi.fn()}
  />;
};

describe("Save-Incomplete-Intake-Process", () => {
  test("render Leads data", async () => {
    renderLeadList();
    expect(screen.getByText("Lead Information")).toBeInTheDocument();
    expect(screen.getByText("Contact History")).toBeInTheDocument();
    expect(screen.getByText("Call Results")).toBeInTheDocument();
    expect(screen.queryByText("New Intake")).not.toBeInTheDocument();
    const startIntakeButton = screen.getByRole("button", { name: "Start Intake" });
    expect(startIntakeButton).toBeInTheDocument();
  });

  test(`Click on "Start Intake" Button`, async () => {
    renderLeadList();
    const startIntakeButton = screen.getByRole("button", { name: "Start Intake" });

    fireEvent.click(startIntakeButton);
    waitFor(() => {
      const closeIntakeButton = screen.getByRole("button", { name: "Close Intake" });
      expect(closeIntakeButton).toBeInTheDocument();
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

  test("render Survey Form and Save Incomplete Intake functionality", async () => {
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

      const saveIncomplete = screen.getByRole("button", { name: "Save Incomplete In" });
      expect(saveIncomplete).toBeInTheDocument();

      fireEvent.click(saveIncomplete);

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
