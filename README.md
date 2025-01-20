# Angular Dynamic UI Project

[Deployed at VERCEL](https://angular-template-page.vercel.app/home)

Welcome to the **Angular Dynamic UI Project**, a modern, responsive web application built with Angular and Angular Material. This project demonstrates how to create a highly customizable and dynamic user interface by leveraging JSON-based configurations and Angular standalone components.

## **Features**
- **Dynamic Configuration**: 
  - Menu items, sidebars, footers, and other UI elements are fully configurable through JSON files.
  - Seamless updates to the UI without touching the codebase—just update the JSON configurations.

- **Responsive Design**:
  - Built with Angular Material to ensure a modern and fluid UI on all devices.
  - Mobile-friendly navigation, including a collapsible sidebar and dropdown menus.

- **Core Components**:
  - **Top Menu**:
    - Fully configurable items (e.g., Home, About Us, Services, Contact) with properties like `enabled`, `sticky`, and `transparent`.
    - Integrated language switcher for multi-language support.
  - **Sidebar**:
    - Dynamically loads submenu items based on the active page.
    - Configurable toggle behavior and content adjustment for mobile and desktop views.
  - **Footer**:
    - Sticky and configurable with JSON for visibility and behavior.
  - **Language Switcher**:
    - Dropdown menu for selecting languages.
    - Loads dynamically from JSON with `enabled` options for each language.

- **JSON-Driven UI**:
  - All UI behaviors (menu items, sidebar, footer, language switcher) are driven by JSON files, allowing non-developers to update configurations easily.

## **Getting Started**

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Angular CLI](https://angular.io/cli) (v15 or higher)

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/andricolae/angular-template-page.git

2. Navigate to the project directory:
   ```bash
   cd angular-template-page

3. Install dependencies:
   ```bash
   npm install

4. Start the development server
   ```bash
   npm start
