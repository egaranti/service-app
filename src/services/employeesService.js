import axios from "@/lib/axios";

const mockEmployees = [
  { id: 1, name: "Ahmet Yılmaz", department: "IT" },
  { id: 2, name: "Mehmet Demir", department: "HR" },
  { id: 3, name: "Ayşe Kaya", department: "Finance" },
  { id: 4, name: "Fatma Çelik", department: "Marketing" },
  { id: 5, name: "Ali Öztürk", department: "Operations" },
];

export const getEmployees = async () => {
  // In real implementation, this would be an API call
  // return axios.get(`${API_URL}/employees`);

  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockEmployees });
    }, 300);
  });
};
