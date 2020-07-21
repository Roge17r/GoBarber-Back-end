import { Provider } from 'tsyringe';

export default interface IMailProvider {
  sendMail(to: string, body: string): Promise<void>;
}
