
# 🛒 Spring Boot + Angular E-commerce Website

This is a full-stack web application that simulates an e-commerce platform. It uses **Spring Boot** for the backend and **Angular** for the frontend.

---

## 🏗️ Project Structure

```
SpringBootAngularWebsite/
├── front-end/              # Angular project (frontend)
├── src/                    # Java Spring Boot source code (backend)
├── pom.xml                 # Maven build config for backend
└── README.md               # Project description
```

---

## 🌟 Features

### 🧑‍💻 Customer Side:
- Browse products
- View product details
- Add products to shopping cart
- Purchase items with card

### 🛠️ Backend (Spring Boot):
- RESTful APIs for:
  - Product listing
  - Order processing
  - Customer management
- Configurable with MySQL (can be extended)
- Structured in standard Spring Boot MVC architecture

### 🎨 Frontend (Angular):
- Responsive user interface
- Routing between product, cart, and checkout pages
- Calls backend REST API for data

---

## ⚙️ Technologies Used

| Layer      | Tech Stack               |
|------------|--------------------------|
| Frontend   | Angular (TypeScript)     |
| Backend    | Spring Boot (Java)       |
| Build Tool | Maven                    |
| UI         | HTML, CSS, Bootstrap     |

---

## 🚀 How to Run

### Prerequisites:
- Node.js and Angular CLI installed
- Java 11+ and Maven installed
- MySQL running (if needed for full functionality)

### Run Frontend (Angular):
```bash
cd front-end
npm install
ng serve
```

Visit: http://localhost:4200

### Run Backend (Spring Boot):
```bash
cd src
mvn spring-boot:run
```

API available at: http://localhost:8080/api/...

---

## 📦 Notes

- Angular files are in `front-end/`
- Backend Java code is under `src/`
- You can configure DB connection in `application.properties` if needed
