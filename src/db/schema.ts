import { relations, sql } from "drizzle-orm";
import {
	text,
	integer,
	sqliteTable,
	uniqueIndex,
	index,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable(
	"users",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		streetAddress: text("street_address"),
		city: text("city"),
		state: text("state"),
		zipCode: text("zip_code"),
		firstName: text("first_name"),
		lastName: text("last_name"),
		email: text("email"),
		phone: text("phone"),
		isHomeowner: integer({ mode: "boolean" }),
		createdAt: integer({ mode: "timestamp_ms" })
	},
);

export const submissions = sqliteTable("submissions", {
	subId: integer("sub_id").primaryKey({ autoIncrement: true }),
	userId: integer("user_id"),
	source: text("sub_source", { enum: ["home_improvement"] }),
	shortTrade: text("sub_short_trade"),
	action: text("sub_action"),
	additionalType: text("sub_addtl_type"),
	createdAt: integer({ mode: "timestamp_ms" })
})

export const selectUsers = createSelectSchema(users);

export type SelectUsers = z.infer<typeof selectUsers>

export const selectSubmissions = createSelectSchema(submissions);

export type SelectSubmissions = z.infer<typeof selectSubmissions>

export const selectUsersWithSubmissions = selectUsers.extend({
	subs: selectSubmissions.array(),
});

export type SelectUsersWithSubmissions = z.infer<typeof selectUsersWithSubmissions>

export const usersToSubs = relations(users, ({ many }) => ({
	subs: many(submissions),
}));

export const subToUser = relations(submissions, ({ one }) => ({
	user: one(users, {
		fields: [submissions.userId],
		references: [users.id],
	}),
}));
