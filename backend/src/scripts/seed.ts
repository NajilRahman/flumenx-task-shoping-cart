import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';

dotenv.config();

const products = [
  {
    name: "AeroSound Max Headphones",
    description: "Premium wireless over-ear headphones with active noise cancellation and 40-hour battery life.",
    price: 299.99,
    stock: 12,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "KeyFlow Mechanical Keyboard",
    description: "Compact 75% mechanical keyboard with hot-swappable tactile switches and RGB backlighting.",
    price: 129.99,
    stock: 8,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "OptiTrack Wireless Mouse",
    description: "Ergonomic wireless mouse with high-precision optical sensor and customizable buttons.",
    price: 79.99,
    stock: 25,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "UltraVue 27\" Monitor",
    description: "4K UHD IPS monitor with ultra-thin bezels, HDR400 support, and USB-C power delivery.",
    price: 399.99,
    stock: 5,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "HydroFlask Sports Bottle",
    description: "Double-wall vacuum insulated stainless steel water bottle, keeps drinks cold for 24 hours.",
    price: 34.99,
    stock: 50,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "Nomad Leather Backpack",
    description: "Handcrafted full-grain leather backpack with a padded 16-inch laptop sleeve.",
    price: 189.99,
    stock: 7,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "ChargePad Trio",
    description: "3-in-1 wireless charging station for smartphone, smartwatch, and wireless earbuds.",
    price: 59.99,
    stock: 18,
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "FitCore Fitness Tracker",
    description: "Smart fitness tracker with heart rate monitor, sleep tracking, and built-in GPS.",
    price: 99.99,
    stock: 15,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "Lumina Smart Desk Lamp",
    description: "LED desk lamp with adjustable brightness, color temperature, and integrated USB port.",
    price: 49.99,
    stock: 20,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "SoundBar Pro Surround",
    description: "Compact home theater soundbar with Dolby Atmos and wireless subwoofer.",
    price: 249.99,
    stock: 10,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "FocusTime Pomodoro Timer",
    description: "Mechanical rotating countdown timer for improving productivity and time management.",
    price: 19.99,
    stock: 30,
    image: "https://images.unsplash.com/photo-1509136561187-12705b38d6ec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "NeoGrip Phone Mount",
    description: "Magnetic dashboard car mount for all smartphones with secure 360-degree rotation.",
    price: 15.99,
    stock: 40,
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "Vibe Cast USB Microphone",
    description: "Condenser microphone for streaming, podcasting, and gaming, plug-and-play with mute button.",
    price: 89.99,
    stock: 14,
    image: "https://images.unsplash.com/photo-1590608897129-79da98d15969?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "SwiftTravel Power Bank",
    description: "20,000mAh ultra-compact power bank with 22.5W fast charging output.",
    price: 29.99,
    stock: 35,
    image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "CozyGrid Wool Desk Pad",
    description: "Premium merino wool felt desk mat to protect your tabletop and enhance mouse tracking.",
    price: 39.99,
    stock: 22,
    image: "https://images.unsplash.com/photo-1632292224971-0d45778bd364?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "PixelView 4K Webcam",
    description: "Ultra HD 4K webcam with dual noise-reducing microphones and privacy shutter.",
    price: 119.99,
    stock: 16,
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "SonicPulse Portable Speaker",
    description: "Waterproof IPX7 Bluetooth speaker with deep bass and 18-hour continuous playtime.",
    price: 69.99,
    stock: 28,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopping-cart';
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);

    console.log('Clearing existing products and cart items...');
    await Product.deleteMany({});
    await Cart.deleteMany({});

    console.log('Inserting seed products...');
    await Product.insertMany(products);
    console.log(`Database seeded successfully with ${products.length} products.`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
