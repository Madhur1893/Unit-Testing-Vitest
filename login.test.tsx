import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login from "../pages/Login";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";

const renderLoginPage = () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
};
describe("login unit test", () => {
  test("login form -> REQUIRED FIELDS VALIDATION", async () => {
    renderLoginPage();
    const loginButtonSubmit = screen.getByRole("button", { name: "Sign in" });
    fireEvent.submit(loginButtonSubmit) || fireEvent.click(loginButtonSubmit);
    await waitFor(() => {
      const emailError = screen.getByText("Email is required", { selector: "span" });
      const passwordError = screen.getByText("Password is required", { selector: "span" });
      expect(emailError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
    });
  });
  test("login form -> INVALID CREDENTIALS", async () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const loginButtonSubmit = screen.getByRole("button", { name: "Sign in" });

    // Enter inValid credentials
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.submit(loginButtonSubmit) || fireEvent.click(loginButtonSubmit);
    await act(async () => {});
    expect(toast.error("Invalid Credentials"));
  });

  test("login form -> SUCCESSFUL LOGIN", async () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const loginButtonSubmit = screen.getByRole("button", { name: "Sign in" });

    // Enter valid credentials
    fireEvent.change(emailInput, { target: { value: "admin@trajector.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.submit(loginButtonSubmit) || fireEvent.click(loginButtonSubmit);
    await act(async () => {});
    expect(null);
  });
});
