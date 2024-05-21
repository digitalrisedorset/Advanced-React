import { list, graphql } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { relationship, text, timestamp, integer, virtual, password } from '@keystone-6/core/fields'
import formatMoney from '../lib/formatMoney';

export const Order = list({
    access: allowAll,
    fields: {
        label: virtual({
            field: graphql.field({
                type: graphql.String,
                resolve(item) {
                    return `${formatMoney(item.total)}`;
                },
            }),
        }),
        total: integer(),
        items: relationship({ ref: 'OrderItem.order', many: true }),
        user: relationship({ ref: 'User.orders' }),
        charge: text(),
        createdAt: timestamp({
            // default this timestamp to Date.now() when first created
            defaultValue: { kind: 'now' },
        })
    }
})