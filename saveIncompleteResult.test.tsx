import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { leadIntakeCloseStatus } from "../utils/settings/constant";
import ResultPage from "../component/ResultPage";
const metaData = [
  {
    _id: "66463c79a6bf6f7dd8bde82d",
    name: "Complete Intake-Qualified",
    code: "complete-intake-qualified",
    subStatus: [],
  },
  {
    _id: "66463c79a6bf6f7dd8bde830",
    name: "Complete Intake-DisQualified",
    code: "complete-intake-dis-qualified",
    subStatus: [],
  },
  {
    _id: "66463c79a6bf6f7dd8bde833",
    name: "InComplete Intake-Do Not Call",
    code: "in-complete-intake-do-not-call",
    subStatus: [
      {
        name: "Do Not Call",
        code: "do-not-call",
        _id: "66463c79a6bf6f7dd8bde834",
      },
      {
        name: "Doesn't Speak English",
        code: "doesnt-speak-english",
        _id: "66463c79a6bf6f7dd8bde835",
      },
      {
        name: "Doesn't Want An Attorny",
        code: "doesnt-want-an-attorny",
        _id: "66463c79a6bf6f7dd8bde836",
      },
      {
        name: "Spam/Fake Lead",
        code: "spam-fake-lead",
        _id: "66463c79a6bf6f7dd8bde837",
      },
      {
        name: "Not Interested/Doesn't Need Help",
        code: "not-interested-doesnt-need-help",
        _id: "66463c79a6bf6f7dd8bde838",
      },
      {
        name: "Thought They Were Contacting VA",
        code: "thought-they-were-contacting-va",
        _id: "66463c79a6bf6f7dd8bde839",
      },
      {
        name: "Wrong Number, Not In Service",
        code: "wrong-number-not-in-service",
        _id: "66463c79a6bf6f7dd8bde83a",
      },
    ],
  },
  {
    _id: "66463c79a6bf6f7dd8bde83d",
    name: "InComplete Intake-Call Back",
    code: "in-complete-intake-call-back",
    subStatus: [
      {
        name: "Phone Call Dropped",
        code: "phone-call-dropped",
        _id: "66463c79a6bf6f7dd8bde83e",
      },
      {
        name: "Family Emergency",
        code: "family-emergency",
        _id: "66463c79a6bf6f7dd8bde83f",
      },
      {
        name: "Need To Collect Information",
        code: "need-to-collect-information",
        _id: "66463c79a6bf6f7dd8bde840",
      },
    ],
  },
];
const renderResultPage = () => {
  render(
    <MemoryRouter>
      <ResultPage resultOutcomes={metaData} selectedOutcome={leadIntakeCloseStatus.INCOMPLETE_CALL} handleFinalSubmission={() => {}} />
    </MemoryRouter>,
  );
};
describe("Incomplete Result Page", () => {
  test("renders result page with Incomplete Intake - call back", () => {
    const statusMetaData = metaData.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { subStatus, ...rest } = item;
      return rest;
    });
    const subStatusMetaData = metaData.find((status) => status.code === leadIntakeCloseStatus.INCOMPLETE_CALL)?.subStatus;
    renderResultPage();
    const resultPageHeader = screen.getByText("Results");
    const contactNotesHeading = screen.getByText("Contact Notes");
    const outcomeHeading = screen.getByText("Outcome");
    expect(resultPageHeader).toBeInTheDocument();
    expect(contactNotesHeading).toBeInTheDocument();
    expect(outcomeHeading).toBeInTheDocument();
    const radioInputs = screen.getAllByRole("radio");
    radioInputs.forEach((radioInput) => {
      const selectedStatus = metaData.find((status) => status.name === radioInput.id);
      if (radioInput.id === "InComplete Intake-Call Back") {
        fireEvent.select(radioInput, { target: { value: selectedStatus?._id, checked: true } });
      } else {
        fireEvent.select(radioInput, { target: { value: selectedStatus?._id, checked: false } });
      }
    });
    statusMetaData.map((item) => {
      const radioInput = screen.getByLabelText(item.name);
      expect(radioInput).toBeInTheDocument();
      if (item.code === leadIntakeCloseStatus.INCOMPLETE_CALL) {
        expect(radioInput).toBeChecked();
      } else {
        expect(radioInput).not.toBeChecked();
      }
    });
    if (subStatusMetaData) {
      subStatusMetaData.map((item) => {
        const radioInput = screen.getByLabelText(item.name);
        expect(radioInput).toBeInTheDocument();
        expect(radioInput).not.toBeChecked();
      });
    }
  });
});
