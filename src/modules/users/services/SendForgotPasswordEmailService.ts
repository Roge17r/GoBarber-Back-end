import { injectable, inject } from 'tsyringe';
import path from 'path';

import AppError from '@shared/errors/AppError';
import ImailProvider from '@shared/container/providers/MailProvider/models/IEmailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

// import User from '../infra/typeorm/entities/User';

interface IRequest {
  email: string;
}
@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: ImailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokenRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('user does not exists');
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const forgorPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views/forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        file: forgorPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3333/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;