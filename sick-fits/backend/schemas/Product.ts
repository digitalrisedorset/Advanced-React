import {list} from "@keystone-6/core";
import {allowAll} from "@keystone-6/core/access";
import {integer, relationship, select, text} from "@keystone-6/core/fields";

export const Product = list({
    access: allowAll,
    fields: {
        name: text({ isRequired: true }),
        description: text({
            ui: {
                displayMode: 'textarea',
            },
        }),
        photo: relationship({
            ref: 'ProductImage.product',
            ui: {
                displayMode: 'cards',
                cardFields: ['image', 'altText'],
                inlineCreate: { fields: ['image', 'altText'] },
                inlineEdit: { fields: ['image', 'altText'] },
            },
        }),
        status: select({
            options: [
                { label: 'Draft', value: 'DRAFT' },
                { label: 'Available', value: 'AVAILABLE' },
                { label: 'Unavailable', value: 'UNAVAILABLE' },
            ],
            defaultValue: 'DRAFT',
            ui: {
                displayMode: 'segmented-control',
                createView: { fieldMode: 'hidden' },
            },
        }),
        price: integer(),
        user: relationship({
            ref: 'User.products',
            defaultValue: ({ context }) => ({
                connect: { id: context.session.itemId },
            }),
        })
    }
})