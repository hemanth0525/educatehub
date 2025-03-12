
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error handling for app rendering
const renderApp = () => {
  try {
    const root = document.getElementById("root");

    if (root) {
      createRoot(root).render(<App />);
    } else {
      console.error("Root element not found");
    }
  } catch (error) {
    console.error("Failed to render app:", error);
    // Display a fallback error message on the page
    const errorElement = document.createElement('div');
    errorElement.style.padding = '20px';
    errorElement.style.margin = '20px';
    errorElement.style.backgroundColor = '#ffebee';
    errorElement.style.border = '1px solid #f44336';
    errorElement.style.borderRadius = '4px';
    
    errorElement.innerHTML = `
      <h2>Something went wrong</h2>
      <p>The application failed to initialize. Please check the console for more details.</p>
      <p>If you're the developer, make sure all environment variables are properly set.</p>
    `;
    
    document.body.appendChild(errorElement);
  }
};

renderApp();
