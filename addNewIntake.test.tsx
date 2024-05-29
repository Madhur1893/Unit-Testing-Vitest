import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ScreenerDetailForm from "../component/ScreenerDetailForm";

// Mock data
const mockLeadTypes = [
  { _id: "1", name: "Lead Type 1" },
  { _id: "2", name: "Lead Type 2", subTypes: [{ _id: "sub1", name: "Subtype 1" }] },
  { _id: "3", name: "Lead Type 3", subTypes: [{ _id: "sub1", name: "Subtype 1" }] },
  { _id: "4", name: "Lead Type 4", subTypes: [{ _id: "sub1", name: "Subtype 1" }] },
];
const screenerDetails = {
  screenerName: "",
  screenerType: "",
  screenerSubType: null,
};
const renderAddIntakeScreenerPage = () => {
  render(
    <MemoryRouter>
      <ScreenerDetailForm mode="ADD" screenerDetails={screenerDetails} handleContinue={() => {}} />
    </MemoryRouter>,
  );
};

describe("Add-New-Intake", () => {
  test("initial-fields", () => {
    renderAddIntakeScreenerPage();
    const screenerNameField = screen.getByLabelText("screenerName");
    const leadTypeField = screen.getByLabelText("screenerType");
    const submitButton = screen.getByRole("button", { name: "Continue" });
    expect(screenerNameField).toBeInTheDocument();
    expect(leadTypeField).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
  test("fetches and displays lead types", () => {
    renderAddIntakeScreenerPage();
    waitFor(async () => {
      // Wait for options to be fetched and rendered
      const leadTypeOptions = await screen.findAllByRole("option");
      expect(leadTypeOptions.length).toBe(mockLeadTypes.length);
    });
    waitFor(() => expect(screen.getByText(mockLeadTypes[0]._id)).toBeInTheDocument());
  });

  test("hides sub-type field when lead type doesn't have sub-types", async () => {
    renderAddIntakeScreenerPage();

    const leadTypeField = screen.getByLabelText("screenerType");
    expect(leadTypeField).toBeInTheDocument();

    fireEvent.change(leadTypeField, { target: { value: mockLeadTypes[0]._id } });
    waitFor(async () => {
      const leadTypeField = screen.getByLabelText("screenerType");
      fireEvent.change(leadTypeField, { target: { value: mockLeadTypes[0]._id } });
    });
    expect(screen.queryByLabelText("screenerSubType")).toBeNull(); // Subtype field not rendered
  });

  test("disables form submission when required fields are empty", () => {
    renderAddIntakeScreenerPage();
    act(() => {
      const submitButton = screen.getByRole("button", { name: "Continue" });
      expect(submitButton).toBeDisabled();
    });

    fireEvent.change(screen.getByLabelText("screenerName"), { target: { value: "New Screener" } });
  });
});
