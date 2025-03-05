import { Button } from "@egaranti/components";

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="flex h-full flex-col items-center justify-center p-6">
    <p className="mb-4 text-red-600">{error}</p>
    <Button onClick={onRetry} variant="secondaryGray">
      Retry
    </Button>
  </div>
);

export default ErrorDisplay;
