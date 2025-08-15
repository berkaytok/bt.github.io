import App from './App.svelte';
import './global.css';
import { startRouting } from './lib/route.js';  // Updated import path

startRouting();

const app = new App({
  target: document.getElementById('app')
});

export default app;