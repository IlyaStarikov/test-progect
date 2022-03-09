<p align="center">
  <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Backend test project</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Бронирование автомобилей

Проект разработан в качестве тестового задания back-end. Проект использует npm.

## Установка и запуск проекта
Для запуска проекта локально необходимо:

  1. Склонировать репозиторий;
  2. Установить необходимы пакеты и зависимости, выполнив команду:

  ```bash
  $ npm install
  ```
  3. Создать файл .env в корне проекта и заполнить его по шаблону:

  ```bash
  DB_USER = 'USER_NAME'
  DB_DATABASE = 'DATABASE_NAME'
  DB_PASSWORD = 'DATABASE_PASSWORD'
  DB_PORT = DATABASE_PORT
  ``` 

  где:
    DB_USER - имя пользователя базы данных,
    DB_DATABASE - название(имя) базы данных,
    DB_PASSWORD - пароль доступа к базе данных,
    DB_PORT - порт, на котором работает база данных

  4. Запустить приложение с помощью команды:

  ```bash
  $ npm run start
  ``` 
