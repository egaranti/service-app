// Dummy data for testing purposes
const PRODUCTS = [
  {
    id: 1,
    name: "iPhone 13",
    category: "Telefonlar",
    stock: 45,
  },
  {
    id: 2,
    name: "Samsung Galaxy S21",
    category: "Telefonlar",
    stock: 30,
  },
  {
    id: 3,
    name: "MacBook Pro",
    category: "Bilgisayarlar",
    stock: 15,
  },
  {
    id: 4,
    name: "Dell XPS 13",
    category: "Bilgisayarlar",
    stock: 20,
  },
  {
    id: 5,
    name: "Sony Bravia",
    category: "TV & Ses Sistemleri",
    stock: 10,
  },

  {
    id: 4,
    name: "Dell XPS 13",
    category: "Bilgisayarlar",
    stock: 20,
  },
  {
    id: 5,
    name: "Sony Bravia",
    category: "TV & Ses Sistemleri",
    stock: 10,
  },

  {
    id: 4,
    name: "Dell XPS 13",
    category: "Bilgisayarlar",
    stock: 20,
  },
  {
    id: 5,
    name: "Sony Bravia",
    category: "TV & Ses Sistemleri",
    stock: 10,
  },

  {
    id: 4,
    name: "Dell XPS 13",
    category: "Bilgisayarlar",
    stock: 20,
  },
  {
    id: 5,
    name: "Sony Bravia",
    category: "TV & Ses Sistemleri",
    stock: 10,
  },

  {
    id: 6,
    name: "Dell XPS 13",
    category: "Bilgisayarlar",
    stock: 20,
  },
  {
    id: 7,
    name: "Sony Bravia",
    category: "TV & Ses Sistemleri",
    stock: 10,
  },
  {
    id: 6,
    name: "Dell XPS 13",
    category: "Bilgisayarlar",
    stock: 20,
  },
  {
    id: 5,
    name: "Sony Bravia",
    category: "TV & Ses Sistemleri",
    stock: 10,
  },
  {
    id: 6,
    name: "Dell XPS 13",
    category: "Bilgisayarlar",
    stock: 20,
  },
  {
    id: 5,
    name: "Sony Bravia",
    category: "TV & Ses Sistemleri",
    stock: 10,
  },
  {
    id: 6,
    name: "Dell XPS 13",
    category: "Bilgisayarlar",
    stock: 20,
  },
  {
    id: 5,
    name: "Sony Bravia",
    category: "TV & Ses Sistemleri",
    stock: 10,
  },
];

// Dummy data for spare parts
const SPARE_PARTS = {
  1: [
    { id: 101, name: "Ekran", stock: 25, price: 350 },
    { id: 102, name: "Batarya", stock: 40, price: 120 },
    { id: 103, name: "Hoparlör", stock: 30, price: 80 },
  ],
  2: [{ id: 201, name: "Batarya", stock: 30, price: 400 }],
  3: [
    { id: 301, name: "Klavye", stock: 10, price: 150 },
    { id: 302, name: "SSD Disk", stock: 20, price: 250 },
  ],
  4: [{ id: 401, name: "Adaptör", stock: 15, price: 120 }],
  5: [
    { id: 501, name: "Kumanda", stock: 8, price: 90 },
    { id: 502, name: "HDMI Kablosu", stock: 25, price: 40 },
  ],
};

// Helper to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// SparePartsService
const SparePartsService = {
  // Get all products
  getProducts: async () => {
    await delay(500);
    return [...PRODUCTS];
  },

  // Get spare parts for a specific product
  getProductSpareParts: async (productId) => {
    await delay(300);
    return SPARE_PARTS[productId] || [];
  },

  // Create new spare part
  createSparePart: async (values) => {
    await delay(300);
    const productId = values.productId;
    const newPart = {
      id: Math.floor(Math.random() * 10000),
      name: values.name,
      stock: values.stock || 0,
      price: values.price || 0,
    };

    if (!SPARE_PARTS[productId]) {
      SPARE_PARTS[productId] = [];
    }

    SPARE_PARTS[productId].push(newPart);
    return newPart;
  },

  // Update spare part
  updateSparePart: async (id, values) => {
    await delay(300);

    // Find the spare part in all products
    for (const productId in SPARE_PARTS) {
      const index = SPARE_PARTS[productId].findIndex((part) => part.id === id);
      if (index !== -1) {
        const updatedPart = {
          ...SPARE_PARTS[productId][index],
          ...values,
        };
        SPARE_PARTS[productId][index] = updatedPart;
        return updatedPart;
      }
    }

    throw new Error("Spare part not found");
  },

  // Delete spare part
  deleteSparePart: async (id) => {
    await delay(300);

    // Find and remove the spare part
    for (const productId in SPARE_PARTS) {
      const index = SPARE_PARTS[productId].findIndex((part) => part.id === id);
      if (index !== -1) {
        SPARE_PARTS[productId].splice(index, 1);
        return true;
      }
    }

    throw new Error("Spare part not found");
  },
};

export default SparePartsService;
