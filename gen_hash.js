const bcrypt = require('bcryptjs');
const password = process.env.ADMIN_PASSWORD;
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
require('fs').writeFileSync('hash_out.txt', hash);
console.log('DONE');
