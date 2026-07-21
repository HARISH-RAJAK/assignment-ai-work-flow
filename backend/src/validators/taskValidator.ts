import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Title is required',
  }),
  inputText: Joi.string().min(1).required().messages({
    'string.empty': 'Input text is required',
  }),
  operationType: Joi.string()
    .valid('uppercase', 'lowercase', 'reverse', 'word_count')
    .required()
    .messages({
      'any.only': 'Operation type must be uppercase, lowercase, reverse, or word_count',
      'string.empty': 'Operation type is required',
    }),
});
