import { Label } from "@egaranti/components";

import React, { useEffect, useState } from "react";

import { BaseField } from "./BaseField";

import getEmployees from "@/services/employeesService";

export const EmployeeFieldPreview = ({ field }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getEmployees();
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <BaseField>
      <Label className="mb-4 block text-base">{field.label}</Label>
      <select>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name} - {employee.department}
          </option>
        ))}
      </select>
    </BaseField>
  );
};

export const EmployeeFieldEditor = ({ field, onUpdate }) => {
  return null;
};
