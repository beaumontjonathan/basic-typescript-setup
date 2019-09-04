import { Model } from '.';
import moment from 'moment';
import { GroupModel } from './GroupModel';

interface DbUser {
  user_id: number;
  user_name: string;
  group_id: number;
  DOB: string;
}

interface User {
  id: number;
  groupId: number;
  username: string;
  dateOfBirth: string;
}

const UserModel = Model<DbUser, User>({
  name: '',
  fields: () => ({
    id: {
      fieldName: 'user_id',
      resolve: user => user.user_id,
    },
    groupId: {
      fieldName: 'group_id',
      resolve: user => user.group_id,
      model: GroupModel,
    },
    username: {
      fieldName: 'user_name',
      resolve: user => user.user_name,
    },
    dateOfBirth: {
      fieldName: 'DOB',
      resolve: user => moment(user.DOB).format('YYYY-MM-DD'),
    },
  }),
});
