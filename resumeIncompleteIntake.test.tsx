import { act, render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CallLeads from "../pages/CallLeads";
import axiosService from "../utils/api/axios";
import { API_URL, AUTH_KEYS, leadIntakeCloseStatus } from "../utils/settings/constant";
import { persist } from "../utils/persist";
import { getLead } from "../services";
import { LeadData } from "../types/lead";
import ConfirmModal from "../component/ConfirmModal";

const renderLeadsListPage = () => {
  render(
    <MemoryRouter>
      <CallLeads />
    </MemoryRouter>,
  );
};

const renderModal = () => {
  <ConfirmModal
    isLoading={false}
    openModal={true}
    setOpenModal={() => vi.fn()}
    title="Intake Status"
    message="An incomplete Intake for this person has been found. Some of the questions have already been answered, but you should still go over the questions to make sure everything is correct."
    firstActionTitle="Cancel"
    secondActionTitle="Close Intake"
    handleFirstAction={() => vi.fn()}
    handleSecondAction={() => vi.fn()}
  />;
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
    expect(screen.getByText("Lead Information")).toBeInTheDocument();
    expect(screen.getByText("Contact History")).toBeInTheDocument();
    expect(screen.getByText("Call Results")).toBeInTheDocument();
    expect(screen.queryByText("New Intake")).not.toBeInTheDocument();
    const startIntakeButton = screen.getByRole("button", { name: "Start Intake" });
    expect(startIntakeButton).toBeInTheDocument();
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

  test(`Click on "Start Intake" Button`, async () => {
    renderLeadsListPage();
    let leadData: LeadData | null = null;
    await act(async () => (leadData = await getLead()));

    if (leadData) {
      await waitFor(() => {
        const leadInfo = screen.getByTestId("lead-info");
        expect(leadInfo).toBeInTheDocument();
        const startIntakeButton = screen.getByRole("button", { name: "Start Intake" });
        fireEvent.click(startIntakeButton);
        if (leadData?.status && leadData.statusInfo && leadData.statusInfo.code === leadIntakeCloseStatus.INCOMPLETE_CALL) {
          waitFor(() => {
            renderModal();
            const okayButton = screen.getByText("Okay");
            const confirmText = screen.getByText(
              "An incomplete Intake for this person has been found. Some of the questions have already been answered, but you should still go over the questions to make sure everything is correct.",
            );
            expect(okayButton).toBeInTheDocument;
            expect(confirmText).toBeInTheDocument;
          });
        }
      });
    }
  });
});
