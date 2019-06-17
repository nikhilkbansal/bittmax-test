const dataSchema = require('./users.model')


exports.getData = async (req, res, next) => {
    console.log('reached controller', dataSchema)
    try {
        const data = await dataSchema.get();
        console.log('data', data)
        const buyingData = data.filter(o => {
            console.log('o.type', o.sum, o.type, o)
            return o.type === 'buy'
        });
        console.log('buyingData', buyingData)

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