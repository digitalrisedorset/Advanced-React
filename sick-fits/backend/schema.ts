import { graphql, list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { relationship, text } from '@keystone-6/core/fields'
import { type Context, type Lists } from '.keystone/types'
import {Order} from "./schemas/Order";
import {CartItem} from "./schemas/CartItem";
import {User} from "./schemas/User";
import {OrderItem} from "./schemas/OrderItem";
import {Product} from "./schemas/Product";
import {ProductImage} from "./schemas/ProductImage";

// WARNING: this example is for demonstration purposes only
//   as with each of our examples, it has not been vetted
//   or tested for any particular usage

export type Session = {
  itemId: string
  data: {
    isAdmin: boolean
  }
}

export const lists = {
  Order,
  CartItem,
  Role: list({
    access: allowAll,
    fields: {
      name: text({isRequired: true}),
      assignedTo: relationship({
        ref: 'User.role', // TODO: Add this to the User
        many: true,
        ui: {
          itemView: { fieldMode: 'read' }
        },
      })
    }
  }),
  User,
  OrderItem,
  Product,
  ProductImage
} satisfies Lists

export const extendGraphqlSchema = graphql.extend(base => {
  const AddToCart = graphql.object()({
    name: 'AddToCart',
    fields: {},
  })

  return {
    mutation: {
      addToCart: graphql.field({
        // base.object will return an object type from the existing schema
        // with the name provided or throw if it doesn't exist
        type: base.object('CartItem'),
        args: { productId: graphql.arg({ type: graphql.nonNull(graphql.ID) }) },
        async resolve (source, { productId }, context: Context) {
          // Note we use `context.db.Post` here as we have a return type
          // of Post, and this API provides results in the correct format.
          // If you accidentally use `context.query.Post` here you can expect problems
          // when accessing the fields in your GraphQL client.
          // context.session = {listKey: User, itemId ='', data: {id, name, email, isAdmin}}
          // context
          //console.log('Add to cart session', context.session)
          //console.log('Add to cart args', productId)

          const session = context.session as Session
          if (!session.itemId) {
            throw new Error('You must be logged in to do this!!')
          }

          const allCartItems = await context.db.CartItem.findMany({
                where: {
                  user: {id: { equals: session.itemId} }, product: {id: { equals: productId} }
                }
          })

          const [existingCartItem] = allCartItems
          if (existingCartItem) {
            console.log(`there is already ${existingCartItem.quantity} in the cart , increment by 1`)

            return await context.db.CartItem.updateOne({
              where: { id: existingCartItem.id },
              data: {quantity: existingCartItem.quantity + 1}
            })
          }

          return await context.db.CartItem.createOne({data: {
              product: { connect: { id: productId } },
              user: { connect: { id: session.itemId} },
              quantity: 1
            }
          })
        },
      }),
    }
  }
})
