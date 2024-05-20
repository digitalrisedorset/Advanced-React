import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { text, timestamp, select, checkbox, relationship, integer } from '@keystone-6/core/fields'
import type { Lists } from '.keystone/types'

export const OrderItem = list({
    access: allowAll,
    fields: {
        name: text({ isRequired: true }),
        description: text({
            ui: {
                displayMode: 'textarea',
            },
        }),
        photo: relationship({
            ref: 'ProductImage',
            ui: {
                displayMode: 'cards',
                cardFields: ['image', 'altText'],
                inlineCreate: { fields: ['image', 'altText'] },
                inlineEdit: { fields: ['image', 'altText'] },
            },
        }),
        price: integer(),
        quantity: integer(),
        order: relationship({ ref: 'Order.items' })
    }
})