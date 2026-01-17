import { type User, type InsertUser, type Order, type InsertOrder, type Review, type InsertReview, type AdminData } from "@shared/schema";
import { randomUUID } from "crypto";
import { FLAGS } from "./flags";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  getOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  getReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  getAdminData(userId: string): Promise<AdminData | undefined>;
  createAdminData(userId: string, secretData: string, adminFlag?: string): Promise<AdminData>;
  
  // Vulnerable search function for SQL injection
  searchDatabase(query: string, searchType: string): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private orders: Map<string, Order>;
  private reviews: Map<string, Review>;
  private adminData: Map<string, AdminData>;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.reviews = new Map();
    this.adminData = new Map();
    
    // Initialize with admin user for IDOR vulnerability
    this.initializeAdminUser();
    this.initializeSampleData();
  }

  private initializeAdminUser() {
    // Hidden admin user with obfuscated ID
    const adminId = "admin_user_2024";
    const admin: User = {
      id: adminId,
      username: "admin",
      email: "admin@restaurant.com",
      password: "admin123",
      fullName: "Super Admin",
      role: "admin",
      isAdmin: true,
      createdAt: new Date(),
    };
    this.users.set(adminId, admin);
    
    // Also create a decoy admin with ID "1" for misdirection
    const decoyId = "1";
    const decoyAdmin: User = {
      id: decoyId,
      username: "administrator",
      email: "administrator@restaurant.com",
      password: "password123",
      fullName: "System Administrator",
      role: "admin",
      isAdmin: true,
      createdAt: new Date(),
    };
    this.users.set(decoyId, decoyAdmin);

    // Create admin data with flag for real admin
    const adminDataEntry: AdminData = {
      id: randomUUID(),
      userId: adminId,
      secretData: "Admin access granted - all privileges enabled",
      adminFlag: FLAGS.IDOR_ADMIN.flag,
    };
    this.adminData.set(adminId, adminDataEntry);
    
    // Create fake admin data for decoy (no flag)
    const decoyDataEntry: AdminData = {
      id: randomUUID(),
      userId: decoyId,
      secretData: "Limited administrative access",
      adminFlag: null,
    };
    this.adminData.set(decoyId, decoyDataEntry);
  }

  private initializeSampleData() {
    // Add sample orders
    const sampleOrders: Order[] = [
      {
        id: randomUUID(),
        customerId: null,
        customerName: "John Smith",
        items: "Caesar Salad, Grilled Chicken",
        total: "$24.50",
        status: "ready",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        customerId: null,
        customerName: "Sarah Johnson",
        items: "Margherita Pizza, Garlic Bread",
        total: "$32.75",
        status: "cooking",
        createdAt: new Date(),
      },
    ];

    sampleOrders.forEach(order => this.orders.set(order.id, order));

    // Add sample reviews
    const sampleReviews: Review[] = [
      {
        id: randomUUID(),
        customerName: "Sarah M.",
        rating: 5,
        comment: "Great food and excellent service! Will definitely come back.",
        response: "Thank you for your wonderful review!",
        createdAt: new Date(),
      },
    ];

    sampleReviews.forEach(review => this.reviews.set(review.id, review));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "user",
      isAdmin: insertUser.isAdmin || false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      customerId: insertOrder.customerId || null,
      status: insertOrder.status || "pending",
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = { 
      ...insertReview, 
      id,
      response: insertReview.response || null,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    
    return review;
  }

  async getAdminData(userId: string): Promise<AdminData | undefined> {
    return this.adminData.get(userId);
  }

  async createAdminData(userId: string, secretData: string, adminFlag?: string): Promise<AdminData> {
    const adminDataEntry: AdminData = {
      id: randomUUID(),
      userId,
      secretData,
      adminFlag: adminFlag || null,
    };
    this.adminData.set(userId, adminDataEntry);
    return adminDataEntry;
  }

  // Vulnerable search function - intentionally allows SQL injection
  async searchDatabase(query: string, searchType: string): Promise<any[]> {
    // Simulate vulnerable SQL query construction
    const sqlQuery = `SELECT * FROM ${searchType} WHERE name LIKE '%${query}%'`;
    
    // Check for SQL injection patterns
    const isInjection = query.toLowerCase().includes("' or 1=1") ||
                       query.toLowerCase().includes("union select") ||
                       query.toLowerCase().includes("1=1") ||
                       query.includes("--");

    if (isInjection) {
      // Return mock data with flag for successful SQL injection
      return [
        {
          table: searchType,
          query: sqlQuery,
          results: [
            { name: "admin_user", email: "superadmin@restaurant.com", flag: FLAGS.SQL_INJECTION.flag },
            { name: "manager_user", email: "manager@restaurant.com", access: "basic_access" },
            { name: "staff_user", email: "staff@restaurant.com", access: "limited_access" }
          ]
        }
      ];
    }

    // Normal search results
    return [];
  }
}

export const storage = new MemStorage();
