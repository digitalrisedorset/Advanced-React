import {configDotenv} from "dotenv";
import {list} from "@keystone-6/core";
import {allowAll} from "@keystone-6/core/access";
import {relationship, text} from "@keystone-6/core/fields";
import { cloudinaryImage } from '@keystone-6/cloudinary';

const cloudinary = {
    cloudName: configDotenv().parsed.CLOUDINARY_CLOUD_NAME,
    apiKey: configDotenv().parsed.CLOUDINARY_KEY,
    apiSecret: configDotenv().parsed.CLOUDINARY_SECRET,
    folder: 'drdcommerce'
}

export const ProductImage = list({
    access: allowAll,
    fields: {
        image: cloudinaryImage({
          cloudinary,
          label: 'Source',
        }),
        altText: text(),
        product: relationship({ ref: 'Product.photo' }),
    }
})