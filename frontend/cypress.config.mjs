import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      port: 5173,
    },
  },
  
  port: 8080,
  video: false,
  viewportWidth: 1280,
  viewportHeight: 720
}) 