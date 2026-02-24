// src/lib/data.ts
export const RESTAURANT = {
  name: "Spice Garden",
  tagline: "Authentic flavors, modern experience",
  primaryColor: "#D97706",
  logo: "🌶️",
}

export const MENU_CATEGORIES = [
  { id: "starters", name: "Starters" },
  { id: "mains", name: "Mains" },
  { id: "drinks", name: "Drinks" },
  { id: "desserts", name: "Desserts" },
]

export const MENU_ITEMS = [
  {
    id: "item-1",
    categoryId: "starters",
    name: "Crispy Calamari",
    description: "Lightly fried with lemon aioli",
    price: 420,
    image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=500&q=80",
    modifierGroups: [
      {
        id: "mg-1", name: "Sauce", required: false, options: [
          { id: "m-1", name: "Aioli", priceDelta: 0 },
          { id: "m-2", name: "Sriracha", priceDelta: 0 },
          { id: "m-3", name: "Honey Mustard", priceDelta: 0 },
        ]
      }
    ]
  },
  {
    id: "item-2",
    categoryId: "starters",
    name: "Garlic Bread",
    description: "Toasted sourdough, herb butter",
    price: 220,
    image: "https://placehold.co/400x300/D97706/white?text=Garlic+Bread&font=raleway",
    modifierGroups: []
  },
  {
    id: "item-3",
    categoryId: "mains",
    name: "Grilled Ribeye Steak",
    description: "300g prime cut, seasonal vegetables",
    price: 1850,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=500&q=80",
    modifierGroups: [
      {
        id: "mg-2", name: "Doneness", required: true, options: [
          { id: "m-4", name: "Rare", priceDelta: 0 },
          { id: "m-5", name: "Medium Rare", priceDelta: 0 },
          { id: "m-6", name: "Medium", priceDelta: 0 },
          { id: "m-7", name: "Well Done", priceDelta: 0 },
        ]
      },
      {
        id: "mg-3", name: "Side", required: true, options: [
          { id: "m-8", name: "Fries", priceDelta: 0 },
          { id: "m-9", name: "Mash", priceDelta: 0 },
          { id: "m-10", name: "Side Salad", priceDelta: 0 },
        ]
      }
    ]
  },
  {
    id: "item-4",
    categoryId: "mains",
    name: "Truffle Mushroom Pasta",
    description: "Tagliatelle, wild mushrooms, parmesan",
    price: 980,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80",
    modifierGroups: [
      {
        id: "mg-4", name: "Size", required: true, options: [
          { id: "m-11", name: "Regular", priceDelta: 0 },
          { id: "m-12", name: "Large", priceDelta: 180 },
        ]
      }
    ]
  },
  {
    id: "item-5",
    categoryId: "mains",
    name: "Butter Chicken",
    description: "Classic north Indian curry, basmati rice, naan",
    price: 760,
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&q=80",
    modifierGroups: [
      {
        id: "mg-5", name: "Spice Level", required: true, options: [
          { id: "m-13", name: "Mild", priceDelta: 0 },
          { id: "m-14", name: "Medium", priceDelta: 0 },
          { id: "m-15", name: "Hot", priceDelta: 0 },
        ]
      }
    ]
  },
  {
    id: "item-6",
    categoryId: "drinks",
    name: "Fresh Lime Soda",
    description: "Nimbu pani, sweet or salted",
    price: 180,
    image: "https://placehold.co/400x300/22C55E/white?text=Fresh+Lime+Soda&font=raleway",
    modifierGroups: [
      {
        id: "mg-6", name: "Type", required: true, options: [
          { id: "m-16", name: "Sweet", priceDelta: 0 },
          { id: "m-17", name: "Salted", priceDelta: 0 },
        ]
      }
    ]
  },
  {
    id: "item-7",
    categoryId: "drinks",
    name: "Mango Lassi",
    description: "Chilled yogurt, Alphonso mango",
    price: 240,
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-8",
    categoryId: "desserts",
    name: "Gulab Jamun",
    description: "Warm milk dumplings, rose syrup, vanilla ice cream",
    price: 320,
    image: "https://placehold.co/400x300/EC4899/white?text=Gulab+Jamun&font=raleway",
    modifierGroups: []
  },
]

// Pre-loaded KDS orders for the demo
export const INITIAL_ORDERS = [
  {
    id: "ord-001",
    tableNumber: 3,
    items: [
      { name: "Grilled Ribeye Steak", qty: 1, modifiers: ["Medium Rare", "Fries"], notes: "Extra sauce please" },
      { name: "Mango Lassi", qty: 2, modifiers: [], notes: "" },
    ],
    total: 2330,
    status: "PREPARING" as const,
    createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 min ago
  },
  {
    id: "ord-002",
    tableNumber: 7,
    items: [
      { name: "Butter Chicken", qty: 2, modifiers: ["Medium"], notes: "" },
      { name: "Garlic Bread", qty: 1, modifiers: [], notes: "Well toasted" },
      { name: "Fresh Lime Soda", qty: 2, modifiers: ["Sweet"], notes: "" },
    ],
    total: 1900,
    status: "ACCEPTED" as const,
    createdAt: new Date(Date.now() - 3 * 60 * 1000), // 3 min ago
  },
  {
    id: "ord-003",
    tableNumber: 1,
    items: [
      { name: "Crispy Calamari", qty: 1, modifiers: ["Aioli"], notes: "" },
      { name: "Truffle Mushroom Pasta", qty: 1, modifiers: ["Large"], notes: "No parmesan" },
    ],
    total: 1820,
    status: "PENDING" as const,
    createdAt: new Date(Date.now() - 1 * 60 * 1000), // 1 min ago
  },
]

export const INITIAL_TABLES: Record<number, string> = {
  1: "OCCUPIED",
  2: "VACANT",
  3: "OCCUPIED",
  4: "PAYMENT_PENDING",
  5: "VACANT",
  6: "DIRTY",
}

export const UPSELL_ITEM = {
  id: "item-2",
  name: "Garlic Bread",
  price: 220,
  image: "https://placehold.co/400x300/D97706/white?text=Garlic+Bread&font=raleway",
}
