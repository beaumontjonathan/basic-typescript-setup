import Knex from 'knex';

export interface CreateUserArgs {
  username: string;
  password: string;
}

export const createUser = async (knex: Knex, args: CreateUserArgs) => {
  knex.insert('')
};
