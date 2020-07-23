import IParseMailTemplateDTO from '../dtos/IParseMailemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
