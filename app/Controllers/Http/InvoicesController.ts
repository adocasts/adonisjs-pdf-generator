import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvoiceValidator from 'App/Validators/InvoiceValidator'
import Route from '@ioc:Adonis/Core/Route'
import Event from '@ioc:Adonis/Core/Event'
import User from 'App/Models/User'

export default class InvoicesController {
  public async send({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(InvoiceValidator)
    const path = Route.makeSignedUrl('pdf.invoice', { uid: auth.user!.id }, { expiresIn: '3m', qs: data })

    Event.emit('send:invoice', {
      user: auth.user,
      recipient: data.recipient,
      signedInvoicePath: path
    })

    return response.redirect().toRoute('home')
  }

  public async generate({ request, response, view, params }: HttpContextContract) {
    if (!request.hasValidSignature()) {
      return response.badRequest('The route signature is invalid.')
    }

    const recipient = request.qs().recipient
    const user = await User.findOrFail(params.uid)

    return view.render('invoice', { user, recipient })
  }
}
