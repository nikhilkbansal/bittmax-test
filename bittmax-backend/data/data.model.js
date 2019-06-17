
const mongoose = require('mongoose');


/**
   * Video Schema
   * @private
   */
const dataSchema = new mongoose.Schema({

    price: Number,
    quantity: Number,
    sum: Number,
    type: String

}, {
        timestamps: true,
    });


dataSchema.statics = {

    async get() {

        return this.find()
            .exec();
    },


};
module.exports = mongoose.model('Data', dataSchema);
