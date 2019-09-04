import { Model } from './index';

const TagModel = Model<{
  id: number;
  name: string;
}>({
  name: 'Tag',
  fields: () => ({
    id: {
      fieldName: 'id',
      resolve: tag => tag.id,
    },
    name: {
      fieldName: 'name',
      resolve: tag => tag.name,
    },
  }),
});

const UserModel = Model<{
  id: number;
  name: string;
  tagId: string;
}>({
  name: 'User',
  fields: () => ({
    id: {
      fieldName: 'id',
      resolve: user => user.id,
    },
    name: {
      fieldName: 'name',
      resolve: user => user.name,
    },
    tagId: {
      fieldName: 'tagId',
      model: TagModel,
      resolve: user => user.tagId
    }
  }),
});

console.log(TagModel.fields.name);
console.log(UserModel.fields.name);
