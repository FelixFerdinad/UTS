const { Product } = require('../../../models');

async function createProduct(product_name, price, cathegory, quantity) {
  return Product.create({
    product_name,
    price,
    cathegory,
    quantity,
  });
}


async function getProducts(nomorHalaman, ukuranHalaman, sortir, pencarian) {
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
    const totalCount = await Product.countDocuments(query);

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
      if (fieldName === 'product_name' || fieldName === 'cathegory') {
        sortCriteria = { [fieldName]: -1};
      }
    }

    //mengambil pengguna dari MongoDB
    let products;
    if (ukuranHalaman === 0) {
        products = await Product.find(query).sort(sortCriteria);
    } else {
        products = await Product.find(query)
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
      count : products.length,
      total_pages : pagesTotal, 
      has_previous_page : has_previous_page, 
      has_next_page : has_next_page,
      data: products.map(product => ({
        id: product.id,
        product_name : product.product_name,
        price: product.price,
        cathegory: product.cathegory,
        quantity: product.quantity,
      }))     
    };
  } catch (error) {
      throw new Error(error.message);
  }
};

async function updateProduct(id, product_name, price, cathegory, quantity) {
  return Product.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        product_name,
        price,
        cathegory,
        quantity,
      },
    }
  );
}


async function getProduct(id) {
  return Product.findById(id);
}

async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  getProduct,
  deleteProduct,
  


};