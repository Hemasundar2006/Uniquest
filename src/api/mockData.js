// Mock product data
export const mockProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80"
    ],
    inStock: true,
    description: "Experience premium sound quality with our latest wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Premium leather ear cups",
      "Bluetooth 5.0",
      "Foldable design"
    ],
    variants: {
      colors: ["Black", "Silver", "Rose Gold"],
      sizes: []
    },
    rating: 4.8,
    reviews: 234,
    trending: true,
    bestSeller: true
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"
    ],
    inStock: true,
    description: "Track your fitness goals with precision. Heart rate monitoring, GPS tracking, and sleep analysis in a sleek design.",
    features: [
      "Heart rate monitoring",
      "GPS tracking",
      "Sleep analysis",
      "Water resistant up to 50m",
      "7-day battery life"
    ],
    variants: {
      colors: ["Black", "Blue", "Pink"],
      sizes: ["Small", "Medium", "Large"]
    },
    rating: 4.6,
    reviews: 189,
    trending: true,
    bestSeller: false
  },
  {
    id: 3,
    name: "Minimalist Leather Wallet",
    price: 49.99,
    originalPrice: 79.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
      "https://images.unsplash.com/photo-1591561954555-607968c989ab?w=800&q=80"
    ],
    inStock: true,
    description: "Crafted from premium Italian leather, this minimalist wallet holds 6-8 cards and cash while maintaining a slim profile.",
    features: [
      "Genuine Italian leather",
      "RFID protection",
      "Holds 6-8 cards",
      "Slim profile design",
      "Handcrafted quality"
    ],
    variants: {
      colors: ["Brown", "Black", "Tan"],
      sizes: []
    },
    rating: 4.9,
    reviews: 567,
    trending: false,
    bestSeller: true
  },
  {
    id: 4,
    name: "Modern Desk Lamp",
    price: 89.99,
    originalPrice: 129.99,
    category: "Home & Office",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"
    ],
    inStock: true,
    description: "Illuminate your workspace with adjustable brightness and color temperature. USB charging port included.",
    features: [
      "Adjustable brightness",
      "Color temperature control",
      "USB charging port",
      "Touch controls",
      "Energy efficient LED"
    ],
    variants: {
      colors: ["White", "Black"],
      sizes: []
    },
    rating: 4.7,
    reviews: 123,
    trending: true,
    bestSeller: false
  },
  {
    id: 5,
    name: "Insulated Water Bottle",
    price: 34.99,
    originalPrice: 44.99,
    category: "Sports & Outdoors",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80"
    ],
    inStock: true,
    description: "Keep drinks cold for 24 hours or hot for 12 hours with double-wall vacuum insulation.",
    features: [
      "Double-wall vacuum insulation",
      "24 hours cold / 12 hours hot",
      "BPA-free materials",
      "Wide mouth opening",
      "Leak-proof lid"
    ],
    variants: {
      colors: ["Blue", "Green", "Pink", "Black"],
      sizes: ["18oz", "32oz", "40oz"]
    },
    rating: 4.8,
    reviews: 891,
    trending: false,
    bestSeller: true
  },
  {
    id: 6,
    name: "Wireless Charging Pad",
    price: 39.99,
    originalPrice: 59.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1591290619762-c588dc305b5c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1591290619762-c588dc305b5c?w=800&q=80"
    ],
    inStock: true,
    description: "Fast wireless charging for all Qi-enabled devices. Sleek design with LED indicator.",
    features: [
      "10W fast charging",
      "Qi-certified",
      "LED indicator",
      "Non-slip surface",
      "Overcharge protection"
    ],
    variants: {
      colors: ["Black", "White"],
      sizes: []
    },
    rating: 4.5,
    reviews: 234,
    trending: true,
    bestSeller: false
  },
  {
    id: 7,
    name: "Canvas Backpack",
    price: 79.99,
    originalPrice: 119.99,
    category: "Bags",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&q=80"
    ],
    inStock: true,
    description: "Durable canvas backpack with leather accents. Perfect for daily commute or weekend adventures.",
    features: [
      "Water-resistant canvas",
      "Genuine leather trim",
      "Padded laptop compartment",
      "Multiple pockets",
      "Adjustable straps"
    ],
    variants: {
      colors: ["Navy", "Gray", "Olive"],
      sizes: []
    },
    rating: 4.7,
    reviews: 456,
    trending: false,
    bestSeller: true
  },
  {
    id: 8,
    name: "Aromatherapy Diffuser",
    price: 44.99,
    originalPrice: 69.99,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80"
    ],
    inStock: true,
    description: "Create a relaxing atmosphere with this ultrasonic aromatherapy diffuser. Features color-changing LED lights.",
    features: [
      "Ultrasonic technology",
      "Color-changing LED",
      "Auto shut-off",
      "Whisper-quiet operation",
      "300ml capacity"
    ],
    variants: {
      colors: ["White", "Wood Grain"],
      sizes: []
    },
    rating: 4.6,
    reviews: 789,
    trending: true,
    bestSeller: false
  }
];

// Mock reviews
export const mockReviews = [
  {
    id: 1,
    productId: 1,
    author: "Sarah M.",
    rating: 5,
    date: "2025-10-15",
    title: "Amazing sound quality!",
    content: "These headphones exceeded my expectations. The noise cancellation is fantastic and the battery life is incredible."
  },
  {
    id: 2,
    productId: 1,
    author: "John D.",
    rating: 4,
    date: "2025-10-10",
    title: "Great but pricey",
    content: "Sound quality is excellent, but they are a bit expensive. Still worth it for the features you get."
  },
  {
    id: 3,
    productId: 1,
    author: "Emily R.",
    rating: 5,
    date: "2025-10-05",
    title: "Perfect for work from home",
    content: "I use these daily for video calls and music. The comfort level is outstanding even after hours of use."
  }
];

// Mock orders
export const mockOrders = [
  {
    id: "ORD-2025-001",
    date: "2025-10-18",
    status: "Delivered",
    total: 349.98,
    trackingNumber: "TRK123456789",
    items: [
      { productId: 1, name: "Premium Wireless Headphones", quantity: 1, price: 299.99 },
      { productId: 5, name: "Insulated Water Bottle", quantity: 1, price: 34.99 }
    ]
  },
  {
    id: "ORD-2025-002",
    date: "2025-10-15",
    status: "Shipped",
    total: 199.99,
    trackingNumber: "TRK987654321",
    items: [
      { productId: 2, name: "Smart Fitness Watch", quantity: 1, price: 199.99 }
    ]
  },
  {
    id: "ORD-2025-003",
    date: "2025-10-12",
    status: "Processing",
    total: 124.98,
    trackingNumber: null,
    items: [
      { productId: 3, name: "Minimalist Leather Wallet", quantity: 1, price: 49.99 },
      { productId: 6, name: "Wireless Charging Pad", quantity: 2, price: 39.99 }
    ]
  }
];

