import Joi from 'joi';

export const OPTIONS_VALIDATOR =
  Joi.object().keys({
    cacheLocation: Joi.string(),
    cleanOnExit: Joi.boolean().required()
  }).required();

export function defaultOptions() {
  return {
    cleanOnExit: false
  }
};
