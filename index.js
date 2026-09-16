// Закінчити з CRUD операціями.
//     При створенні робити валідацію на імʼя і вік,
//     імʼя повинно бути більше за 3 символи, вік – не менше нуля
// На гет, пут, деліт юзерів перевірити чи такий юзер є в базі.
//     якщо немає – вивести помилку
// Використовуйте шляхи для нових ендпоінтів згідно REST правил

const express = require("express");
const path = require('node:path');
const fs = require('node:fs/promises');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const dbPath = path.join(__dirname, 'users.json');

const getUsers = async () => {
    try {
        const dbData = await fs.readFile(dbPath, 'utf8');
        return dbData ? JSON.parse(dbData) : [];
    } catch (e) {
        console.log('DB error! trying to get users');
    }
}

const setUsers = async (users) => {
    try {
        await fs.writeFile(dbPath, JSON.stringify(users), 'utf8');
    } catch (e) {
        console.log('DB error! trying to set users');
    }
}

const validateUser = ({name='', age=0, email='', password=''}) => {
    const errors = [];

    if (name.length <= 3) {
        errors.push('the name is too short');
    }
    if (age <= 0) {
        errors.push('incorrect age');
    }
    if (typeof email !== "string" || email.trim().length <= 3 || !email.includes('@')) {
        errors.push("incorrect email");
    }
    if (typeof password !== "string" || password.trim().length <= 4) {
        errors.push("incorrect password");
    }

    return errors;
}

const availableFieldNames = ['name', 'email', 'password', 'age'];

app.get('/users', async (req, res) => {
    const users = await getUsers();
    try {
        res.send(users);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.post('/users', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const age = +req.body.age || 0;

        // validate data
        const errors = validateUser({name, age, email, password});
        if (errors.length) {
            return res.status(422).send({
                'message': 'Validation failed',
                'error': errors.join('; ')
            })
        }

        const users = await getUsers();

        const id = users[users.length - 1].id + 1;
        const newUser = {id, name, email, password, age};
        users.push(newUser);

        await setUsers(users);

        res.status(201).send(newUser);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.get('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (Number.isNaN(userId)) {
            return res.status(400).send('Invalid user ID');
        }

        const users = await getUsers();
        const user = users.find(user => user.id === userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.put('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (Number.isNaN(userId)) {
            return res.status(400).send('Invalid user ID');
        }

        const users = await getUsers();
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).send('User not found');
        }
        const {name, email, password} = req.body;
        const age = +req.body.age || 0;

        // validate data
        const errors = validateUser({name, age, email, password});
        if (errors.length) {
            return res.status(422).send({
                'message': 'Validation failed',
                'error': errors.join('; ')
            })
        }

        users[userIndex] = {...users[userIndex], name, email, password, age};

        await setUsers(users);

        res.status(201).send(users[userIndex]);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.patch('/users/:userId', async (req, res) => {
    // console.log(req.body);
    try {
        const userId = Number(req.params.userId);
        if (Number.isNaN(userId)) {
            return res.status(400).send('Invalid user ID');
        }

        const users = await getUsers();
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).send('User not found');
        }

        const newUserData = {...users[userIndex]};
        for (const key of Object.keys(req.body)) {
            if (!availableFieldNames.includes(key)) {
                continue;
            }
            if (key === 'age') {
                newUserData[key] = +req.body.age || 0;
            } else {
                newUserData[key] = req.body[key];
            }
        }

        // validate data
        const errors = validateUser(newUserData);
        if (errors.length) {
            return res.status(422).send({
                'message': 'Validation failed',
                'error': errors.join('; ')
            })
        }

        users[userIndex] = {...newUserData};

        await setUsers(users);

        res.status(200).send(users[userIndex]);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (Number.isNaN(userId)) {
            return res.status(400).send('Invalid user ID');
        }

        const users = await getUsers();
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).send('User not found');
        }
        users.splice(userIndex, 1);

        await setUsers(users);

        res.sendStatus(204);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});