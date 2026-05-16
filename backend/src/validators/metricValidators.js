const { z } = require("zod");

exports.metricSchema = z.object({
  name: z.string(),
  value: z.number(),
  unit: z.string(),
  service: z.string(),
  environment: z.enum(["production", "staging", "development"]).optional(),
  tags: z.record(z.string(), z.string()).optional(),
});
