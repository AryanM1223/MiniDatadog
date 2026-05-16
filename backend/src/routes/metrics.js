const express = require('express');
const { metricSchema } = require('../validators/metricValidators');
const { Point, writeApi, queryApi } = require('../influx');
const { success } = require('zod');

const router = express.Router();

router.post('/',async(req,res) =>{
    try{
        const validated = metricSchema.parse(req.body);
        const point = new Point('metrics')
            .tag('service', validated.service)
            .tag('name', validated.name)
            .floatField('value', validated.value)
            .tag('unit', validated.unit);
        if(validated.environment){
            point.tag('environment', validated.environment);
        }
        writeApi.writePoint(point);
        await writeApi.flush();
        const io = req.app.get('io');
        io.emit("new-metric", {
            name: validated.name,
            value: validated.value,
            unit: validated.unit,
            service: validated.service,
            environment: validated.environment,
            timestamp: new Date().toISOString(),
        });

        res.status(200).json({
            success: true,
            message:"Metric stored"
        })
    }
    catch(error){
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
})

router.get('/', async(req,res) => {
    const { service, name, environment,timeRange = '-1h' } = req.query;
    try {
        const filters = [];
        if (service) filters.push(`r["service"]=="${service}"`);
        if (name) filters.push(`r["name"]=="${name}"`);
        if (environment) filters.push(`r["environment"]=="${environment}"`);

        const dynamicFilter = filters.length > 0 ? `|> filter(fn: (r) => ${filters.join(' and ')})` : '';

        const query = `
            from(bucket: "${process.env.INFLUX_BUCKET}")
            |>range(start: ${timeRange})
            |> filter(fn: (r) => r["_measurement"] == "metrics")
            ${dynamicFilter}
            |> sort(columns: ["_time"], desc: true)
            |> limit(n: 100)
        `;

       
        const rows = await queryApi.collectRows(query);

    res.status(200).json({
        success: true,
        count: rows.length,
        data:rows,
    });

    } catch (error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
    }
})

module.exports = router;