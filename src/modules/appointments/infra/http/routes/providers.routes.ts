import { Router } from 'express';

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
  providerMonthAvailabilityContronller.index,
);
providersRouter.get(
  '/:provider_id/day-availability',
  providerDayAvailabilityContronller.index,
);

export default providersRouter;
