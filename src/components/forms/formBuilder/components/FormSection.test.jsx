import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import FormSection from "./FormSection";

const TestWrapper = ({ children }) => {
  const methods = useForm({
    defaultValues: {
      forms: [{ fields: [] }],
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("FormSection", () => {
  it("renders empty state with add button", () => {
    render(
      <TestWrapper>
        <FormSection formIndex={0} title="Test Form" />
      </TestWrapper>
    );

    expect(screen.getByText("+ Alan Ekle")).toBeInTheDocument();
  });

  it("renders follow-up form empty state correctly", () => {
    render(
      <TestWrapper>
        <FormSection formIndex={1} title="Follow Up Form" isFollowUp={true} />
      </TestWrapper>
    );

    expect(screen.getByText("+ İşlem Formu Ekle")).toBeInTheDocument();
  });

  it("renders form title and remove button when fields exist", () => {
    const methods = useForm({
      defaultValues: {
        forms: [{ fields: [{ id: "1", type: "TEXT" }] }],
      },
    });

    render(
      <FormProvider {...methods}>
        <FormSection
          formIndex={0}
          title="Test Form"
          onRemove={() => {}}
        />
      </FormProvider>
    );

    expect(screen.getByText("Test Form")).toBeInTheDocument();
    expect(screen.getByText("Kaldır")).toBeInTheDocument();
  });
});
