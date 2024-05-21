import {graphql, list} from '@keystone-6/core'
import {allowAll} from '@keystone-6/core/access'
import {relationship, text} from '@keystone-6/core/fields'
import {type Context, type Lists} from '.keystone/types'
import {Order} from "./schemas/Order";
import {CartItem} from "./schemas/CartItem";
import {User} from "./schemas/User";
import {OrderItem} from "./schemas/OrderItem";
import {Product} from "./schemas/Product";
import {ProductImage} from "./schemas/ProductImage";
import stripeConfig from "./lib/stripe";

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
  return {
    mutation: {
      addToCart: graphql.field({
        type: base.object('CartItem'),
        args: { productId: graphql.arg({ type: graphql.nonNull(graphql.ID) }) },
        async resolve (source, { productId }, context: Context) {
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
      checkout: graphql.field({
        type: base.object('Order'),
        args: { token: graphql.arg({ type: graphql.nonNull(graphql.String) }) },
        async resolve (source, { token }, context: Context) {
          const session = context.session as Session
          const userId = session.itemId
          if (!userId) {
            throw new Error('You must be logged in to do this!!')
          }

          const user = await context.query.User.findOne({
            where: { id: userId },
            query: `
              id
              name
              email
              cart {
                id
                quantity
                product {
                  name
                  price
                  description
                  id
                  photo {
                    id
                    image {
                      id
                      publicUrlTransformed
                    }
                  }
                }
              }
            `
          })
          console.dir(user, { depth: null })

          const cartItems = user.cart.filter((cartItem /* CartItemCreateInput*/) => cartItem.product)
          const amount = user.cart.reduce(
              (tally, cartItem) => tally + cartItem.quantity * cartItem.product.price, 0
          )

          console.log(amount)
          const charge = await stripeConfig.paymentIntents.create({
            amount,
            currency: 'GBP',
            confirm: true,
            payment_method: token,
            return_url: 'https://www.digitalrisedorset.co.uk/'
          }).catch(err => {
            console.log(err)
            throw new Error(err.message)
          })

          const orderItems = cartItems.map(cartItem=> {
            return {
              name: cartItem.product.name,
              description: cartItem.product.description,
              price: cartItem.product.price,
              quantity: cartItem.quantity,
              photo: {connect: {id: cartItem.product.photo.id}}
            }
          })

          const order = await context.db.Order.createOne({
            data: {
              total: charge.amount,
              charge: charge.id,
              items: { create: orderItems },
              user: { connect: { id: userId }}
            }
          })

          const cartItemIds = cartItems.map(cartItem => ({id: cartItem.id}))
          await context.db.CartItem.deleteMany({
            where: cartItemIds
          })

          return order
        }
      })
    }
  }
})
