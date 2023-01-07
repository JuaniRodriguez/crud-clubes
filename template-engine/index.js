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
  const equipo=equipos.filter(equipo=>equipo.tla==`${req.params['tla']}`)

    res.render('team', {
      layout:'ui',
      data: {
        name:equipo[0].name,
        crestUrl:equipo[0].crestUrl,
        address:equipo[0].address,
        website:equipo[0].website,
        founded:equipo[0].founded,
        squad: (fs.existsSync(`./data/equipos/${req.params['tla']}.json`)) ? JSON.parse(fs.readFileSync(`./data/equipos/${req.params['tla']}.json`)).squad : ""
      }
    })
})

app.get('/:equipo/:tla/delete',(req,res)=> {
  const equipos=JSON.parse(fs.readFileSync('./data/equipos.db.json'));
  const equiposRestantes=equipos.filter(equipo=>equipo.tla!==`${req.params['tla']}`);
  fs.writeFileSync('./data/equipos.db.json',JSON.stringify(equiposRestantes))
  fs.unlinkSync(`./data/equipos/${req.params['tla']}.json`);

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
  fs.writeFileSync(`./data/equipos/${req.body.tla}.json`,JSON.stringify(req.body))
  res.redirect('/')

});


app.get('/:equipo/:tla/edit',(req,res)=> {
  const equipos=JSON.parse(fs.readFileSync('./data/equipos.db.json'));

  const equipo=equipos.filter(equipo=>equipo.tla==`${req.params['tla']}`);
  console.log(equipo)
  console.log(equipo[0].name)
  res.render('editForm', {
    layout:'ui',
    data: {
      id:equipo[0].id,
      area: {
        id:equipo[0].area.id,
        name:equipo[0].area.name,
      },
      name:equipo[0].name,
      shortName:equipo[0].shortName,
      tla:equipo[0].tla,
      crestUrl:equipo[0].crestUrl,
      address:equipo[0].address,
      phone:equipo[0].phone,
      website:equipo[0].website,
      email:equipo[0].email,
      founded:equipo[0].founded,
      clubColors:equipo[0].clubColors,
      venue:equipo[0].venue,
      lastUpdated:(equipo[0].lastUpdated).slice(0,-10),

      //plantilla: (fs.existsSync(`./data/equipos/${req.param('tla')}.json`)) ? JSON.parse(fs.readFileSync(`./data/equipos/${req.param('tla')}.json`)).squad : ""
    }

  })
})
app.post('/:equipo/:tla/edit',(req,res)=> {

  const equipos=JSON.parse(fs.readFileSync('./data/equipos.db.json'));
  const equiposRestantes=equipos.filter(equipo=>equipo.tla!==`${req.body.tla}`);
  //fs.writeFileSync('./data/equipos.db.json',JSON.stringify(equiposRestantes));
  equiposRestantes.push(newTeam(req.body));
  fs.writeFileSync('./data/equipos.db.json',JSON.stringify(equiposRestantes));
  res.redirect('/')

})

//acomodar que dentro del json hay otro objeto. Y eso impide que acceda a area.name al agregar uno nuevo. Y que si pongo "ver" al nuevo que agrego no me deja porque no existe el json solo de ese equipo.

 //minimizar el uso de equipos.db.json, y usarlo solo para sacar nombre de listado de equipos. 