const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers(nomorHalaman, ukuranHalaman, sortir, pencarian) {
    try {
      let query = {};

      // menambahkan fungsi search 
      if (pencarian) {
        const [field, value] = pencarian.split(':'); // Membagi string pencarian untuk mendapatkan nama kolom dan nilai pencarian
        if (field && value) {
          query = {
            [field]: { $regex: value, $options: 'i' } // Menggunakan nilai pencarian dalam ekspresi reguler untuk pencarian yang tidak peka terhadap huruf besar/kecil dan menerima simbol
          };
        }
      }

      // menentukan jumlah total dokumen
      const totalCount = await User.countDocuments(query);

      // membuat variabel sortCriteria 
      let sortCriteria;
      if (sortir === 'desc') {
        sortCriteria = { name: -1 };
      } else {
        sortCriteria = { name: 1 };
      }

      // jika sort berisi 'desc'
      if (sortir.includes(':desc')) {
        const [fieldName, order] = sortir.split(':');
        if (fieldName === 'name' || fieldName === 'email') {
          sortCriteria = { [fieldName]: -1};
        }
      }

      //mengambil pengguna dari MongoDB
      let users;
      if (ukuranHalaman === 0) {
          users = await User.find(query).sort(sortCriteria);
      } else {
          users = await User.find(query)
              .sort(sortCriteria)
              .skip((nomorHalaman - 1) * ukuranHalaman)
              .limit(ukuranHalaman);
      }

      const pagesTotal = Math.ceil(totalCount/ukuranHalaman);
      const has_previous_page = nomorHalaman > 1;
      const has_next_page = nomorHalaman < pagesTotal;

      return { 
        page_number : nomorHalaman,
        page_size : ukuranHalaman,
        count : users.length,
        total_pages : pagesTotal, 
        has_previous_page : has_previous_page, 
        has_next_page : has_next_page,
        data: users.map(user => ({
          id : user.id,
          name: user.name,
          email: user.email,
        }))     
      };
    } catch (error) {
        throw new Error(error.message);
    }
  };

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
