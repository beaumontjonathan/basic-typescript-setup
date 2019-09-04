import Model from '.';
import GroupModel from './group';
import moment from 'moment';
/*
 * db:
 * user_id, user_name, DOB, group_id
const UserModel = Model({
  name: 'User',
  primaryField: 'id',
  linkedModels: [GroupModel],
  fields: () => ({
    id: {
      fieldName: 'user_id',
      resolver: user => user.user_id,
    },
    groupId: {
      fieldName: 'group_id',
      resolver: user => user.group_id,
      model: GroupModel,
    },
    userName: {
      fieldName: 'user_name',
      resolver: user => user.user_name,
    },
    dateOfBirth: {
      fieldName: 'DOB',
      resolver: user => moment(user.DOB).format('YYYY-MM-DD'),
    },
  }),
});

UserModel.add({
  userName: '',
  groupId: 1,
  dateOfBirth: '',
});

UserModel.add([
  {
    userName: '',
    groupId: 1,
    dateOfBirth: '',
  },
  {
    userName: '',
    groupId: 1,
    dateOfBirth: '',
  },
]);

UserModel.delete({
  id: 1,
});

UserModel.delete({
  id: [1, 2, 3],
});

UserModel
  .find({
    id: [1, 2, 3],
  })
  .where({

  });

UserModel
  .delete()
  .whereLinked(GroupModel, {
    name: '',
  });
