# Banking App Frontend

This repository contains the frontend of our Banking App project for Fullstack Web Development.  
The frontend is built as a Single Page Application (SPA) using Vue and Vite.

## Project purpose

The purpose of this application is to provide the user interface for a banking system.  
Customers and employees will be able to interact with the backend through a REST API.

The frontend will communicate with the Spring Boot backend to support features such as:
- user login and registration
- viewing accounts
- viewing transactions
- transferring money
- ATM-related actions
- employee approval flows

## Tech stack

- Vue
- Vite
- JavaScript
- REST API communication with fetch
- Storybook

## Project structure

```text
src/
  assets/
  components/
  utils/
    api.js
  App.vue
  config.js
  main.js
public/
.storybook/
index.html
vite.config.js
package.json