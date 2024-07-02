import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import axiosService from "../utils/api/axios";
import { PublishedScreenerListType } from "../types/screenersIntake";
import ScreenerListTable from "../component/ScreenerListTable";
import ConfirmModal from "../component/ConfirmModal";
import { AxiosResponse } from "axios";
import { MemoryRouter } from "react-router-dom";

type DeleteDraftResponse = {
  success: boolean;
  data: boolean;
};
const mockScreeners: PublishedScreenerListType[] = [
  {
    _id: "1",
    screenerName: "Screener 1",
    leadType: {
      _id: "11",
      partnerId: "12",
      name: "Lead-Type-1",
      code: "lead-type-1",
      createdBy: "Admin",
      isEnabled: false,
      subLeadType: {
        _id: "22",
        name: "Sub-Lead-Type-1",
        createdBy: "Admin",
        leadTypeId: "11",
      },
    },
    partner: {
      partnerId: "1",
      partnerCode: "code-1",
      partnerName: "partner one",
      createdBy: "admin",
    },
    createdAt: "2024-05-10T10:00:00.000Z",
    updatedAt: "2024-05-10T10:00:00.000Z",
  },
];

const renderScreenerListTable = () => {
  render(
    <MemoryRouter>
      <ScreenerListTable
        listIntakeScreeners={mockScreeners}
        currentTabIndex={0} // Assuming currentTabIndex is for drafts
        setIsDelete={vi.fn()} // Mock setIsDelete function
      />
    </MemoryRouter>,
  );
};

const renderModal = () => {
  <ConfirmModal
    isLoading={false}
    openModal={true}
    setOpenModal={() => vi.fn()}
    title="Confirm"
    message="Do you want to delete the Screener ?"
    firstActionTitle="No"
    secondActionTitle="Yes"
    handleFirstAction={() => vi.fn()}
    handleSecondAction={() => vi.fn()}
  />;
};

describe("publish-screener-archive", () => {
  test("should archive publish screener on confirmation", async () => {
    const mockAxiosApi = vi.spyOn(axiosService, "get");
    mockAxiosApi.mockResolvedValue({ data: { success: true, data: true } } as AxiosResponse<DeleteDraftResponse>);

    renderScreenerListTable();

    const currentVersionColumn = screen.getByText("Current Version");
    expect(currentVersionColumn).toBeInTheDocument(); // Check update column in draft list
    const trashIcon = screen.getByRole("trash-icon"); // Checking delete icon present in the table
    expect(trashIcon).toBeInTheDocument();

    fireEvent.click(trashIcon);
    waitFor(() => {
      renderModal();
      const modal = screen.getByRole("dialog-box");
      expect(modal).toBeInTheDocument();
      const noButton = screen.getByRole("button", { name: "No" });
      expect(noButton).toBeInTheDocument();

      fireEvent.click(noButton);
      expect(modal).not.toBeInTheDocument();
    });

    fireEvent.click(trashIcon);

    waitFor(() => {
      renderModal();
      const modal = screen.getByRole("dialog-box");
      expect(modal).toBeInTheDocument();
      const yesButton = screen.getByRole("button", { name: "Yes" });
      expect(yesButton).toBeInTheDocument();

      fireEvent.click(yesButton);
      act(async () =>
        waitFor(() => {
          expect(mockAxiosApi).toHaveBeenCalledTimes(1);
          expect(mockAxiosApi).toHaveBeenCalledWith("1");
        }),
      );
    });
  });
});
