const mongoose = require('mongoose');
const configSchema = new mongoose.Schema(
    {
        _immutable: {
            type: Boolean,
            default: true,
            required: true,
            unique : true,
            immutable: true,
        },

        customColors: Array,
        customFlavor: Array,
        specialRequestOptions: Array,
        customMessageLength: Number,
    },
    {
        collection:'config',
    }
);

const Config = mongoose.model( 'config', configSchema );
module.exports = Config;


// use to update:
//Config.updateOne( {}, { customColors: [] });