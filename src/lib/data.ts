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
    paired_items: ["item-2", "item-25"], // Garlic Bread, Chai
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
    image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-3",
    categoryId: "mains",
    name: "Grilled Ribeye Steak",
    description: "300g prime cut, seasonal vegetables",
    price: 1850,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=500&q=80",
    paired_items: ["item-2", "item-25"], // Garlic Bread, Chai
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
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1609345265499-2133bbeb6ce5?w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?w=500&q=80",
    modifierGroups: []
  },
  // Chinese (5 items)
  {
    id: "item-9",
    categoryId: "starters",
    name: "Veg Manchurian",
    description: "Deep fried veg balls in spicy soy-chilli gravy",
    price: 340,
    image: "https://images.unsplash.com/photo-1682622110433-65513a55d7da?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-10",
    categoryId: "starters",
    name: "Spring Rolls",
    description: "Crispy rolls with cabbage and carrot filling",
    price: 280,
    image: "https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-11",
    categoryId: "mains",
    name: "Veg Hakka Noodles",
    description: "Classic stir-fried noodles with crisp vegetables",
    price: 450,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-12",
    categoryId: "mains",
    name: "Schezwan Fried Rice",
    description: "Spicy fried rice with schezwan peppers",
    price: 480,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-13",
    categoryId: "starters",
    name: "Veg Dim Sums",
    description: "Steamed dumplings with exotic vegetables",
    price: 360,
    image: "https://images.unsplash.com/photo-1595424265370-3e02d3e6c10c?w=500&q=80",
    modifierGroups: []
  },
  // South Indian (5 items)
  {
    id: "item-14",
    categoryId: "mains",
    name: "Masala Dosa",
    description: "Fermented crepe with spiced potato filling",
    price: 220,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-15",
    categoryId: "starters",
    name: "Idli Sambar",
    description: "Steamed rice cakes served with lentil stew",
    price: 160,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-16",
    categoryId: "starters",
    name: "Medu Vada",
    description: "Savoury fried lentil donuts, crispy exterior",
    price: 180,
    image: "https://images.unsplash.com/photo-1683533678036-46ec6a0163d9?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-17",
    categoryId: "mains",
    name: "Paneer Uttapam",
    description: "Thick savory pancake topped with paneer and onions",
    price: 240,
    image: "https://images.unsplash.com/photo-1664774367243-18caa521fb96?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-18",
    categoryId: "mains",
    name: "Mysore Rava Dosa",
    description: "Thin crispy semolina crepe with spicy chutney",
    price: 250,
    image: "https://images.unsplash.com/photo-1623773005254-d4da6e8c74a0?w=500&q=80",
    modifierGroups: []
  },
  // Thai (5 items)
  {
    id: "item-19",
    categoryId: "mains",
    name: "Veg Pad Thai",
    description: "Stir-fried rice noodles with tofu and peanuts",
    price: 520,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-20",
    categoryId: "mains",
    name: "Thai Green Curry",
    description: "Coconut-based curry with bamboo shoots and basil",
    price: 580,
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-21",
    categoryId: "starters",
    name: "Tom Yum Soup",
    description: "Spicy and sour Thai soup with lemongrass",
    price: 320,
    image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-22",
    categoryId: "starters",
    name: "Som Tum (Papaya Salad)",
    description: "Green papaya salad with lime and chillies",
    price: 380,
    image: "https://images.unsplash.com/photo-1648421331147-9fcfab29536e?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-23",
    categoryId: "mains",
    name: "Thai Basil Rice",
    description: "Fragrant rice stir-fried with holy basil",
    price: 420,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80",
    modifierGroups: []
  },
  // Drinks & Water
  {
    id: "item-24",
    categoryId: "drinks",
    name: "Mineral Water",
    description: "Chilled bottled water (1L)",
    price: 40,
    image: "https://images.unsplash.com/photo-1548919973-5cdf5916cc74?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-25",
    categoryId: "drinks",
    name: "Masala Chai",
    description: "Traditional Indian tea with spices",
    price: 80,
    image: "https://images.unsplash.com/photo-1558235924-99448100570b?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-26",
    categoryId: "drinks",
    name: "Cold Coffee",
    description: "Iced blended coffee with vanilla ice cream",
    price: 180,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-27",
    categoryId: "drinks",
    name: "Peach Iced Tea",
    description: "Refreshing home-brewed tea with peach flavor",
    price: 150,
    image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-28",
    categoryId: "drinks",
    name: "Virgin Mojito",
    description: "Mint, lime, and soda refreshing drink",
    price: 190,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-29",
    categoryId: "drinks",
    name: "Fresh Watermelon Juice",
    description: "100% natural cold-pressed juice",
    price: 160,
    image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=500&q=80",
    modifierGroups: []
  },
  // More Desserts (5 items)
  {
    id: "item-30",
    categoryId: "desserts",
    name: "NY Cheesecake",
    description: "Creamy classic with berry compote",
    price: 450,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-31",
    categoryId: "desserts",
    name: "Triple Choc Brownie",
    description: "Gooey chocolate brownie with fudge sauce",
    price: 380,
    image: "https://images.unsplash.com/photo-1606312619070-748b9fc3fdf0?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-32",
    categoryId: "desserts",
    name: "Espresso Tiramisu",
    description: "Italian classic with cocoa and coffee layers",
    price: 420,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-33",
    categoryId: "desserts",
    name: "Malai Kulfi",
    description: "Traditional Indian frozen dessert with nuts",
    price: 180,
    image: "https://images.unsplash.com/photo-1591677445540-08028eeb3021?w=500&q=80",
    modifierGroups: []
  },
  {
    id: "item-34",
    categoryId: "desserts",
    name: "Exotic Fruit Salad",
    description: "Seasonal cut fruits with honey lime dressing",
    price: 240,
    image: "https://images.unsplash.com/photo-broken-link-intended",
    paired_items: ["item-26"], // Cold Coffee
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
  image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500&q=80",
}
