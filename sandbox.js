const bcryptjs = require(`bcryptjs`)
let salt = bcryptjs.genSaltSync(10)
let hash = bcryptjs.hashSync('ilhamsyah', salt)

console.log(hash)