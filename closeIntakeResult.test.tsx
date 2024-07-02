import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LeadStatus } from "../types/lead";
import ResultPage from "../component/ResultPage";
const metaData = [
  {
    name: "Uncalled",
    code: 1,
    subStatus: [],
  },
  {
    name: "Busy",
    code: 2,
    subStatus: [
      {
        name: "Left Message",
        code: 201,
      },
      {
        name: "No Answer",
        code: 202,
      },
      {
        name: "Call Failed",
        code: 203,
      },
      {
        name: "Busy",
        code: 204,
      },
    ],
  },
  {
    name: "Incomplete Intake - In Progress",
    code: 3,
    subStatus: [],
  },
  {
    name: "Complete Intake - Qualified",
    code: 4,
    subStatus: [],
  },
  {
    name: "Complete Intake - Disqualified",
    code: 5,
    subStatus: [],
  },
  {
    name: "Incomplete Intake - Do not Call",
    code: 6,
    subStatus: [
      {
        name: "Do Not Call",
        code: 601,
      },
      {
        name: "Doesn't Speak English",
        code: 602,
      },
      {
        name: "Doesn't want an Attorney",
        code: 603,
      },
      {
        name: "Spam/Fake Lead",
        code: 604,
      },
      {
        name: "Not Interested/ Doesn't Need Help",
        code: 605,
      },
      {
        name: "Thought They were contacting VA",
        code: 606,
      },
      {
        name: "Wrong Number, Not in Service",
        code: 607,
      },
    ],
  },
  {
    name: "Incomplete Intake - Call Back",
    code: 7,
    subStatus: [
      {
        name: "Phone Call Dropped",
        code: 701,
      },
      {
        name: "Family Emergency",
        code: 702,
      },
      {
        name: "Need to collect Information",
        code: 703,
      },
    ],
  },
];

const renderResultPage = () => {
  render(
    <MemoryRouter>
      <ResultPage
        isResultSubmitting={false}
        resultOutcomes={metaData}
        selectedOutcome={LeadStatus.INCOMPLETE_INTAKE_CALL_BACK}
        handleFinalSubmission={() => {}}
      />
    </MemoryRouter>,
  );
};
describe("Close intake Result Page", () => {
  test("renders result page with Incomplete Intake - Do not call", () => {
    const statusMetaData = metaData.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { subStatus, ...rest } = item;
      return rest;
    });
    const subStatusMetaData = metaData.find((status) => status.code === LeadStatus.INCOMPLETE_INTAKE_CALL_BACK)?.subStatus;
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
      if (radioInput.id === "Incomplete Intake - Do not Call") {
        fireEvent.select(radioInput, { target: { value: selectedStatus?.code, checked: true } });
      } else {
        fireEvent.select(radioInput, { target: { value: selectedStatus?.code, checked: false } });
      }
    });
    statusMetaData.map((item) => {
      const radioInput = screen.getByLabelText(item.name);
      expect(radioInput).toBeInTheDocument();
      if (item.code === LeadStatus.INCOMPLETE_INTAKE_DO_NOT_CALL) {
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
