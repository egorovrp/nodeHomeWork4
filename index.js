"use strict"
// Урок 4. Создание REST API с Express
// Для того, чтобы пользователи хранились постоянно, а не только, когда запущен сервер, необходимо реализовать хранение массива в файле.

// Подсказки:
// — В обработчиках получения данных по пользователю нужно читать файл
// — В обработчиках создания, обновления и удаления нужно файл читать, чтобы убедиться, что пользователь существует, а затем сохранить в файл, когда внесены изменения
// — Не забывайте про JSON.parse() и JSON.stringify() - эти функции помогут вам переводить объект в строку и наоборот.

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const joi = require('joi')
const uniqid = require('uniqid');

const userShema = joi.object({
    firstName: joi.string().min(2).required(),
    secondName: joi.string().min(2).required(),
    age: joi.number().min(0).required(),
    city: joi.string().min(0)
})

const userDbPath = path.join(__dirname, './user.json');

app.use(express.json());

app.get('/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync(userDbPath));
    res.send({ users });
});

app.get('/users/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync(userDbPath));
    const findUser = users.find((user) => {
        return user.id === req.params.id;
    });
    res.send({ user: findUser });
});

app.post('/users', (req, res) => {
    const result = userShema.validate(req.body);

    if (result.error) {
        return res.status(404).send({ error: result.error.details });
    }

    uniqueId = uniqid();
    const users = JSON.parse(fs.readFileSync(userDbPath));
    users.push({ id: uniqueId, ...req.body })
    fs.writeFileSync(userDbPath, JSON.stringify(users));
    res.send({ id: uniqueId });
});

app.put('/users/:id', (req, res) => {
    const result = userShema.validate(req.body);

    if (result.error) {
        return res.status(404).send({ error: result.error.details });
    }

    const users = JSON.parse(fs.readFileSync(userDbPath));
    const findUser = users.find((user) => {
        return user.id === +req.params.id;
    })
    if (findUser) {
        findUser.id = req.body.id;
        findUser.firstName = req.body.firstName;
        findUser.secondName = req.body.secondName;
        findUser.age = req.body.age;
        findUser.city = req.body.city;
        fs.writeFileSync(userDbPath, JSON.stringify(users));
        res.send({ user: findUser });
    } else {
        res.send({ user: null });
    }
})

app.delete('/users/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync(userDbPath));
    const findUser = users.findIndex((user) => {
        return user.id === +req.params.id;
    });
    users.splice(findUser, 1);
    fs.writeFileSync(userDbPath, JSON.stringify(users));
    res.send({ id: req.params.id });
});

app.listen(3000, () => {
    console.log('Listen on port 3000');
});