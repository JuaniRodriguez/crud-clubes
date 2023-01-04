const fs=require('fs');
const express=require('express');
const exphbs=require('express-handlebars');
const path=require("path");
const Handlebars = require("handlebars");

const puerto=8080;
const app=express();
const hbs=exphbs.create();

app.use(express.static(path.join(__dirname, '../public')));
app.engine('handlebars',hbs.engine);
app.set('view engine','handlebars');

Handlebars.registerHelper('isNotNull', function (value) {
  return value !== null;
});


app.get('/',(req,res)=> {
  const equipos=JSON.parse(fs.readFileSync('./data/equipos.db.json'))
  res.render('teams', {
    layout:'ui',
    equipos,
  })
})

app.get('/:equipo/:tla/ver',(req,res)=> {
  const equipo=JSON.parse(fs.readFileSync(`./data/equipos/${req.param('tla')}.json`))
  
    res.render('team', {
      layout:'ui',
      data: {
        equipo:`${req.param('equipo')}`,
        address:equipo.address,
        image:equipo.crestUrl,
        plantilla:equipo.squad,
        
      }
    })
    //res.end(`el valor ${req.param('equipo')} y el id es ${req.param('id')}`)
})

app.listen(puerto)


