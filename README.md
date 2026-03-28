# RSS Агрегатор

Фронтенд-проект на Vite (Vanilla JS) и Bootstrap 5.

### Hexlet tests and linter status

[![Actions Status](https://github.com/scrumno/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/scrumno/frontend-project-11/actions)

### CI

[![CI](https://github.com/scrumno/frontend-project-11/actions/workflows/ci.yml/badge.svg)](https://github.com/scrumno/frontend-project-11/actions/workflows/ci.yml)

### Качество кода (SonarCloud)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=scrumno_frontend-project-11&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=scrumno_frontend-project-11)

> Бейдж заработает после привязки репозитория к [SonarCloud](https://sonarcloud.io): создайте проект, добавьте секрет `SONAR_TOKEN` в настройках GitHub-репозитория и при необходимости поправьте `sonar.projectKey` и `sonar.organization` в `sonar-project.properties`.

## Локальный запуск

```bash
npm ci
npm run dev
```

Сборка и превью продакшена:

```bash
npm run build
npm run preview
```

## Деплой (Vercel)

1. Импортируйте репозиторий на [vercel.com](https://vercel.com).
2. Сборка: `npm run build`, выходная папка: `dist` (уже задано в `vercel.json`).
3. После деплоя **вставьте сюда публичный URL**:

**Сайт:** _укажите URL после первого успешного деплоя (например `https://frontend-project-11.vercel.app`)_

## Ограничения курса

Асинхронный код — только через промисы и `.then()` / `.catch()`, без `async`/`await`.
