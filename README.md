# Appa Backend API

<p align="center">
  <img src="./public/appa.png" width="200" alt="Appa Logo" /></a>
</p>

## Installation

1. clone the repo

    ```bash
    git clone https://github.com/kwadwoatta/appa-api.git
    ```

2. cd into the repo

    ```bash
    cd appa-api
    ```

3. copy .env.example to .env and fill them out

4. install all dependencies

    ```bash
    pnpm install
    ```

5. [download docker](https://www.docker.com/products/docker-desktop/)

6. start the mongodb (database) service

    ```bash
    docker compose up -d
    ```

7. seed the 3 users accounts

    ```ts
    pnpm tsx db/seed.ts 
    ```

8. start the app in development mode

    ```bash
    pnpm start:dev
    ```

9. visit url in Postman

    ```bash
    http://localhost:3000/api/
    ```

10. login with one of the seeded users

    ```ts
    {
        "email": "customer@gmail.com",
        "password": "password"
    }
    ```

11. copy access token and set as authorization header for subsequent requests

    ```graphql
    Authorization: Bearer {your access token}
    ```
