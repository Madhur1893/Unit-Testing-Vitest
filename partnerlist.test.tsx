import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axiosService from "../utils/api/axios";
import { API_URL, AUTH_KEYS } from "../utils/settings/constant";
import { persist } from "../utils/persist";
import { AxiosResponse } from "axios";
import { PartnersListType } from "../types/partners";
import PartnersList from "../pages/PartnersList";
type ListDataResponse = {
  data: {
    sucesss: boolean;
    data: PartnersListType[];
  };
};
const renderPartnersList = () => {
  render(
    <MemoryRouter>
      <PartnersList />
    </MemoryRouter>,
  );
};

describe("partners-list", () => {
  beforeAll(async () => {
    try {
      const { data } = await axiosService.post(API_URL.LOGIN_API, { email: "admin@trajector.com", password: "password" });
      persist(AUTH_KEYS.AUTH_TOKEN_COOKIE, data.data.tokenInfo.token, "localStorage");
    } catch (e) {
      return null;
    }
  });
  test("heading", async () => {
    renderPartnersList();
    const headingPartnersList = screen.getByText("Partners List", { selector: "h2" }); // Initial heading text
    expect(headingPartnersList).toBeInTheDocument();
  });

  test("render-table", async () => {
    renderPartnersList();

    let listdata: AxiosResponse<ListDataResponse> | null = null;
    await act(async () => {
      try {
        listdata = await axiosService.get(API_URL.PARTNERS_LIST); //  Fetching the qualified lead list
      } catch (e) {
        return null;
      }
    });
    if (listdata) {
      await waitFor(() => {
        // expect(listdata?.data.data.sucesss).toBe(true);
        // const listTable = screen.getByTestId("partners-list");
        // expect(listTable).toBeInTheDocument(); // Render the table
      });
    }
  });
});
