import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axiosService from "../utils/api/axios";
import { API_URL, AUTH_KEYS } from "../utils/settings/constant";
import { persist } from "../utils/persist";
import PartnerDetails from "../pages/PartnerDetails";

const renderPartnerDetails = () => {
  render(
    <MemoryRouter>
      <PartnerDetails />
    </MemoryRouter>,
  );
};

describe("partners-details", () => {
  beforeAll(async () => {
    try {
      const { data } = await axiosService.post(API_URL.LOGIN_API, { email: "admin@trajector.com", password: "password" });
      persist(AUTH_KEYS.AUTH_TOKEN_COOKIE, data.data.tokenInfo.token, "localStorage");
    } catch (e) {
      return null;
    }
  });

  test("render-partner-details-page", async () => {
    renderPartnerDetails();
    const partnerImage = screen.getByRole("img");
    const partnerInfoHeading = screen.getByText("Partner Detail Info");

    const partnerNameLabel = screen.getByTestId("partnerName");
    const partnerLeadCountLabel = screen.getByText("Lead Count");
    const partnerPhoneLabel = screen.getByTestId("partnerPhoneNumber");
    const partnerAddressLabel = screen.getByText("Address");

    const partnerUsersHeading = screen.getByText("Users");
    const partnerUsersTable = screen.getByTestId("partner-users-list");

    expect(partnerImage).toBeInTheDocument();
    expect(partnerInfoHeading).toBeInTheDocument();
    expect(partnerNameLabel).toBeInTheDocument();
    expect(partnerLeadCountLabel).toBeInTheDocument();
    expect(partnerPhoneLabel).toBeInTheDocument();
    expect(partnerAddressLabel).toBeInTheDocument();
    expect(partnerUsersHeading).toBeInTheDocument();
    expect(partnerUsersTable).toBeInTheDocument();
  });
});
