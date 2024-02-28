# Pronunciation Pal
## Introduction
Effective pronunciation is a significant challenge for many language learners, often leading to communication barriers. Pronunciation Pal addresses this issue by offering a user-friendly platform for practice and improvement. The primary target audience includes individuals who are deaf and hard of hearing, language learners across various age groups and proficiency levels, and speech therapy clients.

## Release Notes (Milestone 1)
The components of our project that are currently working for this submission are user authentication as well as a basic word info page. The user authentication uses email, name, and password. For the security of our users, the passwords are hashed and salted before storage. The basic word info page takes text (which can come from speech input) and generates info for the given words, including definition, phonemes, and official audio if available from the API.

There are currently no other branches to review.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
