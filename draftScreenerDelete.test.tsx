import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axiosService from "../utils/api/axios";
import { API_URL, AUTH_KEYS } from "../utils/settings/constant";
import { persist } from "../utils/persist";
import { PublishedScreenerListType } from "../types/screenersIntake";
import ScreenerListTable from "../component/ScreenerListTable";
import ConfirmModal from "../component/ConfirmModal";
import { AxiosResponse } from "axios";

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
        currentTabIndex={1} // Assuming currentTabIndex is for drafts
        setIsDelete={vi.fn()} // Mock setIsDelete function
      />
    </MemoryRouter>,
  );
};

describe("draft-screener-delete", () => {
  beforeAll(async () => {
    try {
      const { data } = await axiosService.post(API_URL.LOGIN_API, { email: "admin@trajector.com", password: "password" });
      persist(AUTH_KEYS.AUTH_TOKEN_COOKIE, data.data.tokenInfo.token, "localStorage");
    } catch (e) {
      return null;
    }
  });

  test("should delete screener on confirmation", async () => {
    const mockAxiosPost = vi.spyOn(axiosService, "delete");
    renderScreenerListTable();
    const updatedAtColumn = screen.getByText("Updated At");
    expect(updatedAtColumn).toBeInTheDocument(); // Check update column in draft list
    const trashIcon = screen.getByRole("trash-icon"); // Checking delete icon present in the table
    expect(trashIcon).toBeInTheDocument();
    await act(() =>
      waitFor(() => {
        fireEvent.click(trashIcon); // Clicking the action to swicth to draft intake screener list
      }),
    );
    act(() => {
      render(
        <ConfirmModal
          isLoading={false}
          openModal={true}
          setOpenModal={vi.fn()}
          title="Confirm"
          message="Do you want to delete the Screener ?"
          firstActionTitle="No"
          secondActionTitle="Yes"
          handleFirstAction={() => vi.fn()}
          handleSecondAction={() => vi.fn()}
        />,
      );
    });

    waitFor(() => {
      const modal = screen.getByTestId("confirm-modal");
      expect(modal).toBeInTheDocument();
    });

    const yesButton = screen.getByRole("button", { name: "Yes" });
    expect(yesButton).toBeInTheDocument();

    await act(() =>
      waitFor(() => {
        fireEvent.click(yesButton); // Clicking the action to swicth to draft intake screener list
        mockAxiosPost
          .mockResolvedValue({ data: { success: true, data: true } } as AxiosResponse<DeleteDraftResponse>)
          .mockRejectedValueOnce(new Error("Something went wrong"));
      }),
    );
  });
});
