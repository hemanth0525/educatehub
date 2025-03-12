
// This is a utility to help move transcript files into the public directory
// This file will not be used in production, just a helper for development

/**
 * To use this utility during development:
 * 
 * 1. Create a /public folder in your project root if it doesn't exist
 * 2. Copy your transcript file (ts.txt) to the /public folder
 * 3. Add the following to vite.config.ts to serve the file:
 *    
 *    server: {
 *      host: "::",
 *      port: 8080,
 *      fs: {
 *        // Allow serving files from one level up to the project root
 *        allow: ['..']
 *      }
 *    },
 */

export {};
