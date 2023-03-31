// Live Coding dan Daily Task

//import atau panggil package yang mau kita pake di aplikasi kita
const express = require('express');
// fs ini agar bisa membaca file json
// ini termasuk build in package
const fs = require("fs");

const app = express();
const PORT = 3000;

// ini middleware, biar json kebaca
app.use(express.json());

// ini buat ngebaca file jsonnya (proses baca file json dengan fs module, dan json nya dibantu dibaca dengan JSON.parse)
const persons = JSON.parse(fs.readFileSync(`${__dirname}/person.json`))

// url utama dari aplikasi
// req = request
// res = response
// req, res sudah struktur dari expressnya, jangan diubah

app.get('/', (req, res) => {
    res.send('Hello FSW 3 yang luar biasa dari server nih !');
})

app.post('/', (req, res) => {
    res.send('Kita bisa ngelakuin Post di url ini');
})

app.get('/person', (req, res) => {
    res.status(200).json ({
        status: 'success',
        data: {
            persons : persons
        }
    })
})

// get person by id
// :id itu ngedefine url parameter, bisa juga ditambah parameternya
// contoh /person/:id/:name
app.get('/person/:id', (req, res) => {
    // console.log(req)
    // id ini adalah string, bukan integer
    // console.log(req.params);

    // jadi diakalin pakai dibawah ini
    const id = req.params.id * 1;

    // find ini adalah array method, persons adalah array
    const person = persons.find(el => el.id === id);
    // console.log(person)

    if(!person) {
        res.status(400).json({
            status: 'failed',
            message: `Person dengan id ${id} tersebut tidak ditemukan`
        })
    } else {
        res.status(200).json ({
            status: 'success',
            data: {
                person
            }
        })
    }
})

// daily task pertama
// gimana cara edit data sesuai yang dimau
// konsep get by id digabung dengan konsep create by id
// HTTP Method PUT = edit existing data
app.put('/person/:id', (req, res) => {
    const id = req.params.id * 1;
    const personIndex = persons.findIndex(el => el.id === id);
    const cukupUmur = req.body.age < 18

    if (personIndex !== -1) {
      persons[personIndex] = { ...persons[personIndex], ...req.body };
      fs.writeFile(
        `${__dirname}/person.json`,
        JSON.stringify(persons),
        errr => {
            if (cukupUmur) {
                res.status(400).json({
                    status: 'failed',
                    message: `Umur ${req.body.age} belum cukup umur`,
                })
            } else {
                res.status(200).json({
                    status: "success",
                    message: `Data dari id ${id} berhasil berubah`,
                    data: persons[personIndex]
                })
            }
        }
    )
    } else {
        res.status(404).json({
        status: 'fail',
        message: `Data dengan id ${id} tidak ditemukan`
      });
    }
  });

// HTTP Method DELETE = delete existing data
app.delete('/person/:id', (req, res) => {
    const id = req.params.id * 1;

    const index = persons.findIndex(element => element.id === id);
    const person = persons.find(el => el.id === id);

    // apakah personnya ga ada
    if(!person) {
        res.status(400).json({
            status: 'failed',
            message: `Person dengan id ${id} tersebut invalid/gak ada`
        })
    }

    // console.log(index)
    if(index !== -1) {
        persons.splice(index, 1);
    }

    fs.writeFile(
        `${__dirname}/person.json`,
        JSON.stringify(persons),
        errr => {
            res.status(200).json ({
                status: 'success',
                message: `Data dari id ${id} nya berhasil dihapus`,
                data: {
                    person
                }
            })
        }
    )
    
})

// daily task
// bikin validasi juga
// res ini buat ngeberhentiin dari req.body ini agar tidak terus ngeloading
app.post('/person', (req, res) => {

    // console.log(persons.length - 1)
    const newId = persons.length - 1 + 10;
    const newPerson = Object.assign({ id: newId }, req.body)

    // // insert data lebih dari 1 namanya bulk
    // sequelize.bulkCreate()

    // // insert data hanya satuan
    // sequelize.create()

    // get satuan
    // sequelize.findOne()

    // update data
    // sequelize

    // validasi kalau namenya udah ada, maka gak bisa crate data baru
    const personName = persons.find(el => el.name === req.body.name);
    // console.log(personName)

    const cukupUmur = req.body.age < 18
    const nameLength = req.body.name.length < 3
    if(personName) {
        res.status(400).json({
            status: 'failed',
            message: `Name ${req.body.name} already exists`
        })
    } else if (nameLength) {
        res.status(400).json({
            status: 'failed',
            message: `Name ${req.body.name} kurang dari 3`
        })
    } 
    else if (cukupUmur) {
        res.status(400).json({
            status: 'failed',
            message: `Umur ${req.body.age} belum cukup umur`
        })
    } else {
        persons.push(newPerson);
        fs.writeFile(
            `${__dirname}/person.json`,
            JSON.stringify(persons),
            errr => {
                res.status(201).json({
                    status: 'success',
                    message: 'Data berhasil ditambahkan',
                    data: {
                        person: newPerson
                    }
                })
            }
        )
    }
})


// ini adalah http server
// ini adalah package, jika bingung dengan code buka dokumentasi resminya expressjs.com
// memulai server
app.listen(PORT, () => {
    console.log(`This app running on localhost: ${PORT}`)
})