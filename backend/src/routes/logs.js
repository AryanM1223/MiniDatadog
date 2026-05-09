const express = require('express');
const { writeApi , Point } = require('../influx');
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

module.exports = router;