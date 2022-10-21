import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(RegisterValidator)
    const user = await User.create(data)

    await auth.login(user)

    return response.redirect().toRoute('home')
  }

  public async login({ request, response, session, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    try {
      await auth.attempt(email, password)
    } catch (_) {
      session.flash('errors.login', ['Email or password was incorrect'])
    }

    return response.redirect().toRoute('home')
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.logout()

    return response.redirect().toRoute('home')
  }
}
