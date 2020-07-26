import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityContronller from '../controllers/ProviderMonthAvailabilityContronller';
import ProviderDayAvailabilityContronller from '../controllers/ProviderDayAvailabilityContronller';

const providersRouter = Router();

const providersController = new ProvidersController();
const providerMonthAvailabilityContronller = new ProviderMonthAvailabilityContronller();
const providerDayAvailabilityContronller = new ProviderDayAvailabilityContronller();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);

providersRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthAvailabilityContronller.index,
);
providersRouter.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerDayAvailabilityContronller.index,
);
export default providersRouter;
