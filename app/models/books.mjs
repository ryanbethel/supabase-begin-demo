import data from '@begin/data'
import { validator } from '@begin/validator'
import { Book } from './schemas/book.mjs'

// const deleteBook = async function (key) {
//   await data.destroy({ table: 'books', key })
//   return { key }
// }

// const upsertBook = async function (book) {
//   return data.set({ table: 'books', ...book })
// }

// const getBook = async function (key) {
//   return data.get({ table: 'books', key })
// }

// const getBooks = async function () {
//   const databasePageResults = await data.page({
//     table: 'books',
//     limit: 25
//   })

//   let books = []
//   for await (let databasePageResult of databasePageResults) {
//     for (let book of databasePageResult) {
//       delete book.table
//       books.push(book)
//     }
//   }

//   return books
// }

const validate = {
  shared (req) {
    return validator(req, Book)
  },
  async create (req) {
    let { valid, problems, data } = validate.shared(req)
    if (req.body.key) {
      problems['key'] = { errors: '<p>should not be included on a create</p>' }
    }
    // Insert your custom validation here
    return !valid ? { problems, book: data } : { book: data }
  },
  async update (req) {
    let { valid, problems, data } = validate.shared(req)
    // Insert your custom validation here
    return !valid ? { problems, book: data } : { book: data }
  }
}

export {
  deleteBook,
  getBook,
  getBooks,
  upsertBook,
  validate
}


const supabaseId = process.env.SUPABASE_ID
const supabaseKey = process.env.SUPABASE_KEY
async function upsertBook(book) {
  try {
    const response = await fetch(`https://${supabaseId}.supabase.co/rest/v1/books`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': 'Bearer ' + supabaseKey,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(book)
    });

    const data = await response.json();
    return data
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getBook(key) {
  try {
    const response = await fetch(`https://${supabaseId}.supabase.co/rest/v1/books?key=eq.${key}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': 'Bearer ' + supabaseKey,
        'Range': '0-0'
      },
    });

    const data = await response.json();
    return data?.[0]
  } catch (error) {
    console.error('Error:', error);
  }
}
async function getBooks() {
  try {
    const response = await fetch(`https://${supabaseId}.supabase.co/rest/v1/books?select=*`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': 'Bearer ' + supabaseKey,
      },
    });

    const data = await response.json();
    return data
  } catch (error) {
    console.error('Error:', error);
  }
}

async function deleteBook(key) {
  try {
    const response = await fetch(`https://${supabaseId}.supabase.co/rest/v1/books?key=eq.${key}`, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseKey,
        'Authorization': 'Bearer ' + supabaseKey,
      },
    });

  } catch (error) {
    console.error('Error:', error);
  }
}
