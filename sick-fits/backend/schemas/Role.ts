import {list} from "@keystone-6/core";
import {allowAll} from "@keystone-6/core/access";
import {relationship, text} from "@keystone-6/core/fields";

export const Role = list({
    access: allowAll,
    fields: {
        name: text({isRequired: true}),
        assignedTo: relationship({
            ref: 'User.role', // TODO: Add this to the User
            many: true,
            ui: {
                itemView: { fieldMode: 'read' },
            },
        })
    }
})