# Real-time Chat Application

Веб-приложение для обмена сообщениями в реальном времени.

## Технологический стек

### Backend
- **NestJS** + TypeScript
- **TypeORM** с MongoDB
- **Socket.io** для real-time коммуникации
- **JWT** для аутентификации

### Frontend
- **SvelteKit** + TypeScript
- **Socket.io-client** для WebSocket соединения

### Database
- **MongoDB**

## Функциональные возможности

- ✅ Регистрация и авторизация пользователей (JWT)
- ✅ Список всех пользователей системы
- ✅ Создание диалогов между пользователями
- ✅ Отправка и получение текстовых сообщений
- ✅ Real-time обмен сообщениями через WebSocket
- ✅ Отображение имени собеседника в сообщениях

## Структура проекта

```
test-task/
├── backend/          # NestJS приложение
├── frontend/         # SvelteKit приложение
├── docker-compose.yml # Docker конфигурация
└── README.md
```

## Установка и запуск

### Вариант 1: Запуск через Docker (рекомендуется)

1. Убедитесь, что у вас установлены Docker и Docker Compose

2. Запустите все сервисы:
```bash
docker-compose up -d
```

3. Откройте приложение в браузере:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api

4. Для остановки:
```bash
docker-compose down
```

5. Для просмотра логов:
```bash
docker-compose logs -f
```

### Вариант 2: Локальный запуск

#### Требования
- Node.js 20+
- MongoDB (локально или через Docker)

#### Backend

1. Перейдите в директорию backend:
```bash
cd backend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` на основе `.env.example`:
```bash
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=chat_app
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
FRONTEND_URL=http://localhost:5173
```

4. Запустите MongoDB (если не запущен):
```bash
# Через Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Или используйте локально установленный MongoDB
```

5. Запустите backend:
```bash
npm run start:dev
```

Backend будет доступен на http://localhost:3000
Swagger документация: http://localhost:3000/api

#### Frontend

1. Перейдите в директорию frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` (опционально, значения по умолчанию):
```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

4. Запустите frontend:
```bash
npm run dev
```

Frontend будет доступен на http://localhost:5173

## API Documentation

### Swagger UI

После запуска backend, Swagger документация доступна по адресу:
- **http://localhost:3000/api**

