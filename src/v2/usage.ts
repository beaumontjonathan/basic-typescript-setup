import Knex from 'knex';
import moment from 'moment';
import { Core } from './Core';
import { Model } from '.';

const knex: Knex = Knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'newpassword',
    database: 'planner_graphql_dev',
  },
});

interface User {
  id: number;
  age: number;
  username: string;
  password: string;
}

interface DbTag {
  id: number;
  userId: number;
  name: string;
  stampCreated: string;
}

interface Tag {
  id: number;
  userId: number;
  name: string;
  created: string;
}

interface DbFollow {
  id: number;
  followerId: number;
  followeeId: number;
}

interface Follow {
  id: number;
  followerId: string;
  followeeId: string;
}

interface Device {
  id: number;
  name: string;
}

interface UserDevice {
  id: number;
  userId: number;
  deviceId: number;
}

(async () => {
  const core = new Core(knex);

  const UserModel = Model<User>({
    name: 'User',
    primaryField: 'id',
    fields: () => ({
      id: {
        fieldName: 'id',
        resolve: tag => tag.id,
      },
      age: {
        fieldName: 'age',
        resolve: tag => tag.age,
      },
      username: {
        fieldName: 'username',
        resolve: tag => tag.username,
      },
      password: {
        fieldName: 'password',
        resolve: tag => tag.password,
      },
    }),
  }, core);

  const DeviceModel = Model<Device>({
    name: 'Device',
    primaryField: 'id',
    fields: () => ({
      id: {
        fieldName: 'id',
        resolve: device => device.id,
      },
      name: {
        fieldName: 'name',
        resolve: device => device.name,
      },
    }),
  }, core);

  // @ts-ignore
  const UserDevice = Model<UserDevice>({
    name: 'UserDevice',
    primaryField: 'id',
    fields: () => ({
      id: {
        fieldName: 'id',
        resolve: device => device.id,
      },
      userId: {
        fieldName: 'userId',
        model: UserModel,
        resolve: device => device.userId,
      },
      deviceId: {
        fieldName: 'deviceId',
        model: DeviceModel,
        resolve: device => device.deviceId,
      },
    }),
  }, core);

  // @ts-ignore
  const TagModel = Model<DbTag, Tag>({
    name: 'Tag',
    primaryField: 'id',
    fields: () => ({
      id: {
        fieldName: 'id',
      },
      userId: {
        fieldName: 'userId',
        model: UserModel,
      },
      name: {
        fieldName: 'name',
      },
      created: {
        fieldName: 'stampCreated',
        resolve: tag => moment(tag.stampCreated).format('YYYY-MM-DD HH:mm:ss asdf'),
      }
    }),
  }, core);

  const FollowModel = Model<DbFollow, Follow>({
    name: 'Follow',
    primaryField: 'id',
    fields: () => ({
      id: {
        fieldName: 'id',
        // resolve: follow => follow.id,
      },
      followerId: {
        fieldName: 'followerId',
        model: UserModel,
        resolve: follow => `${follow.followerId}`,
      },
      followeeId: {
        fieldName: 'followeeId',
        model: UserModel,
        resolve: follow => `${follow.followeeId}`,
      },
    }),
  }, core);

  core.init();

  // const results = await UserModel.get({
  //   username: ['jonny', 'farah'],
  //   id: 2,
  // });


  // const results =  await TagModel.getWithLinked({
  //   id: [1, 2, 3]
  // }, UserModel, {
  //   age: 21
  // });

  const results3 = await TagModel
    .query()
    .get({
      id: [1, 2, 3],
    })
    .onFieldWithModel(TagModel.fields.userId, UserModel, {
      age: 21,
    })
    .done();

  const results = await FollowModel
    .query()
    .get()
    .onFieldWithModel(FollowModel.fields.followeeId, UserModel, {
      username: 'jonny',
    })
    .onFieldWithModel(FollowModel.fields.followerId, UserModel, {
      username: 'farah',
    })
    .done();

  const results2 = await core
    .getKnex()
    .select('f.*')
    .from('follow as f')
    .join('user as u1', 'f.followeeId', 'u1.id')
    .join('user as u2', 'f.followerId', 'u2.id')
    .where('u1.username', 'jonny')
    .where('u2.username', 'farah');

  console.log(results);
  console.log(results2);
  console.log(results3);
  // console.log(TagModel);
  // console.log(UserModel);
  await core.destroy();
})();

// (async () => {
//   knex.on('query', console.log);
//
//   const fieldPairs: [string, (number | number[])][] = [
//     ['age', 21],
//     ['id', [1, 2]],
//   ];
//
//   const query = knex
//     .select('*')
//     .from('user');
//
//   fieldPairs.forEach(([field, values]) => {
//     if (Array.isArray(values)) {
//       query.whereIn(field, values);
//     } else {
//       query.where(field, values);
//     }
//   });
//
//   const results = await query;
//   console.log(results);
//   await knex.destroy();
// })();
