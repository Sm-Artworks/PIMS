// SYSTEM ARCHITECTURE

/*
 * PHARMACY INVENTORY MANAGEMENT SYSTEM
 * 
 * A comprehensive solution for pharmacies to manage inventory,
 * handle orders, track medications, and generate reports.
 */

// TECH STACK
const techStack = {
  frontend: {
    framework: "React with Next.js",
    ui: "Tailwind CSS with shadcn/ui components",
    stateManagement: "React Query + Context API",
    charts: "Recharts for data visualization"
  },
  
  backend: {
    runtime: "Node.js with Express",
    database: "PostgreSQL with Prisma ORM",
    authentication: "JWT with refresh tokens",
    caching: "Redis for performance optimization",
    api: "RESTful API with OpenAPI/Swagger documentation"
  },
  
  deployment: {
    containerization: "Docker",
    cicd: "GitHub Actions",
    hosting: "AWS or Azure cloud infrastructure"
  }
};

// DATABASE SCHEMA (Prisma format)
const databaseSchema = `
// This is your Prisma schema file for the pharmacy system

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  password      String
  role          Role      @default(STAFF)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  transactions   Transaction[]
  orders        Order[]
}

enum Role {
  ADMIN
  PHARMACIST
  STAFF
}

model Medication {
  id              String    @id @default(uuid())
  name            String
  genericName     String?
  manufacturer    String
  category        String
  dosage          String
  form            String    // tablet, liquid, capsule, etc.
  price           Float
  costPrice       Float
  batchNumber     String
  expirationDate  DateTime
  reorderLevel    Int
  currentStock    Int
  location        String?   // shelf location
  needsPrescription Boolean @default(true)
  barcode         String?
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  transactionItems TransactionItem[]
  orderItems      OrderItem[]
}

model Transaction {
  id              String    @id @default(uuid())
  type            TransactionType
  date            DateTime  @default(now())
  totalAmount     Float
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  items           TransactionItem[]
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum TransactionType {
  SALE
  RETURN
  ADJUSTMENT
  EXPIRY
}

model TransactionItem {
  id              String    @id @default(uuid())
  medicationId    String
  medication      Medication @relation(fields: [medicationId], references: [id])
  transactionId   String
  transaction     Transaction @relation(fields: [transactionId], references: [id])
  quantity        Int
  unitPrice       Float
  amount          Float
}

model Supplier {
  id              String    @id @default(uuid())
  name            String
  contactPerson   String?
  email           String?
  phone           String
  address         String?
  orders          Order[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Order {
  id              String    @id @default(uuid())
  orderNumber     String    @unique
  supplierId      String
  supplier        Supplier  @relation(fields: [supplierId], references: [id])
  status          OrderStatus @default(PENDING)
  orderDate       DateTime  @default(now())
  expectedDelivery DateTime?
  actualDelivery  DateTime?
  items           OrderItem[]
  totalAmount     Float
  notes           String?
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum OrderStatus {
  PENDING
  APPROVED
  SHIPPED
  DELIVERED
  CANCELLED
}

model OrderItem {
  id              String    @id @default(uuid())
  orderId         String
  order           Order     @relation(fields: [orderId], references: [id])
  medicationId    String
  medication      Medication @relation(fields: [medicationId], references: [id])
  quantity        Int
  unitPrice       Float
  amount          Float
}

model Prescription {
  id              String    @id @default(uuid())
  prescriptionNumber String  @unique
  patientName     String
  patientContact  String?
  doctorName      String
  doctorContact   String?
  issueDate       DateTime
  expiryDate      DateTime?
  status          PrescriptionStatus @default(ACTIVE)
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum PrescriptionStatus {
  ACTIVE
  FILLED
  EXPIRED
  CANCELLED
}
`;

// API ENDPOINTS
const apiEndpoints = {
  auth: {
    login: 'POST /api/auth/login',
    logout: 'POST /api/auth/logout',
    refreshToken: 'POST /api/auth/refresh',
    profile: 'GET /api/auth/profile'
  },
  
  medications: {
    list: 'GET /api/medications',
    detail: 'GET /api/medications/:id',
    create: 'POST /api/medications',
    update: 'PUT /api/medications/:id',
    delete: 'DELETE /api/medications/:id',
    search: 'GET /api/medications/search',
    lowStock: 'GET /api/medications/low-stock',
    expiringSoon: 'GET /api/medications/expiring-soon',
    barcodeScan: 'POST /api/medications/scan',
  },
  
  transactions: {
    list: 'GET /api/transactions',
    detail: 'GET /api/transactions/:id',
    create: 'POST /api/transactions',
    update: 'PUT /api/transactions/:id',
    delete: 'DELETE /api/transactions/:id',
  },
  
  suppliers: {
    list: 'GET /api/suppliers',
    detail: 'GET /api/suppliers/:id',
    create: 'POST /api/suppliers',
    update: 'PUT /api/suppliers/:id',
    delete: 'DELETE /api/suppliers/:id',
  },
  
  orders: {
    list: 'GET /api/orders',
    detail: 'GET /api/orders/:id',
    create: 'POST /api/orders',
    update: 'PUT /api/orders/:id',
    delete: 'DELETE /api/orders/:id',
    changeStatus: 'PATCH /api/orders/:id/status',
  },
  
  prescriptions: {
    list: 'GET /api/prescriptions',
    detail: 'GET /api/prescriptions/:id',
    create: 'POST /api/prescriptions',
    update: 'PUT /api/prescriptions/:id',
    delete: 'DELETE /api/prescriptions/:id',
    verify: 'POST /api/prescriptions/verify',
  },
  
  reports: {
    sales: 'GET /api/reports/sales',
    inventory: 'GET /api/reports/inventory',
    expiration: 'GET /api/reports/expiration',
    profit: 'GET /api/reports/profit',
    activity: 'GET /api/reports/activity',
  },
  
  users: {
    list: 'GET /api/users',
    detail: 'GET /api/users/:id',
    create: 'POST /api/users',
    update: 'PUT /api/users/:id',
    delete: 'DELETE /api/users/:id',
  }
};

// FRONTEND PAGES STRUCTURE
const frontendPages = {
  auth: {
    login: '/login',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },
  
  dashboard: {
    main: '/dashboard',
    analytics: '/dashboard/analytics',
  },
  
  inventory: {
    list: '/inventory',
    detail: '/inventory/:id',
    add: '/inventory/add',
    edit: '/inventory/:id/edit',
    lowStock: '/inventory/low-stock',
    expiringSoon: '/inventory/expiring-soon',
  },
  
  transactions: {
    list: '/transactions',
    detail: '/transactions/:id',
    add: '/transactions/add',
    returns: '/transactions/returns',
  },
  
  orders: {
    list: '/orders',
    detail: '/orders/:id',
    add: '/orders/add',
    edit: '/orders/:id/edit',
  },
  
  suppliers: {
    list: '/suppliers',
    detail: '/suppliers/:id',
    add: '/suppliers/add',
    edit: '/suppliers/:id/edit',
  },
  
  prescriptions: {
    list: '/prescriptions',
    detail: '/prescriptions/:id',
    add: '/prescriptions/add',
    verify: '/prescriptions/verify',
  },
  
  reports: {
    main: '/reports',
    sales: '/reports/sales',
    inventory: '/reports/inventory',
    expiration: '/reports/expiration',
    profit: '/reports/profit',
  },
  
  settings: {
    main: '/settings',
    users: '/settings/users',
    profile: '/settings/profile',
    store: '/settings/store',
    backup: '/settings/backup',
  },
};

// BUSINESS LOGIC FEATURES
const keyFeatures = {
  inventoryManagement: [
    "Real-time stock tracking",
    "Barcode scanning support",
    "Batch tracking and expiration management",
    "Automated reorder alerts",
    "Stock location mapping"
  ],
  
  salesProcessing: [
    "Quick sale interface with product search",
    "Prescription verification",
    "Return and refund processing",
    "Customer history tracking",
    "Receipt generation"
  ],
  
  supplierManagement: [
    "Supplier performance tracking",
    "Order history and status tracking",
    "Automated purchase orders based on reorder levels",
    "Multi-supplier product sourcing",
    "Electronic order submission"
  ],
  
  reportingAndAnalytics: [
    "Sales trends and forecasting",
    "Inventory turnover analysis",
    "Profit margin calculation",
    "Expiration risk assessment",
    "User activity auditing"
  ],
  
  security: [
    "Role-based access control",
    "Audit trails for all transactions",
    "Data encryption",
    "Compliance with pharmaceutical regulations",
    "Regular data backups"
  ]
};
