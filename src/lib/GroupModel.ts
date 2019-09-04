import { Model } from  '.';

interface DbGroup {
  group_id: number;
  group_name: string;
}

interface Group {
  id: number;
  name: string;
}

export const GroupModel = Model<DbGroup, Group>({
  name: 'Group',
  linkedModels: [],
  fields: () => ({
    id: {
      fieldName: 'group_id',
      resolve: group => group.group_id,
    },
    name: {
      fieldName: 'group_name',
      resolve: group => group.group_name,
    },
  }),
});
