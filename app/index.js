// carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const morgan = require('morgan')
const path = require('path')
const mongoose = require('mongoose')
const app = express()
const route = require('./routes/admin')
const session = require('express-session')
const flash = require('connect-flash') 
// configurações  
    //sessão
        app.use((session({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: true
        })))
        app.use(flash())
    // middleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg   = req.flash('error_msg')
            next()
        })
    // body-parser
        app.use(morgan('dev'))
        app.use(express.json())
        app.use(express.urlencoded({extended:true}))
    // handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout:'index'}))
        app.set('view engine', 'handlebars')
    // mongoose
        mongoose.connect('mongodb://localhost/blogapp')
        .then(()=>{
            console.log('conectado ao mongo')
        })
        .catch((err)=>{
            console.log('erro ao se conectar com o mongo' + err)
        })
    // public
        app.use(express.static(path.join(__dirname + 'public'))) 
// rotas
        app.use('/admin', route)
// outros
const _PORT = 8081
app.listen(_PORT,()=>console.log(`online into port:${_PORT}`))
