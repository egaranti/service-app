import { Label } from "@egaranti/components";

import React, { useEffect, useState } from "react";

import { BaseField } from "./BaseField";

import getEmployees from "@/services/employeesService";

import PropTypes from "prop-types";

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

EmployeeFieldPreview.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export const EmployeeFieldEditor = ({ field, onUpdate }) => {
  return null;
};

EmployeeFieldEditor.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
