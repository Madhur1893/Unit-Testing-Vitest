import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SurveyCreatorWidget from "../component/SurveyForm/SurveyCreatorWidget";
import { getConfirmationModalMessage } from "../utils/utility";
import { SurveyCreator } from "survey-creator-react";
import ConfirmationModal from "../component/ConfirmationModal";
const creatorOptions = {
  showLogicTab: false,
  showThemeTab: false,
  showSidebar: false,
  showJSONEditorTab: false,
  isAutoSave: true,
};

const creator = new SurveyCreator(creatorOptions);
creator.activeTab = "designer";
const renderSurveyCreator = () => {
  render(
    <MemoryRouter>
      <SurveyCreatorWidget
        actionMode="EDIT"
        intakeScreenerJSON=""
        screenerType="PUBLISH"
        screenersData={{ screenerName: "", screenerType: "", screenerSubType: "" }}
      />
    </MemoryRouter>,
  );
};
const renderConfirmationModal = () => {
  render(
    <ConfirmationModal
      openModal={true}
      setOpenModal={() => vi.fn()}
      isLoading={false}
      title="Confirm"
      message={getConfirmationModalMessage("EDIT", creator.activeTab, "PUBLISH")}
      actionButtons={[
        { title: creator.activeTab === "designer" ? "Preview" : "Edit", variant: "base", handleAction: () => vi.fn() },
        {
          title: "Save As Drafts",
          variant: "secondary",
          handleAction: () => vi.fn(),
        },
        {
          title: "Save",
          variant: "primary",
          handleAction: () => vi.fn(),
        },
      ]}
    />,
  );
};
describe("EDIT PUBLISH SCREENER", () => {
  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {
        // do nothing
      }
      unobserve() {
        // do nothing
      }
      disconnect() {
        // do nothing
      }
    };
  });
  test("render survey creator and edit publish modal", async () => {
    renderSurveyCreator();
    const saveButton = screen.getByRole("button", { name: "Continue" });
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
    waitFor(() => renderConfirmationModal());
    const modalText = screen.getAllByText("Do you want to Preview or Save as Draft or Save the changes in Publish Screener?");
    expect(modalText[0]).toBeInTheDocument();

    const modalButtons = screen.getAllByRole("button");
    modalButtons.forEach((button) => {
      expect(button).toBeInTheDocument();
    });
  });
});
