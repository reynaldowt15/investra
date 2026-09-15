npm init -y
npm i pg express ejs sequelize
npm i -D sequelize-cli
touch .gitignore => node_modules

==== SETUP ====
npx sequelize init
edit confug/config.json
buat DB = npx sequelize db:create
buat model & query tabel =

- npx sequelize model:create --name Author --attributes name:string,age:integer,gender:string
- npx sequelize model:create --name Book --attributes title:string,isbn:string,price:integer,stock:integer

jalankan file migrasi = npx sequelize db:migrate
buat custome migration = npx sequelize migration:create --name add-FK-to-Books

[FK Docs](https://sequelize.org/api/v6/class/src/dialects/abstract/query-interface.js~queryinterface#instance-method-createTable)

custom migration isi sendiri ('nama table', 'nama kolom'), isi modelnya 'reference kemana?'

jalankan lagi = npx sequelize db:migrate,
cek model, tambahkan colom secara manual

- buat file seeder = npx sequelize seed:create -- name seed-Authors
*1= (baca file json)

- jalankan file seeder = npx sequelize db:seed:all

=== APP ===
set asosiasi di Model

mkdir controllers views
setup express : https://expressjs.com/en/starter/hello-world.html
- view engine : https://expressjs.com/en/guide/using-template-engines.html
- bodyparser : https://www.geeksforgeeks.org/express-js-express-urlencoded-function/
- route : https://expressjs.com/en/starter/basic-routing.html

