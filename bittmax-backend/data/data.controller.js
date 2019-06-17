const dataSchema = require('./data.model')


exports.getData = async (req, res, next) => {
    console.log('reached controller', dataSchema)
    try {
        const data = await dataSchema.get();
        const buyingData = data.filter(o => {
            return o.type === 'buy'
        });

        const sellingData = data.filter(o => o.type === 'sell');
        res.send({
            buying: {
                data: buyingData
            }, selling: {
                data: sellingData
            }
        })
    }
    catch (error) {
        res.send(error)
    }
}