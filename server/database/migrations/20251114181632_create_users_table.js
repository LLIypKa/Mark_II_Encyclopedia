/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('users', function(table) {
            table.increments('id').primary();
            table.string('email', 255).notNullable().unique();
            table.string('password', 255).notNullable();
            table.string('name', 100).notNullable();
            table.text('profile_photo_path');
            table.text('users_status_text');
            table.text('users_car_desc');
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
        .createTable('articles', function(table) {
            table.increments('id').primary();
            table.string('title', 500).notNullable();
            table.text('text_content').notNullable();
            table.integer('author_id').unsigned().notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            
            table.foreign('author_id').references('id').inTable('users');
        })
        .createTable('comments', function(table) {
            table.increments('id').primary();
            table.integer('article_id').unsigned().notNullable();
            table.integer('author_id').unsigned().notNullable();
            table.text('text_content').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.integer('parent_comment_id').unsigned();
            
            table.foreign('article_id').references('id').inTable('articles');
            table.foreign('author_id').references('id').inTable('users');
            table.foreign('parent_comment_id').references('id').inTable('comments');
        })
        .createTable('car_desc_photos', function(table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable();
            table.string('photo_path', 500).notNullable();
            
            table.foreign('user_id').references('id').inTable('users');
        })
        .createTable('user_status_photos', function(table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable();
            table.string('photo_path', 500).notNullable();
            
            table.foreign('user_id').references('id').inTable('users');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {}