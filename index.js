// Закінчити з CRUD операціями.
//     При створенні робити валідацію на імʼя і вік,
//     імʼя повинно бути більше за 3 символи, вік – не менше нуля
// На гет, пут, деліт юзерів перевірити чи такий юзер є в базі.
//     якщо немає – вивести помилку
// Використовуйте шляхи для нових ендпоінтів згідно REST правил

const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const users = [
    {id: 1, name: 'Maksym', email: 'feden@gmail.com', password: 'qwe123'},
    {id: 2, name: 'Alina', email: 'alindosik@gmail.com', password: 'ert345'},
    {id: 3, name: 'Anna', email: 'ann43@gmail.com', password: 'ghj393'},
    {id: 4, name: 'Tamara', email: 'tomochka23@gmail.com', password: 'afs787'},
    {id: 5, name: 'Dima', email: 'taper@gmail.com', password: 'rtt443'},
    {id: 6, name: 'Rita', email: 'torpeda@gmail.com', password: 'vcx344'},
    {id: 7, name: 'Denis', email: 'denchik@gmail.com', password: 'sdf555'},
    {id: 8, name: 'Sergey', email: 'BigBoss@gmail.com', password: 'ccc322'},
    {id: 9, name: 'Angela', email: 'lala@gmail.com', password: 'cdd343'},
    {id: 10, name: 'Irina', email: 'irka7@gmail.com', password: 'kkk222'},
];

app.get('/users', (req, res) => {
    try {
        res.send(users);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.post('/users', (req, res) => {
    try {
        const {name, email, password} = req.body;
        const age = +req.body.age || 0;

        //TODO validate data
        if (name.length <= 3) {
            return res.status(422).send({
                "message": "Validation failed",
                "error": "the name is too short"
            })
        }
        if (age <= 0) {
            return res.status(422).send({
                "message": "Validation failed",
                "error": "incorrect age"
            })
        }

        const id = users[users.length - 1].id + 1;
        const newUser = {id, name, email, password, age};
        users.push(newUser);
        res.status(201).send(newUser);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.get('/users/:userId', (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const user = users.find(user => user.id === userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.put('/users/:userId', (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).send('User not found');
        }
        const {name, email, password} = req.body;
        const age = +req.body.age || 0;

        //TODO validate data
        if (name.length <= 3) {
            return res.status(422).send({
                "message": "Validation failed",
                "error": "the name is too short"
            })
        }
        if (age <= 0) {
            return res.status(422).send({
                "message": "Validation failed",
                "error": "incorrect age"
            })
        }

        users[userIndex] = {...users[userIndex], name, email, password, age};
        res.status(201).send(users[userIndex]);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.delete('/users/:userId', (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).send('User not found');
        }
        users.splice(userIndex, 1);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});