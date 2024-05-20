import { getContext } from '@keystone-6/core/context'
import { products } from './seed-data/data'
import config from './keystone'
import * as PrismaModule from '.myprisma/client'

type ProductProps = {
  name: string,
  description: string,
  status: string,
  price: number,
  photo: {
    id: string,
    filename: string,
    originalFilename: string
    mimetype: string,
    encoding: string,
    _meta: {
      public_id: string,
      version: number,
      signature: string,
      width: number,
      height: number,
      format: string,
      resource_type: string,
      created_at: number,
      tags: [],
      bytes: number,
      type: string,
      etag: string,
      placeholder: false,
      url: string,
      secure_url: string,
      original_filename: string,
    }
  }
}

export async function main () {
  const context = getContext(config, PrismaModule)

  console.log(`🌱 Inserting seed data`)
  const createProduct = async (productData: ProductProps) => {
    // let product = await context.query.Product.findOne({
    //   where: { name: productData.name },
    //   query: 'id',
    // })
    //
    // if (!product) {
      await context.query.Product.createOne({
        data: productData,
        query: 'id',
      })
    //}
  }

  for (const product: ProductProps of products) {
    console.log(`👩 Adding product: ${product.name}`)
    await createProduct(product)
  }

  console.log(`✅ Seed data inserted`)
  console.log(`👋 Please start the process with \`yarn dev\` or \`npm run dev\``)
}

main()
