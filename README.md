# MellWeb (MELLSTROY Casino Web Platform)

A responsive, high-performance web platform featuring modern casino UI, bottom-sheet authentication modals, comprehensive international country code picker, and interactive widgets.

## Features

- **Authentication System (`/login` & In-App Modal)**:
  - Default tab set to Email login with toggle support for Phone login.
  - Social authentication shortcuts (Google, Yandex, Telegram, Mail.ru, Odnoklassniki).
  - Modern bottom-sheet modal on mobile devices with smooth slide-up animation and centered card presentation on desktop.
  - Seamless mode toggle between Login and Registration.

- **International Country & Dial Code Picker**:
  - Full catalog of international dialing codes with circular flag emblems and localized country names.
  - Top priority shortcuts for common CIS regions (Russia `+7`, Ukraine `+380`, Kazakhstan `+7`) followed by alphabetical ordering.
  - Real-time instant search filtering by country name and dial code.
  - Matching slide-up bottom sheet animation.

- **Responsive Architecture**:
  - Mobile-first responsive styling with clean safe-area insets (`viewport-fit=cover`).
  - Dark mode aesthetic with custom purple gradients, CSS variables, and fluid typography.

- **Deployment**:
  - Optimized for static and serverless hosting (Vercel configured via `vercel.json`).
  - Built-in local development server via Python (`server.py`).

## Getting Started

### Local Development
To run the local server on port 8080:

```bash
python3 server.py
```

Then visit [http://localhost:8080](http://localhost:8080) or [http://localhost:8080/login](http://localhost:8080/login).
