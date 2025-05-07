# SF Access Token Decryptor

## Description
This project is designed to decrypt Salesforce login `accessToken` values stored in the `alias.json` file. It allows users to extract and view the decrypted tokens for debugging and development purposes.

## Features
- Parses the `alias.json` file.
- Decrypts encrypted `accessToken` values.
- Displays the decrypted tokens for easy access.
- Lightweight and easy to use.

## Prerequisites
Ensure you have the following installed before using this tool:
- Node.js.

## Usage
```js
import { getOrgsMap, getOrgs, getAlias } from "@hacerx/sf-auth-decrypt";

console.log(await getAlias())
console.log(await getOrgs())
console.log(await getOrgsMap())
```

## Security Warning
**Use this tool responsibly!** Access tokens grant significant privileges, and improper handling may lead to security vulnerabilities. Do not share decrypted tokens and ensure they are stored securely.

## Disclaimer
This project is intended for educational and development use only. The author is not responsible for any misuse or security breaches resulting from its use.

