const express = require('express');
const mysql = require('mysql2')
const app = express();
var bodyParser= require('body-parser');
let con = mysql.createConnection({
    host: '168.192.100.6',
    user: 'root',
    database: 'alumnos',
    password: 'Recodo36'
});
con.connect(err =>{
    if(err){
       console.log(err);
    }else{
        console.log('Se conecto a la base de datos');
    } 
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.post('/agregarUsuario', (req, res) =>{
    let {bol} = req.body;
    let{nom} = req.body;
    let{appat} = req.body;
    let{apmat} = req.body;
    let{tel} = req.body;
    sent = `insert into alumnos (bol,nom,appat,apmat,tel) values ("${bol}","${nom}","${appat}","${apmat}","${tel}")`
    con.query(sent, (err,respuesta)=>{
        if(err) return console.log(err)
        return res.send(`
            <div>
                <h1>Boleta: ${bol}<br>
                Nombre: ${nom}<br>
                Apellido Paterno: ${appat}<br>
                Apellido Materno: ${apmat}<br>
                Telefono: ${tel}</h1><br>
                <form action="/verUsuarios" method="get">
                <input type="submit" value="Ver todos los registros">
                </form>
            </div>`)
    })
})
app.get(`/verUsuarios`,(req,res)=>{
    sent = `select * from alumnos`;
    con.query(sent,(err,respuesta)=>{
        if(err) return console.log(err)
        let userHTML = ""
        let i = 0
        respuesta.forEach((user)=>{
            i++
            userHTML+=`<tr>
                <td>${i}</td>
                <td>${user.bol}</td>
                <td>${user.nom}</td>
                <td>${user.appat}</td>
                <td>${user.apmat}</td>
                <td>${user.tel}</td>
                <td><input type="submit" onclick="location.href='/PeditarUsuario?bol=${user.bol}&nom=${user.nom}&appat=${user.appat}&apmat=${user.apmat}&tel=${user.tel}'" value="Editar"></td>
                <td><input type="submit" onclick="location.href='/borrarUsuario?bol=${user.bol}'" value="Borrar"><td>
            </tr>`
        })
        return res.send(`<table>
            <thead>
                <th>Número</th>
                <th>Boleta</th>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Telefono</th>
                <th>Editar</th>
                <th>Borrar</th>
            </thead>
            ${userHTML}
        </table>`)
    })
})
app.get('/borrarUsuario',(req,res)=>{
    let {bol} = req.query;
    sent = `delete from alumnos where bol=${bol}`
    con.query(sent, (err,respuesta)=>{
        if(err) return console.log(err);
        return res.send(`<h1>Usuario Eliminado Correctamente</h1>
        <form action="/verUsuarios" method="get">
            <input type="submit" value="Regresar">
        </form>`)
    }) 
})
app.get('/PeditarUsuario',(req,res)=>{
    let {bol} = req.query;
    let{nom} = req.query;
    let{appat} = req.query;
    let{apmat} = req.query;
    let{tel} = req.query;
    return res.send(`<form action="/editarUsuario" method="get">
        <table>
            <tr>
                <td>Boleta: </td>
                <td><input type="number" name="bol" id="bol" value="${bol}" readonly></td>
            </tr>
            <tr>
                <td>Ingrese el nuevo nombre: </td>
                <td><input type="text" name="nom" id="nom" value="${nom}"></td>
            </tr>
            <tr>
                <td>Ingrese el nuevo apellido paterno: </td>
                <td><input type="text" name="appat" id="appat" value="${appat}"></td>
            </tr>
            <tr>
                <td>Ingrese el nuevo apellido materno: </td>
                <td><input type="text" name="apmat" id="apmat" value="${apmat}"></td>
            </tr>
            <tr>
                <td>Ingrese el nuevo telefono: </td>
                <td><input type="number" name="tel" id="tel" value="${tel}"></td>
            </tr>
            <tr>
                <td rowspan="2"><input type="submit" value="Editar Usuario"></td>
            </tr>
        </table>
    </form>`)
})
app.get('/editarUsuario',(req,res)=>{
    let {bol} = req.query;
    let{nom} = req.query;
    let{appat} = req.query;
    let{apmat} = req.query;
    let{tel} = req.query;
    sent = `update alumnos set nom="${nom}",appat="${appat}",apmat="${apmat}",tel=${tel} where bol=${bol}`
    con.query(sent,(err, respuesta)=>{
        if(err) return console.log(err);
        return res.send(`<h1>Usuario Actualizado Correctamente</h1>
        <form action="/verUsuarios" method="get">
            <input type="submit" value="Regresar">
        </form>`)
    })
})
app.listen(8000, ()=>{
    console.log('escuchando en el puerto 8000');
})