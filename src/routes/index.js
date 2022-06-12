const compression = require('compression');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const logger = require('../loggers/logger');

const numCPUs = require('os').cpus().length;

router.get('/', (req, res, next) => {
    console.log(`port: ${PORT} -> Fyh: ${Date.now()}`);
    res.send(`Servidor express <span style="color:blueviolet;">(Nginx)</span> en ${PORT} - <b>PID ${process.pid}</b> - ${new Date().toLocaleString()}`);
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

router.get('/signin', (req, res, next) => {
    res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
}));

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.get('/profile', isAuthenticated, (req, res, next) => {
    res.render('profile');
});

// Object Process
router.get('/info', compression(), (req, res, next) => {
    const info = {
        so: process.platform,
        node: process.version,
        memoria: process.memoryUsage(),
        titulo: process.title,
        path: process.path,
        id: process.pid,
        directorio: process.cwd(),
        cpu: numCPUs
    }

    res.json(info);
});

// Api Randoms
router.post('/randoms/:cant', (req, res, next) => {
    const num = req.params.cant;

    if (num){
        const calculo = fork(path.resolve(__dirname, '../func/randoms.js'));
        calculo.send('start', num);
        calculo.on('message', resultado => {
            res.json({ resultado });
        })
    } else {
        const calculo = fork(path.resolve(__dirname, '../func/randoms.js'));
        calculo.send('start', 1e8);
        calculo.on('message', resultado => {
            res.json({ resultado });
        })
    }
});

// middlewares
function isAuthenticated(req, res, next) { // para verificar si esta autenticado antes de acceder a una ruta
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/');
};

module.exports = router;