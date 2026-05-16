const {z} = require('zod');

exports.logSchema = z.object({
    level: z.enum(['info', 'warn', 'error']),
    message: z.string(),
    service: z.string(),
    environment: z.enum(['production', 'staging', 'development']).optional()
})
