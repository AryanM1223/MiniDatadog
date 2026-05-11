const {z} = require('zod');

exports.logSchema = z.object({
    level: z.enum(['info', 'warn', 'error']),
    message: z.string(),
    service: z.string(),
    environment: z.enum(['production', 'staging', 'development']).optional()
})

exports.metricSchema = z.object({
    name:z.string(),
    value:z.number(),
    unit:z.string(),
    service:z.string(),
    environment:z.enum(['production', 'staging', 'development']).optional(),
    tags: z.record(z.string(), z.string()).optional()
})