declare const window: any;

export const environment = {
  production: false,
  mock: true,
  apiUrl: window.__env?.apiUrl || 'http://localhost:3000',
};