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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

Handlebars.registerHelper('isNotNull', function (value) {
  return value !== null;
});

function newTeam(team) {
  //necesito esta funcion porque el form me devuelve un objeto, pero "area" es otro objeto dentro de objeto.
  const newTeam= {
    id:team.id,
    area: {
      id:team.areaId,
      name:team.areaName,
    },
    name:team.name,
    shortName:team.shortName,
    tla:team.tla,
    crestUrl:team.crestUrl,
    address:team.address,
    phone:team.phone,
    website:team.website,
    email:team.email,
    founded:team.founded,
    clubColors:team.clubColors,
    venue:team.venue,
    lastUpdated:team.lastUpdated,
  }

  return newTeam;
}


app.get('/',(req,res)=> {
  const equipos=JSON.parse(fs.readFileSync('./data/equipos.db.json'))
  res.render('teams', {
    layout:'ui',
    equipos,
  })
})
//el metodo filter devuelve todo lo que sea true de lo que evalua. Formalmente:
//The filter() method takes a callback parameter, and returns an array containing all values that the callback returned true for. 
app.get('/:equipo/:tla/ver',(req,res)=> {
  const equipos=JSON.parse(fs.readFileSync('./data/equipos.db.json'));
  const equipo=equipos.filter(equipo=>equipo.tla==`${req.param('tla')}`)
  //let plantillaEquipo;
  //try {
  //  plantillaEquipo=JSON.parse(fs.readFileSync(`./data/equipos/AUS.json`));
  //} catch(e) {
  //  plantillaEquipo="";
  //}
  //const plantillaEquipo= JSON.parse(fs.readFileSync(`./data/equipos/${req.param('tla')}.json`));
    res.render('team', {
      layout:'ui',
      data: {
        equipo:equipo[0].name,
        direccion:equipo[0].address,
        imagen:equipo[0].crestUrl,
        //plantilla:(JSON.parse(fs.readFileSync(`./data/equipos/AUS.json`))) ? (JSON.parse(fs.readFileSync(`./data/equipos/AUS.json`))).squad : ""
        //plantilla:JSON.parse(fs.readFileSync(`./data/equipos/${req.param('tla')}.json`)).squad,
        //largar un mensaje ("no hay plantilla ")
      }
    })
})

app.get('/:equipo/:tla/delete',(req,res)=> {
  const equipos=JSON.parse(fs.readFileSync('./data/equipos.db.json'));
  const equiposRestantes=equipos.filter(equipo=>equipo.tla!==`${req.param('tla')}`);
  fs.writeFileSync('./data/equipos.db.json',JSON.stringify(equiposRestantes))
  //res.render('teams', {
  //  layout:'ui',
  //  equipos,
  //})
  //console.log(JSON.stringify(equiposRestantes))
  res.redirect('/')
})

app.listen(puerto)

app.get('/form',(req,res)=> {
  res.render('form', {
    layout:'ui',
  })
})

app.post('/form',(req,res)=> {
  const equipos=JSON.parse(fs.readFileSync('./data/equipos.db.json'));
  equipos.push(newTeam(req.body));
  fs.writeFileSync('./data/equipos.db.json',JSON.stringify(equipos))
  res.redirect('/')

  //res.render('show',{
  //  layout:'ui',
  //  form: {
  //    name:req.body.name,
  //    shortname:req.body.shortname,
  //  }
  //})
  //console.log(req.body.name);
  //console.log(req.body);
  //res.send(req.body)
});

//acomodar que dentro del json hay otro objeto. Y eso impide que acceda a area.name al agregar uno nuevo. Y que si pongo "ver" al nuevo que agrego no me deja porque no existe el json solo de ese equipo.


  
   const plantillaEquipo=JSON.parse(fs.readFileSync(`./data/equipos/AUS.json`));
   console.log(plantillaEquipo)
  
  