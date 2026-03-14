# Clear-Path Frontend 🚀

Clear-Path is a high-performance, modular project management dashboard designed for SaaS environments. This frontend is built with a focus on scalability, type safety, and a premium user experience.

## 🛠 Tech Stack

- **Framework:** [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **API Handling:** [Axios](https://axios-http.com/) with Interceptor pattern
- **Icons:** [Lucide React](https://lucide.dev/)

## 🏗 Architecture

The project follows a **Feature-Based Modular Architecture**. Instead of grouping files by type (all components in one folder), we group by business domain to ensure the codebase remains maintainable as it grows.

```text
src
 ├── app         # Global providers and router configuration
 ├── components  # Reusable UI primitives (Buttons, Inputs, Modals)
 ├── features    # Domain-specific logic (Auth, Projects, Tasks)
 ├── layouts     # Persistent structures (Dashboard, Auth layouts)
 ├── services    # API client and global endpoints
 └── store       # Global state slices
