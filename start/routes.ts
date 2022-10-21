/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

// AUTH
Route.post('/auth/login', 'AuthController.login').as('auth.login')
Route.post('/auth/register', 'AuthController.register').as('auth.register')
Route.get('/auth/logout', 'AuthController.logout').as('auth.logout')

// INVOICE
Route.get('/pdf/invoice/:uid', 'InvoicesController.generate').as('pdf.invoice')
Route.post('/invoice/send', 'InvoicesController.send').as('invoice.send').middleware(['auth'])

Route.get('/', async ({ view }) => {
  return view.render('welcome')
}).as('home')
