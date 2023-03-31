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

// Ini live coding
// app.get('/', (req, res) => {
//     res.send('Hello FSW 3 yang luar biasa dari server nih !');
// })

// app.post('/', (req, res) => {
//     res.send('Kita bisa ngelakuin Post di url ini');
// })

// app.get('/person', (req, res) => {
//     res.status(200).json({
//         status: 'success',
//         data: {
//             persons: persons
//         }
//     })
// })

// get person by id
// :id itu ngedefine url parameter, bisa juga ditambah parameternya
// contoh /person/:id/:name

// ini live coding dan daily task
app.get('/person/:id', (req, res) => {
    // console.log(req)
    // id ini adalah string, bukan integer
    // console.log(req.params);

    // jadi diakalin pakai dibawah ini
    const id = req.params.id * 1;

    // find ini adalah array method, persons adalah array
    const person = persons.find(el => el.id === id);
    // console.log(person)

    // JIKA ID PERSON TIDAK DITEMUKAN MAKA AKAN MEMBERIKAN RESPON FAILED
    if (!person) {
        res.status(400).json({
            status: 'failed',
            message: `Person dengan id ${id} tersebut tidak ditemukan`
        })
    } else {
        // JIKA ID PERSON ADA MAKA AKAN MEMBERIKAN RESPON SUCCESS DAN MENAMPILKAN DATA
        res.status(200).json({
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
    // karena id adalah string, maka harus dibuat integer
    const id = req.params.id * 1;
    const personIndex = persons.findIndex(el => el.id === id);

    //AGE TIDAK BOLEH KURANG DARI 18
    const cukupUmur = req.body.age < 18

    if (personIndex !== -1) {
        persons[personIndex] = { ...persons[personIndex], ...req.body };
        fs.writeFile(
            `${__dirname}/person.json`,
            JSON.stringify(persons),
            errr => {
                // JIKA UMUR KURANG DARI 18 MAKA AKAN MENGHASILKAN RESPON FAILED
                if (cukupUmur) {
                    res.status(400).json({
                        status: 'failed',
                        message: `Umur ${req.body.age} belum cukup umur`,
                    })
                } else {
                    // JIKA UMUR SUDAH SESUAI MAKA AKAN MEMBERIKAN RESPON SUCCESS DAN MENAMPILKAN DATA
                    res.status(200).json({
                        status: "success",
                        message: `Data dari id ${id} berhasil berubah`,
                        data: persons[personIndex]
                    })
                }
            }
        )
    } else {
        // JIKA ID TIDAK DITEMUKAN MAKA AKAN MENGHASILKAN RESPON NOT FOUND
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
    if (!person) {
        res.status(400).json({
            status: 'failed',
            message: `Person dengan id ${id} tersebut invalid/gak ada`
        })
    }

    // console.log(index)
    if (index !== -1) {
        persons.splice(index, 1);
    }

    fs.writeFile(
        `${__dirname}/person.json`,
        JSON.stringify(persons),
        errr => {
            res.status(200).json({
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

    // VALIDASI KALAU NAMENYA SUDAH ADA, MAKA TIDAK BISA CREATE DATA BARU
    const personName = persons.find(el => el.name === req.body.name);
    // console.log(personName)

    // VALIDASI APAKAH UMUR KURANG DARI 18
    const cukupUmur = req.body.age < 18
    // VALIDASI APAKAH KARAKTER HURUF PADA NAMA KURANG DARI 3
    const nameLength = req.body.name.length < 3

    if (personName) {
        // VALIDASI APAKAH NAME SUDAH ADA
        res.status(400).json({
            status: 'failed',
            message: `Name ${req.body.name} already exists`
        })
    } else if (nameLength) {
        // VALIDASI APAKAH JUMLAH KARAKTER HURUF PADA NAME KURANG DARI 3
        res.status(400).json({
            status: 'failed',
            message: `Name ${req.body.name} kurang dari 3`
        })
    }
    else if (cukupUmur) {
        // VALIDASI APAKAH UMUR KURANG DARI 18
        res.status(400).json({
            status: 'failed',
            message: `Umur ${req.body.age} belum cukup umur`
        })
    } else {
        // MEMBUAT DATA BARU APABILA SEMUA SUDAH SESUAI
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