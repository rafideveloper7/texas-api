const generateOrderNumber = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TG-';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

<<<<<<< HEAD
module.exports = generateOrderNumber;
=======
module.exports = generateOrderNumber;
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
