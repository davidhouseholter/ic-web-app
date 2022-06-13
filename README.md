# Internet Computer Boilerplate

This project is just a simple ViteJS boilerplate ready to go with a basic example of the Internet Computer application.

- Sign Up with [Internet Identity](https://identity.ic0.app/)
- Create User Profiles with IC User Principle
- Basic CRUD Calls

## Stack Used

- [PNPM](https://pnpm.io/)
- [ViteJS](https://vitejs.dev/)
- [Typescript](https://www.typescriptlang.org/)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/#/) & [Lint-staged](https://github.com/okonet/lint-staged)
- [TailwindCSS](https://tailwindcss.com/)
- [ChakraUI](https://chakra-ui.com/)
- [FontSource](https://fontsource.org/)
- [Emotion](https://emotion.sh/)
- [Twin.macro](https://github.com/ben-rogerson/twin.macro)

## Getting Started

Install all dependencies with pnpm

```bash
pnpm install
```

Install all dependencies of [ICP](https://internetcomputer.org/docs/current/developer-docs/build/install-upgrade-remove/)

```bash
 sh -ci "$(curl -fsSL https://smartcontracts.org/install.sh)"
```


Start the Replica, deploy the Internet Identity Canister, and depploy the "API" canister and generate the Typescript declarations.  

```bash
 pnpm ic:start-clean
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start the replica later using the start script.

```bash
 pnpm ic:start
```

