const express = require('express');
const { writeApi , Point , queryApi } = require('../influx');
const { logSchema } = require('../validators/logValidators');

const router = express.Router();

router.post('/', async (req,res) => {
    try {
        const validated= logSchema.parse(req.body);

        const point = new Point('logs')
            .tag('service', validated.service)
            .tag('level', validated.level)
            .stringField('message', validated.message);

        if(validated.environment){
            point.tag('environment', validated.environment);
        }

        writeApi.writePoint(point);
        await writeApi.flush();

        res.status(200).json({
            success: true,
            message: 'Log stored',
        });

    } catch (error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
    }
})

router.get('/', async(req,res) => {
const { service, level, environment,timeRange = '-1h' } = req.query;
try {
    const filters = [];
    if (service) filters.push(`r["service"]=="${service}"`);
    if (level) filters.push(`r["level"]=="${level}"`);
    if (environment) filters.push(`r["environment"]=="${environment}"`);

    const dynamicFilter = filters.length > 0 ? `|> filter(fn: (r) => ${filters.join(' and ')})` : '';

    const query = `
            from(bucket: "${process.env.INFLUX_BUCKET}")
            |>range(start: ${timeRange})
            |> filter(fn: (r) => r["_measurement"] == "logs")
            ${dynamicFilter}
            |> limit(n: 100)
        `;

        const rows = await queryApi.collectRows(query);

    res.status(200).json({
        success: true,
        count: rows.length,
        data:rows,
    });
}
catch (error) {
    console.error("Flux Query Error:", error);
    res.status(500).json({
        success: false,
        error: error.message
    });
}
})

module.exports = router;