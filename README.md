# Welcome to your Expo app 👋

VeriLens — Counterfeit Capture App (Expo + TypeScript)

Quick start:

1) Install deps

```
npm install
```

2) Start the app

```
npm run android
```

Features implemented (mock backend):

- Demo auth and router guard (`app/_layout.tsx`, `app/login.tsx`)
- Dashboard and My Captures tabs
- Shop entry and Product search (`/capture/new/...`)
- Guided capture for required angles
- Preview and Save (captures geo)
- Mock upload queue with presign + upload + metadata
- Summary screen and retry failed uploads from My Captures

Notes:
- Android permissions for camera and location are set in `app.json`.
- Uploads and APIs are mocked in `lib/api/mock.ts`. Swap with real endpoints later.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
