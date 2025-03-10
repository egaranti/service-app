// Mock data for spare parts
let mockParts = [
  {
    id: "mb-1000",
    name: "Motor Bloğu",
    code: "MB-1000",
    quantity: 1,
    unit: "adet",
    subpartCount: 3,
    subparts: [
      {
        id: "pt-500",
        name: "Piston Takımı",
        code: "PT-500",
        quantity: 4,
        unit: "set",
        subpartCount: 2,
        subparts: [
          {
            id: "ps-100",
            name: "Piston Segmanı",
            code: "PS-100",
            quantity: 12,
            unit: "adet",
            subpartCount: 0,
            subparts: [],
          },
          {
            id: "pp-200",
            name: "Piston Pimi",
            code: "PP-200",
            quantity: 4,
            unit: "adet",
            subpartCount: 0,
            subparts: [],
          },
        ],
      },
      {
        id: "km-300",
        name: "Krank Mili",
        code: "KM-300",
        quantity: 1,
        unit: "adet",
        subpartCount: 0,
        subparts: [],
      },
      {
        id: "em-400",
        name: "Eksantrik Mili",
        code: "EM-400",
        quantity: 1,
        unit: "adet",
        subpartCount: 0,
        subparts: [],
      },
    ],
  },
];

// Helper function to find a part by ID in the tree structure
const findPartById = (parts, id) => {
  for (const part of parts) {
    if (part.id === id) {
      return part;
    }
    if (part.subparts && part.subparts.length > 0) {
      const found = findPartById(part.subparts, id);
      if (found) return found;
    }
  }
  return null;
};

// Helper function to find a parent part by child ID
const findParentPart = (parts, childId, parent = null) => {
  for (const part of parts) {
    if (part.id === childId) {
      return parent;
    }
    if (part.subparts && part.subparts.length > 0) {
      const found = findParentPart(part.subparts, childId, part);
      if (found) return found;
    }
  }
  return null;
};

// Helper function to remove a part by ID
const removePartById = (parts, id) => {
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].id === id) {
      parts.splice(i, 1);
      return true;
    }
    if (parts[i].subparts && parts[i].subparts.length > 0) {
      const removed = removePartById(parts[i].subparts, id);
      if (removed) {
        parts[i].subpartCount = parts[i].subparts.length;
        return true;
      }
    }
  }
  return false;
};

// Mock implementation of the SparePartsService
export const MockSparePartsService = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockParts]);
      }, 500);
    });
  },

  getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const part = findPartById(mockParts, id);
        if (part) {
          resolve({ ...part });
        } else {
          reject(new Error(`Part with ID ${id} not found`));
        }
      }, 500);
    });
  },

  create: async (part) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPart = {
          ...part,
          id: part.code || `part-${Date.now()}`,
          subparts: [],
          subpartCount: 0,
        };
        mockParts.push(newPart);
        resolve(newPart);
      }, 500);
    });
  },

  update: async (id, updatedPart) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const part = findPartById(mockParts, id);
        if (part) {
          Object.assign(part, {
            ...updatedPart,
            id,
            subparts: part.subparts,
            subpartCount: part.subpartCount,
          });
          resolve(part);
        } else {
          reject(new Error(`Part with ID ${id} not found`));
        }
      }, 500);
    });
  },

  delete: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // First check if the part exists
        const part = findPartById(mockParts, id);
        if (!part) {
          reject(new Error(`Part with ID ${id} not found`));
          return;
        }

        // If it's a top-level part
        if (mockParts.some((p) => p.id === id)) {
          mockParts = mockParts.filter((p) => p.id !== id);
          resolve({ success: true });
          return;
        }

        // If it's a subpart
        const parent = findParentPart(mockParts, id);
        if (parent) {
          parent.subparts = parent.subparts.filter((p) => p.id !== id);
          parent.subpartCount = parent.subparts.length;
          resolve({ success: true });
        } else {
          reject(new Error(`Parent for part with ID ${id} not found`));
        }
      }, 500);
    });
  },

  addSubpart: async (parentId, subpart) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const parent = findPartById(mockParts, parentId);
        if (parent) {
          const newSubpart = {
            ...subpart,
            id: subpart.code || `subpart-${Date.now()}`,
            subparts: [],
            subpartCount: 0,
          };
          parent.subparts.push(newSubpart);
          parent.subpartCount = parent.subparts.length;
          resolve(newSubpart);
        } else {
          reject(new Error(`Parent part with ID ${parentId} not found`));
        }
      }, 500);
    });
  },
};
