/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import Event from '@ioc:Adonis/Core/Event'
import User from 'App/Models/User'
import puppeteer from 'puppeteer'
import Mail from '@ioc:Adonis/Addons/Mail'
import { string } from '@ioc:Adonis/Core/Helpers'

interface SendInvoice {
  user: User
  recipient: { name: string, email: string }
  signedInvoicePath: string
}

Event.on('send:invoice', async ({ user, recipient, signedInvoicePath }: SendInvoice) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`http://localhost:3333${signedInvoicePath}`, { waitUntil: 'networkidle0' })
  await page.emulateMediaType('screen')
  const pdf = await page.pdf({ format: 'a4' })

  await Mail.send(message => {
    message
      .from(user.email, 'Adocasts')
      .to(recipient.email)
      .attachData(pdf, { filename: `${string.snakeCase(recipient.name)}_invoice.pdf` })
      .subject(`Invoice for ${recipient.name}`)
      .text('Hello! Please find your invoice attached.')
  })
})