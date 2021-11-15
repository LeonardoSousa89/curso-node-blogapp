const express = require('express')
const router  = express.Router()
const mongoose = require('mongoose')
require('../models/categoria')
const Categoria = mongoose.model('categorias')

router.route('/').get(async(req,res)=>{
    res.render('admin/index')
})

router.route('/posts').get(async(req,res)=>{
    res.send('página de posts')
})

router.route('/categorias').get(async(req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao listar as categorias!')
        res.redirect('/admin')
    })
})

router.route('/categorias/add').get(async(req,res)=>{
    res.render('admin/addcategoria')
})

router.route('/categorias/nova').post(async(req,res)=>{

    var erros = []

    if(!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null){
        erros.push({texto: 'Nome inválido!'})
    }
    if(!req.body.slug || typeof req.body.slug === undefined || req.body.slug === null){
        erros.push({texto: 'Slug inválido!'})
    }

    if(req.body.nome.length < 2){
        erros.push({texto:'Nome da categoria é muito pequeno!'})
    }

    if(erros.length > 0){
        res.render('admin/addcategoria',{erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(()=>{
            req.flash('success_msg','Categoria cadastrada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash('error_msg','Houve um ero ao cadastrar a categoria!')
            res.redirect('/admin')
        })
    }

})

router.route('/categorias/edit/:id').get(async(req,res)=>{
    Categoria.findOne({_id: req.params.id}).then((categoria)=>{
        res.render('/admin/editcategoria', {categoria: categoria})
    }).catch((err)=>{
        req.flash('error_msg', 'Esta categoria não existe')
        res.redirect('/admin/categorias')
    })
})

router.route('/categorias/edit').post(async(req,res)=>{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash('success_msg','Categoria editada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao salvar a edição da categoria!')
            res.redirect('/admin/categorias')
        })
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao editar a categoria!')
        res.redirect('/admin/categorias')
    })

})

router.route('categorias/deletar').post(async(req,res)=>{
    Categoria.remove({_id: req.body.id}).then(() =>{
        req.flash('success_msg','Categoria deletada com sucesso!')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao deletar a categoria!')
        res.redirect('/admin/categorias')
    })
})

module.exports = router