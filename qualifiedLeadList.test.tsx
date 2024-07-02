import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axiosService from "../utils/api/axios";
import { API_URL, AUTH_KEYS } from "../utils/settings/constant";
import { persist } from "../utils/persist";
import { LeadsListType } from "../types/screenersIntake";
import { AxiosResponse } from "axios";
import QualifiedLeadsList from "../pages/QualifiedLeadsList";

class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserver,
});

type ListDataResponse = {
  data: {
    sucesss: boolean;
    data: LeadsListType[];
  };
  status: 200;
  statusText: "OK";
};
const renderQualifiedListPage = () => {
  render(
    <MemoryRouter>
      <QualifiedLeadsList />
    </MemoryRouter>,
  );
};

describe("qualified-lead-list", () => {
  beforeAll(async () => {
    try {
      const { data } = await axiosService.post(API_URL.LOGIN_API, { email: "admin@trajector.com", password: "password" });
      persist(AUTH_KEYS.USER_DATA, data.data.user, "localStorage");
      persist(AUTH_KEYS.AUTH_TOKEN_COOKIE, data.data.tokenInfo.token, "localStorage");
    } catch (e) {
      return null;
    }
  });
  test("heading", async () => {
    renderQualifiedListPage();
    const titleTextQualifiedLeads = screen.getByText("Qualified Leads", { selector: "h2" }); // Initial heading text
    expect(titleTextQualifiedLeads).toBeInTheDocument();
  });

  test("render-table", async () => {
    renderQualifiedListPage();

    let listdata: AxiosResponse<ListDataResponse> | null = null;
    await act(async () => {
      try {
        listdata = await axiosService.get(API_URL.LEADS_LIST); //  Fetching the qualified lead list
      } catch (e) {
        return null;
      }
    });
    if (listdata) {
      await waitFor(() => {
        expect(listdata?.status).toBe(200); // Excpecting Api status should be 200
        const listTable = screen.getByTestId("qualified-leads-list");
        expect(listTable).toBeInTheDocument(); // Render the table
      });
    }
  });
});
