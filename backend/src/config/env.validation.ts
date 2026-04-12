import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    DATABASE_URL: Joi.string().required(),
    JWT_ACCESS_SECRET: Joi.string().min(32).required().messages({
        'string.min': 'JWT_ACCESS_SECRET must be at least 32 characters long',
        'string.base': 'JWT_ACCESS_SECRET must be a string',
        'any.required': 'JWT_ACCESS_SECRET is required',
    }),
    JWT_ACCESS_EXPIRES_IN: Joi.string()
        .pattern(/^\d+[smhd]$/)
        .required()
        .messages({
            'string.pattern.base': 'JWT_ACCESS_EXPIRES_IN must be a string in the format of a number followed by s, m, h, or d (e.g., 60s, 15m, 1h, 7d)',
            'any.required': 'JWT_ACCESS_EXPIRES_IN is required',
        }),
    JWT_REFRESH_SECRET: Joi.string().min(32).required().messages({
        'string.min': 'JWT_REFRESH_SECRET must be at least 32 characters long',
        'string.base': 'JWT_REFRESH_SECRET must be a string',
        'any.required': 'JWT_REFRESH_SECRET is required',
    }),
    JWT_REFRESH_EXPIRES_IN: Joi.string()
        .pattern(/^\d+[smhd]$/)
        .required()
        .messages({
            'string.pattern.base': 'JWT_ACCESS_EXPIRES_IN must be a string in the format of a number followed by s, m, h, or d (e.g., 60s, 15m, 1h, 7d)',
            'any.required': 'JWT_ACCESS_EXPIRES_IN is required',
        }),
});