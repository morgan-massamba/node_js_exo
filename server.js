require('dotenv').config();
const http = require('http');
const fs = require('fs');

//DAY JS ET FORMAT EN FRANCAIS
const dayjs = require('dayjs');
require('dayjs/locale/fr');
dayjs.locale('fr');

let students = [
    { name: 'Sonia', birth: '2019-05-14', id: 1 },
    { name: 'Antoine', birth: '2000-05-12', id: 2 },
    { name: 'Alice', birth: '1990-09-14', id: 3 },
    { name: 'Sophie', birth: '2001-02-10', id: 4 },
    { name: 'Bernard', birth: '1980-08-21', id: 5 },
];

const server = http.createServer((req, res) => {
    const url = req.url.replace('/', '');
    const { method } = req;

    //HOME PAGE
    if (url === '') {
        try {
            const file = fs.readFileSync('./view/home.html');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(file);
        } catch (error) {
            res.writeHead(500);
        }
        res.end();

        // CSS
    } else if (url === 'style.css') {
        try {
            const file = fs.readFileSync('./assets/css/style.css');
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(file);
        } catch (error) {
            res.writeHead(500);
        }
        res.end();

        // USERS -> cas où on l'on va sur la page users via le lien de la navbar
    } else if (url === 'users' && method === 'GET') {
        let block = `<!DOCTYPE html>
                    <html lang="fr">
                    <head>
                        <meta charset="UTF-8" />
                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <link href="style.css" rel="stylesheet" />
                        <title>Home</title>
                    </head>
                    <body>
                        <nav class="navbar navbar-expand-lg navbar-light bg-light">
                        <span class="navbar-brand" href="#">Node JS APP</span>
            
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav mr-auto">
                                <li class="nav-item">
                                    <a class="nav-link" href="/">Home</a>
                                </li>
                                <li class="nav-item active">
                                    <a class="nav-link" href="/users">Users</a>
                                </li>
                            </ul>
                        </div>
                        </nav>

                        <h1 class="my-5 text-center">Liste des étudiants</h1>

                        <table class='table table-striped table-bordered w-75 mx-auto'>
                            <thead>
                                <tr>
                                    <th scope='col'>Prénom</th>
                                    <th scope='col'>Date de naissance</th>
                                    <th scope='col'></th>
                                </tr>
                            </thead>
                            <tbody>
                        `;
        students.forEach((item) => {
            block += `<tr>
                        <td class='align-middle'>${item.name}</td>
                        <td class='align-middle'>${dayjs(item.birth).format(
                            'D MMMM YYYY'
                        )}</td>
                        <td><a class='btn btn-sm btn-danger' href='delete/${
                            item.id
                        }'>Supprimer</a></td>
                    </tr>
                    `;
        });
        block += ' </tbody></table></body></html>';
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(block);
        res.end();

        // USERS -> cas où l'on envoie le formulaire avec la methode POST et redirection vers la page users
    } else if (url === 'users' && method === 'POST') {
        let block = `<!DOCTYPE html>
                    <html lang="fr">
                    <head>
                        <meta charset="UTF-8" />
                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <link href="style.css" rel="stylesheet" />
                        <title>Home</title>
                    </head>
                    <body>
                    <nav class="navbar navbar-expand-lg navbar-light bg-light">
                        <span class="navbar-brand" href="#">Node JS APP</span>
            
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav mr-auto">
                                <li class="nav-item">
                                    <a class="nav-link" href="/">Home</a>
                                </li>
                                <li class="nav-item active">
                                    <a class="nav-link" href="/users">Users</a>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <h1 class="my-5 text-center">Liste des étudiants</h1>

                    <table class='table table-striped table-bordered w-75 mx-auto'>
                        <thead>
                            <tr>
                                <th scope='col'>Prénom</th>
                                <th scope='col'>Date de naissance</th>
                                <th scope='col'></th>
                            </tr>
                        </thead>
                        <tbody>
                        `;
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            const requestBody = data.replace('&', '=').split('=');
            const name = requestBody[1];
            const birth = requestBody[3];

            if (name !== '' && birth !== '') {
                const id = Date.now();
                const newStudent = { name, birth, id };
                students.push(newStudent);
            }

            students.forEach((item) => {
                block += `<tr>
                            <td class='align-middle'>${item.name}</td>
                            <td class='align-middle'>${dayjs(item.birth).format(
                                'D MMMM YYYY'
                            )}</td>
                            <td><a class='btn btn-sm btn-danger' href='delete/${
                                item.id
                            }'>Supprimer</a></td>
                        </tr>
                        `;
            });
            block += ' </tbody></table></body></html>';
            res.writeHead(201, { 'Content-Type': 'text/html' });
            res.write(block);
            res.end();
        });

        //DELETE USER -> recupérer l'id et filtrer sur le tableau students
    } else if (req.url.includes('delete')) {
        let studentId = req.url.split('/')[2];
        students = students.filter((item) => item.id != studentId);
        res.writeHead(301, { Location: '/users' });
        res.end();
    } else {
        res.writeHead(200);
        res.end();
    }
});

server.listen(process.env.APP_PORT, () => {
    console.log(
        `Server running at http://${process.env.APP_LOCALHOST}:${process.env.APP_PORT}/`
    );
});
