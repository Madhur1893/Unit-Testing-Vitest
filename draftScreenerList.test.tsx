import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ScreenerLists from "../pages/ScreenerLists";
import axiosService from "../utils/api/axios";
import { API_URL, AUTH_KEYS } from "../utils/settings/constant";
import { persist } from "../utils/persist";
import { PublishedScreenerListType } from "../types/screenersIntake";
import { AxiosResponse } from "axios";
type ListDataResponse = {
  data: {
    sucesss: boolean;
    questionnaireDraftList: PublishedScreenerListType[];
  };
  status: 200;
  statusText: "OK";
};
const renderScreenerPage = () => {
  render(
    <MemoryRouter>
      <ScreenerLists />
    </MemoryRouter>,
  );
};

describe("draft-screener-list", () => {
  beforeAll(async () => {
    try {
      const { data } = await axiosService.post(API_URL.LOGIN_API, { email: "admin@trajector.com", password: "password" });
      persist(AUTH_KEYS.AUTH_TOKEN_COOKIE, data.data.tokenInfo.token, "localStorage");
    } catch (e) {
      return null;
    }
  });
  test("heading and button", async () => {
    renderScreenerPage();
    const titleTextPublishedScreener = screen.getByText("Published Screeners List", { selector: "h2" }); // Initial heading text
    const addNewIntakeScreenerButton = screen.getByText("Add New Intake Screener", { selector: "button" }); // Button for add new intake screener
    expect(titleTextPublishedScreener).toBeInTheDocument();
    expect(addNewIntakeScreenerButton).toBeInTheDocument();
  });

  test("renders tab component", async () => {
    renderScreenerPage();
    const tabElement = screen.getByTestId("screener-tab"); // Tab component render
    expect(tabElement).toBeInTheDocument();
  });
  test(" tab switching", async () => {
    renderScreenerPage();

    const tabElement = screen.getByTestId("screener-tab");
    expect(tabElement).toBeInTheDocument();
    const navElement = screen.getByRole("navigation"); // Tab action
    expect(navElement).toBeInTheDocument();
    const draftsTab = screen.getByRole("Drafts-role"); // Tab action for draft intake list
    expect(draftsTab).toBeInTheDocument();
    await act(() =>
      waitFor(() => {
        fireEvent.click(draftsTab); // Clicking the action to swicth to draft intake screener list
      }),
    );
    const updatedTitle = screen.getByText("Draft Screeners List", { selector: "h2" }); // Update the heading text
    expect(updatedTitle).toBeInTheDocument();
    let listdata: AxiosResponse<ListDataResponse> | null = null;
    await act(async () => {
      try {
        listdata = await axiosService.get(API_URL.DRAFT_LIST_INTAKE_SCREENERS); //  Fetching the draft inatke screener list
      } catch (e) {
        return null;
      }
    });
    if (listdata) {
      await waitFor(() => {
        expect(listdata?.status).toBe(200); // Excpecting Api status should be 200
        const updatedTable = screen.getByTestId("screener-list");
        const updatedAtColumn = screen.getByText("Updated At");
        expect(updatedTable).toBeInTheDocument(); // Render the table on tab switch
        expect(updatedAtColumn).toBeInTheDocument(); // Render the table header with the column present updated at for draft screener list
      });
    }
  });
});
