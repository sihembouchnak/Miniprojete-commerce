import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsService } from './products/products.service';

const products = [
  {
    name: "AI Resume Builder",
    price: 9.99,
    category: "AI Tools",
    description: "Generate professional CV using AI in seconds. Perfect for job seekers.",
    stock: 100,
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&fit=crop"]
  },
  {
    name: "Code Autocompletion Pro",
    price: 19.99,
    category: "AI Tools",
    description: "AI-powered code completion for VS Code, saves 50% development time.",
    stock: 75,
    images: ["https://images.unsplash.com/photo-1517437814255-d123a66f63a9?w=400&fit=crop"]
  },
  {
    name: "Bug Finder AI",
    price: 29.99,
    category: "AI Tools",
    description: "Automatically detects and suggests fixes for code bugs and errors.",
    stock: 50,
    images: ["https://images.unsplash.com/photo-1558494949-ef0d38d3ab97?w=400&fit=crop"]
  },
  {
    name: "DevOps Dashboard",
    price: 49.99,
    category: "Dev Resources",
    description: "Complete DevOps monitoring and deployment toolkit for teams.",
    stock: 30,
    images: ["https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&fit=crop"]
  },
  {
    name: "React Boilerplate Pro",
    price: 39.99,
    category: "Software Tools",
    description: "Production-ready React template with Tailwind, TypeScript, and auth.",
    stock: 80,
    images: ["https://images.unsplash.com/photo-1547658719-da2b848c1f92?w=400&fit=crop"]
  },
  {
    name: "Node.js API Starter",
    price: 24.99,
    category: "Software Tools",
    description: "Full-stack Node.js REST API with MongoDB, JWT auth, and tests.",
    stock: 60,
    images: ["https://images.unsplash.com/photo-1618049353753-787e64a6da96?w=400&fit=crop"]
  },
  {
    name: "AI Image Generator",
    price: 14.99,
    category: "AI Tools",
    description: "Generate stunning images from text prompts using Stable Diffusion.",
    stock: 90,
    images: ["https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&fit=crop"]
  },
  {
    name: "Docker Mastery Kit",
    price: 34.99,
    category: "Dev Resources",
    description: "Complete Docker, Kubernetes, CI/CD learning path and templates.",
    stock: 40,
    images: ["https://images.unsplash.com/photo-1614346426678-2b3dc62e3b62?w=400&fit=crop"]
  },
  {
    name: "Tailwind UI Kit",
    price: 59.99,
    category: "Dev Resources",
    description: "200+ responsive Tailwind components for modern web apps.",
    stock: 25,
    images: ["https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&fit=crop"]
  },
  {
    name: "SQL Query Optimizer",
    price: 12.99,
    category: "Software Tools",
    description: "AI-powered SQL query optimization and database performance tool.",
    stock: 70,
    images: ["https://images.unsplash.com/photo-1518779660304-7ef4a971f5e9?w=400&fit=crop"]
  },
  {
    name: "ChatGPT API Wrapper",
    price: 22.99,
    category: "AI Tools",
    description: "Easy-to-use wrapper for OpenAI API with advanced prompting templates.",
    stock: 55,
    images: ["https://images.unsplash.com/photo-1687360471640-6d4fbcc8802a?w=400&fit=crop"]
  },
  {
    name: "Full-Stack MERN Kit",
    price: 69.99,
    category: "Dev Resources",
    description: "Complete MERN stack e-commerce template ready for production.",
    stock: 20,
    images: ["https://images.unsplash.com/photo-1558494949-ef0d38d3ab97?w=400&fit=crop"]
  },
  {
    name: "Performance Profiler",
    price: 18.99,
    category: "Software Tools",
    description: "Analyze and optimize web app performance with detailed metrics.",
    stock: 85,
    image: "https://images.unsplash.com/photo-1517437814255-d123a66f63a9?w=400&fit=crop"
  },
  {
    name: "AI Content Writer",
    price: 11.99,
    category: "AI Tools",
    description: "Generate blog posts, marketing copy, and social media content instantly.",
    stock: 95,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&fit=crop"
  },
  {
    name: "Cybersecurity Toolkit",
    price: 44.99,
    category: "Dev Resources",
    description: "Essential security tools, checklists, and best practices for developers.",
    stock: 35,
    images: ["https://images.unsplash.com/photo-1614046988866-92b2d691a229?w=400&fit=crop"]
  }
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);

  // Clear existing products
  await productsService.deleteAll();

  for (const product of products) {
    await productsService.create(product);
  }

  console.log('Seeded products');
  await app.close();
}

seed();