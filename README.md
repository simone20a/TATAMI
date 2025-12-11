# TokenFlow

This repository contains the `nextn` tool. Follow the instructions below to set up and run the project locally.

## Requirements

Before you begin, ensure you have the following installed on your machine:

- **Node.js**: Version 18.17 or later (v20+ recommended).
- **npm**: Generally comes bundled with Node.js.

## Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd TATAMI
    ```

2.  **Install dependencies**:
    Run the following command to install the necessary packages using npm:
    ```bash
    npm install
    ```
    *Alternatively, if you use yarn or pnpm:*
    ```bash
    yarn install
    # or
    pnpm install
    ```

3.  **Run the Application**:
    Build and start the application in development mode:
    ```bash
    npm run build
    npm run start
    ```
    The application typically starts at `http://localhost:3000` (or the port specified in the console).



## Project Structure

```text
TATAMI
├── examples/                  # Case studies and Solidity translations
│   ├── AMM.xml
│   ├── AMM_translation/
│   ├── Auction.xml
│   ├── Auction_translation/
│   ├── FoodReborn.xml
│   └── FoodReborn_translation/
├── src/                       # Source code
│   ├── app/
│   ├── components/
│   ├── hooks/
│   └── lib/
├── package.json
├── README.md
└── tsconfig.json
```

The `examples` folder contains case studies modeled using the language, along with their corresponding Solidity translations.
