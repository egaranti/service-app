import React, { createContext, useContext, useMemo } from "react";

// Create context
const VirtualizationContext = createContext(null);

/**
 * Provider component for virtualization optimization
 * Helps prevent unnecessary re-renders in virtualized lists
 */
export function VirtualizationProvider({ children, value }) {
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => value,
    [
      value.items,
      value.columnMapping,
      value.validation,
      // Explicitly NOT including handlers in the dependency array
      // as they should be stable references (useCallback)
    ],
  );

  return (
    <VirtualizationContext.Provider value={contextValue}>
      {children}
    </VirtualizationContext.Provider>
  );
}

/**
 * Hook to use the virtualization context
 */
export function useVirtualization() {
  const context = useContext(VirtualizationContext);
  if (context === null) {
    throw new Error(
      "useVirtualization must be used within a VirtualizationProvider",
    );
  }
  return context;
}

/**
 * Optimized row component that reads from context instead of props
 */
export const VirtualizedRow = React.memo(({ index, style }) => {
  const { items, columnMapping, handleCellChange, deleteRow, validation } =
    useVirtualization();

  // Only re-render if the specific item at this index changes
  const item = items[index];

  return (
    <div
      style={{
        ...style,
        display: "flex",
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: index % 2 === 0 ? "#f8fafc" : "white",
      }}
      className="hover:bg-gray-50"
    >
      {Object.keys(columnMapping).map((expectedKey) => {
        const errorKey = `${index}-${expectedKey}`;
        const error = validation?.errors?.[errorKey];

        return (
          <div
            key={expectedKey}
            style={{
              flex: 1,
              maxWidth: "200px",
              padding: "12px 8px",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <input
              type="text"
              value={item[expectedKey] || ""}
              onChange={(e) =>
                handleCellChange(index, expectedKey, e.target.value)
              }
              style={{
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              className={`rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-1 ${
                error
                  ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
              aria-invalid={error ? "true" : "false"}
              title={error?.message || ""}
            />
          </div>
        );
      })}
      <div
        style={{
          width: "60px",
          padding: "12px 8px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => deleteRow(index)}
          className="flex h-8 w-8 items-center justify-center rounded-md p-0 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
          title="Satırı sil"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
});
