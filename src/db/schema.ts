import {boolean, integer, pgEnum, pgTable, primaryKey, text, timestamp,} from "drizzle-orm/pg-core";
import type {AdapterAccountType} from "@auth/core/adapters";

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    surname: text("surname").notNull(),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", {mode: "date"}),
    image: text("image"),
    password: text("password").notNull(),
});

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, {onDelete: "cascade"}),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        {
            compoundKey: primaryKey({
                columns: [account.provider, account.providerAccountId],
            }),
        },
    ]
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, {onDelete: "cascade"}),
    expires: timestamp("expires", {mode: "date"}).notNull(),
});

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        email: text("email").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", {mode: "date"}).notNull(),
    },
    (verificationToken) => [
        {
            compositePk: primaryKey({
                columns: [
                    verificationToken.identifier,
                    verificationToken.token,
                    verificationToken.email,
                ],
            }),
        },
    ]
);

export const resetPasswordTokens = pgTable(
    "resetPasswordToken",
    {
        identifier: text("identifier")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        email: text("email").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", {mode: "date"}).notNull(),
    },
    (resetPasswordToken) => [
        {
            compositePk: primaryKey({
                columns: [
                    resetPasswordToken.identifier,
                    resetPasswordToken.token,
                    resetPasswordToken.email,
                ],
            }),
        },
    ]
);

export const authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, {onDelete: "cascade"}),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => [
        {
            compositePK: primaryKey({
                columns: [authenticator.userId, authenticator.credentialID],
            }),
        },
    ]
);

export const messageRoles = pgEnum("messageRole", ["USER", "ASSISTANT"]);
export const messageTypes = pgEnum("messageType", ["RESULT", "ERROR"]);

export const messages = pgTable("message", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    content: text("content").notNull(),
    messageRole: messageRoles("messageRole").notNull(),
    messageType: messageTypes("messageType").notNull(),
    projectId: text("projectId").notNull().references(() => projects.id, {onDelete: "cascade"}),
    createdAt: timestamp("createdAt", {mode: "date"})
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updatedAt", {mode: "date"})
        .notNull()
        .defaultNow(),

});

export const fragments = pgTable("fragment", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    messageId: text("messageId")
        .notNull()
        .references(() => messages.id, {onDelete: "cascade"}),

    sandboxUrl: text("sandboxUrl"),
    benchmarkData: text("benchmarkData"),
    title: text("title").notNull(),
    // files is json like path to content {[path: string]: string}
    files: text("files").notNull(),
})

export const projects = pgTable("project", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, {onDelete: "cascade"}),
    createdAt: timestamp("createdAt", {mode: "date"})
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updatedAt", {mode: "date"})
        .notNull()
        .defaultNow(),
})


export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type ResetPasswordToken = typeof resetPasswordTokens.$inferSelect;
export type Authenticator = typeof authenticators.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Fragment = typeof fragments.$inferSelect;
export type Project = typeof projects.$inferSelect;
