import { config } from '@keystone-6/core'
import { fixPrismaPath } from './example-utils'
import type { TypeInfo } from '.keystone/types'
import { withAuth } from "./auth";
import { statelessSessions } from '@keystone-6/core/session';
import { type Session, lists, extendGraphqlSchema } from './schema'


// WARNING: you need to change this
const sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --'

// statelessSessions uses cookies for session tracking
//   these cookies have an expiry, in seconds
//   we use an expiry of one hour for this example
const sessionMaxAge = 60 * 60

export default withAuth<TypeInfo<Session>>(
    config<TypeInfo>({
      server: {
        cors: { origin: ['http://localhost:3001'], credentials: true },
        port: 3000,
        maxFileSize: 200 * 1024 * 1024,
        extendExpressApp: async (app, commonContext) => { /* ... */ },
        extendHttpServer: async (httpServer, commonContext) => { /* ... */ },
      },
      db: {
        provider: 'sqlite',
        url: process.env.DATABASE_URL || 'file:./keystone-example.db',

        // WARNING: this is only needed for our monorepo examples, dont do this
        ...fixPrismaPath,
      },
      lists,
      graphql: {
         extendGraphqlSchema
      },
      ui: {
        // only admins can view the AdminUI
        isAccessAllowed: (context) => {
            return true
          return context.session?.data?.isAdmin ?? false
        },
      },
      // you can find out more at https://keystonejs.com/docs/apis/session#session-api
      session: statelessSessions({
        // the maxAge option controls how long session cookies are valid for before they expire
        maxAge: sessionMaxAge,
        // the session secret is used to encrypt cookie data
        secret: sessionSecret,
      })
    })
)
