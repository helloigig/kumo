import { describe, it, expect } from "vite-plus/test";
import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { SensitiveInput } from "./sensitive-input";

describe("SensitiveInput", () => {
  it("should be defined", () => {
    expect(SensitiveInput).toBeDefined();
  });

  it("should accept required props", () => {
    const props = {
      label: "API Key",
    };
    expect(() => createElement(SensitiveInput, props)).not.toThrow();
  });

  it("should accept all optional props", () => {
    const props = {
      value: "secret-value",
      defaultValue: "default-secret",
      onChange: () => {},
      onValueChange: () => {},
      onCopy: () => {},
      size: "base" as const,
      variant: "default" as const,
      label: "API Key",
      disabled: false,
      readOnly: false,
      id: "api-key-input",
      name: "apiKey",
      placeholder: "Enter API key",
      required: true,
      autoComplete: "off",
      className: "custom-class",
    };
    expect(() => createElement(SensitiveInput, props)).not.toThrow();
  });

  it("applies error border when error prop is truthy", () => {
    const { container } = render(
      <SensitiveInput aria-label="API Key" error="Invalid key" />,
    );
    // Error styling (ring-kumo-danger) is on the container div wrapping the password input
    const inputEl = container.querySelector("input");
    expect(inputEl?.parentElement?.className).toContain("ring-kumo-danger");
  });

  // Description and error without a visible label (#855)
  it("renders description without label", () => {
    const { container } = render(
      <SensitiveInput aria-label="Secret" description="Keep this private" />,
    );
    const description = screen.getByText("Keep this private");
    expect(container.querySelector("label")).toBeNull();
    expect(
      container.querySelector("input")?.getAttribute("aria-describedby"),
    ).toContain(description.id);
  });

  it("renders error message without label when error is a string", () => {
    render(<SensitiveInput aria-label="Secret" error="A value is required" />);
    expect(screen.getByText("A value is required")).toBeTruthy();
  });

  it("renders error message without label when error is an object", () => {
    render(
      <SensitiveInput
        aria-label="Secret"
        error={{ message: "Required field", match: true }}
      />,
    );
    expect(screen.getByText("Required field")).toBeTruthy();
  });

  it("keeps its aria-label as the name with only a description", () => {
    const { container } = render(
      <SensitiveInput aria-label="Secret" description="Help text" />,
    );
    expect(container.querySelector("label")).toBeNull();
    expect(container.querySelector("input")?.getAttribute("aria-label")).toBe(
      "Secret",
    );
  });

  it("uses aria-label to name the masked container", () => {
    render(
      <SensitiveInput
        aria-label="Secret"
        defaultValue="sk_live_abc123"
        description="Keep this private"
      />,
    );
    expect(
      screen.getByRole("button", { name: "Secret, masked." }),
    ).toBeTruthy();
    expect(screen.getByText("Keep this private")).toBeTruthy();
  });
});
