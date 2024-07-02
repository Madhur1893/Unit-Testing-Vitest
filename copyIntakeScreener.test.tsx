import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axiosService from "../utils/api/axios";
import { API_URL, AUTH_KEYS } from "../utils/settings/constant";
import { persist } from "../utils/persist";
import ScreenerListTable from "../component/ScreenerListTable";
const listIntakeScreener = [
  {
    _id: "6675a7e5854223da2eae1f2e",
    screenerName: "Demo - Do Not Delete",
    version: "13.0.0",
    leadType: {
      _id: "666ac6015357af0909b2e8f3",
      name: "Mass Tort",
      code: "Mass Tort",
      createdBy: "666ac514613bbc274b6561ef",
      partnerId: "666ac514613bbc274b6561ec",
      isEnabled: true,

      subLeadType: {
        _id: "666ac6115357af0909b2fb9f",
        name: "NEC",
        createdBy: "666ac514613bbc274b6561ef",
        leadTypeId: "666ac6015357af0909b2e8f3",
      },
    },
    partner: {
      partnerId: "666ac514613bbc274b6561ec",
      partnerCode: "b2b-trajector",
      partnerName: "B2B Trajector",
    },
    createdAt: "2024-06-21T16:18:45.212Z",
    updatedAt: "2024-06-24T13:14:31.086Z",
  },
];
const renderPublishedScreenerList = () => {
  render(
    <MemoryRouter>
      <ScreenerListTable listIntakeScreeners={listIntakeScreener} currentTabIndex={0} setIsDelete={() => vi.fn()} />
    </MemoryRouter>,
  );
};
const renderScreenerDetailPage = () => {
  render(
    <MemoryRouter>
      <ScreenerListTable listIntakeScreeners={listIntakeScreener} currentTabIndex={0} setIsDelete={() => vi.fn()} />
    </MemoryRouter>,
  );
};
describe("copy-intake-screener", () => {
  beforeAll(async () => {
    try {
      const { data } = await axiosService.post(API_URL.LOGIN_API, { email: "admin@trajector.com", password: "password" });
      persist(AUTH_KEYS.AUTH_TOKEN_COOKIE, data.data.tokenInfo.token, "localStorage");
    } catch (e) {
      return null;
    }
  });
  test("render-screeners-list", async () => {
    renderPublishedScreenerList();
    const listTable = screen.getByTestId("screener-list");
    expect(listTable).toBeInTheDocument();
    const tableRow = screen.getAllByRole("row")[1];
    expect(tableRow).toBeInTheDocument();
    const tableCells = screen.getAllByRole("cell");
    expect(tableCells.length).toBeGreaterThan(0);
    const copyIconImage = screen.getByRole("img", { name: /copy/i });
    expect(copyIconImage).toBeInTheDocument();
  });
  test("render-screener-detail-page", async () => {
    renderPublishedScreenerList();
    const copyIconImage = screen.getByRole("img", { name: /copy/i });
    expect(copyIconImage).toBeInTheDocument();
    fireEvent.click(copyIconImage);
    waitFor(() => {
      renderScreenerDetailPage();
    });
  });
});
