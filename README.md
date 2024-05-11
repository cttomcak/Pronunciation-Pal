# Pronunciation Pal
## Introduction
Effective pronunciation is a significant challenge for many language learners, often leading to communication barriers. Pronunciation Pal addresses this issue by offering a user-friendly platform for practice and improvement. The primary target audience includes individuals who are deaf and hard of hearing, language learners across various age groups and proficiency levels, and speech therapy clients.

## Milestone 1 Release Notes
The components of our project that are currently working for this submission are user authentication as well as a basic word info page. The user authentication uses email, name, and password. For the security of our users, the passwords are hashed and salted before storage. The basic word info page takes text (which can come from speech input) and generates info for the given words, including definition, phonemes, and official audio if available from the API.

## Milestone 2 Release Notes
The major development for this milestone was the main page. We implemented functionality and styling for the word search feature, where with the help of a free dictionary API, our code would output all the phonemes and visemes for the pronunciation of that word. For example, inputting the word 'test' into the textbox would output the definition, the phonemes, the pronunciation, and images for the necessary facial positions to pronounce the word (along with a short description of each position).

Also important, we have gathered the necessary speech sound diagrams and have uploaded them in the static folder alongside the visemes that currently appear on the site. We have not yet implemented the functionality to make them appear when using the word search feature, but that will come soon.

We also added a couple other components, like a global layout in +layout.svelte that provides a header and footer for all the pages on our site.

There are currently no other branches to review besides 'main'.

## Milestone 3 Release Notes
In this milestone, we added support with our back-end for OpenAI's Whisper speech-to-text model. This is for two reasons: 1. So that speech-to-text transcription is available on every browser, no matter what operating system you're on, and 2. Because it is one of the highest quality models, being more likely able to transcribe bad pronunciations. These are both necessary for our web application.

The branch that needs to be looked at for this milestone is the 'add-whisper' branch, which is most up to date, not main. To see the limited back-end NodeJS code that makes calls to the Whisper API, go to this repository: https://github.com/cttomcak/questionable-whisper-backend. We can provide the API key if needed, as it is not stored in the repository.

## Milestone 4 Release Notes
Since milestone 3, we have implemented a few new features into Pronunciation Pal. We began implementing a new, gamified experience for users to interact with the application, with various visual features and score-tracking in order to make it more appealing. We also implemented an option to view speech-sound diagrams instead of images of a human face, and we added the relevant phoneme to the label on each card so that users can now see both the viseme and phoneme associated with the displayed image. There's also another branch where Colin's honors extension code (initially in python) has been ported into the svelte project (branch name is colin-extension).

## Milestone 5 Release Notes
In milestone 5, we added the previously separate Whisper AI API backend into the project, integrating it so you only have to run one command. We also added a favorites feature for users. We made a lot of CSS changes, improving the look of the site, specifically the login, register, and profile pages. Next, we added selenium tests, typedoc comments, and generated documentation. We also added the ability to for one phoneme to map to multiple visemes, improving accuracy. We added a delete button for searched words in the main page. The main branch is the most up to date.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To build a docker image of the application run:

```bash
docker build . -t pronunciationpal:v1.0
```

Then, to run it as a container, use the following

```bash
docker run -p 3000:3000 pronunciationpal:v1.0
```

The version numbers may be set to whatever by changing v1.0 to any other version.

You can preview the production build with `npm run preview`.
