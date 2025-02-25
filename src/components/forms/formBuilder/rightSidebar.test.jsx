import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import RightSidebar from "./rightSidebar";

const TestWrapper = ({ children, defaultValues }) => {
  const methods = useForm({
    defaultValues: defaultValues || {
      forms: [
        { title: "SERVICE", fields: [] },
        { title: "OPERATION", fields: [] },
      ],
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("RightSidebar", () => {
  it("renders settings view by default", () => {
    render(
      <TestWrapper>
        <RightSidebar onSave={() => {}} mode="new" />
      </TestWrapper>
    );

    expect(screen.getByText("Form Ayarları")).toBeInTheDocument();
    expect(screen.getByText("Form Türü")).toBeInTheDocument();
  });

  it("shows follow-up form section only when it has fields", () => {
    const formsWithFollowUp = {
      forms: [
        { title: "SERVICE", fields: [] },
        { title: "OPERATION", fields: [{ id: "1", type: "TEXT" }] },
      ],
    };

    render(
      <TestWrapper defaultValues={formsWithFollowUp}>
        <RightSidebar onSave={() => {}} mode="new" />
      </TestWrapper>
    );

    const followUpLabels = screen.getAllByText(/İşlem Formu/);
    expect(followUpLabels.length).toBeGreaterThan(0);
  });

  it("does not allow changing follow-up form type", () => {
    const formsWithFollowUp = {
      forms: [
        { title: "SERVICE", fields: [] },
        { title: "OPERATION", fields: [{ id: "1", type: "TEXT" }] },
      ],
    };

    render(
      <TestWrapper defaultValues={formsWithFollowUp}>
        <RightSidebar onSave={() => {}} mode="new" />
      </TestWrapper>
    );

    const operationText = screen.getByText("Operation");
    expect(operationText.parentElement).toHaveClass("cursor-not-allowed");
  });

  it("toggles between settings and preview views", () => {
    render(
      <TestWrapper>
        <RightSidebar onSave={() => {}} mode="new" />
      </TestWrapper>
    );

    const toggleButton = screen.getByText("Önizleme");
    fireEvent.click(toggleButton);

    expect(screen.getByText("Önizleme")).toBeInTheDocument();
    expect(screen.queryByText("Form Türü")).not.toBeInTheDocument();
  });
});
