const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const e = require("express");
const path = require("path");

const app = express();

const conn = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bicicentro"
});


app.get('/',function(req,res){
    res.sendFile(path.join(__dirname ,"Principal.html"));
});


// Lista de trabajadores
app.get("/trabajadores", function (req, res) {
    let sql = "select * from trabajadores";
    conn.query(sql,(err, result, fields) => {
        if(err) throw err;

        res.json(result);
    });

});


// Trabajador con DNI
app.get("/trabajadores/:dni",(req,res) => {

    let id = req.params["dni"];

    let sql = "SELECT\n" +
        "    t.nombres,\n" +
        "    t.apellidos,\n" +
        "    t.correo,\n" +
        "    t.dni,\n" +
        "    t.idsede,\n" +
        "    s.nombreSede\n" +
        "FROM\n" +
        "    trabajadores t\n" +
        "    INNER JOIN sedes s ON t.idsede = s.idsede" +
        " where dni = ?";

    conn.query(sql,[id], (err, result, fields) => {
        if(err) throw err;

        res.json(result);
    });

});


// Obtener las ventas de un trabajador usando el DNI
app.get("/trabajadores/ventas/:dni",(req,res) => {

    let id = req.params["dni"];

    let sql = "SELECT v.fecha, i.nombre, i.numeroserie, m.nombre as marca\n" +
        "FROM trabajadores t \n" +
        "inner join ventas v on t.dni=v.dniTrabajador \n" +
        "inner join inventario i on v.id_inventario=i.idinventario \n" +
        "inner join marcas m on i.idmarca=m.idmarca " +
        "WHERE t.dni=?";

    conn.query(sql,[id], (err, result, fields) => {
        if(err) throw err;

        res.json(result);
    });

});


// Lista de sedes
app.get("/sedes", function (req, res) {
    let sql = "select * from sedes";
    conn.query(sql,(err, result, fields) => {
        if(err) throw err;

        res.json(result);
    });

});

// sede por idsede
app.get("/sedes/:idsede",(req,res) => {

    let id = req.params["idsede"];

    let sql = "SELECT * FROM bicicentro.sedes where idsede=?";

    conn.query(sql,[id], (err, result, fields) => {
        if(err) throw err;

        res.json(result);
    });

});

// sede por idsede
app.get("/sedes/trabajadores/:idsede",(req,res) => {

    let id = req.params["idsede"];

    let sql = "SELECT * FROM bicicentro.trabajadores where idsede = ?";

    conn.query(sql,[id], (err, result, fields) => {
        if(err) throw err;

        res.json(result);
    });

});



// HTMLS
app.get('/listaTrabajadores', function (req, res) {
    let sql = 'SELECT * FROM trabajadores';
    conn.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.render('trabajadores', { trabajadores: result });
    });
});





app.listen(3000,function(){
    console.log("Servidor desplegado correctamente");
});