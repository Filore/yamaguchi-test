# Yamaguchi test task

## Локальный запуск:

```sh
npm ci
npm run dev
```

Откройте [http://localhost:5173/].

Остановка:

Ctrl + C


## Запуск через Docker:

```sh
docker build -t yamaguchi-test .
docker run --rm -p 8080:80 yamaguchi-test
```

Откройте [http://localhost:8080].

Остановка:

Ctrl + C

