import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LeadsList from "../pages/LeadsList";
import axiosService from "../utils/api/axios";
import { API_URL, AUTH_KEYS } from "../utils/settings/constant";
import { persist } from "../utils/persist";
import { getLead } from "../services";
import { LeadData } from "../types/lead";

const renderLeadsListPage = () => {
  render(
    <MemoryRouter>
      <LeadsList />
    </MemoryRouter>,
  );
};

describe("Render Lead Information", () => {
  beforeAll(async () => {
    try {
      const { data } = await axiosService.post(API_URL.LOGIN_API, { email: "admin@trajector.com", password: "password" });
      persist(AUTH_KEYS.AUTH_TOKEN_COOKIE, data.data.tokenInfo.token, "localStorage");
    } catch (error) {
      console.log(error);
    }
  });
  it("should render lead information", async () => {
    renderLeadsListPage();

    // Fetch Lead Data
    let leadData: LeadData | null = null;
    await act(async () => (leadData = await getLead()));

    if (leadData) {
      await waitFor(() => {
        const leadInfo = screen.getByTestId("lead-info");
        expect(leadInfo).toBeInTheDocument();
      });
    }
  });
});
