import { ColumnProperty } from 'xingine';

export class UserList {
  id!: string;
  @ColumnProperty({
    filterable: {
      apply: true,
      operator: 'ilike',
    },
  })
  username!: string;
  @ColumnProperty({
    filterable: {
      apply: true,
      operator: 'ilike',
    },
  })
  email!: string;
  @ColumnProperty({
    filterable: {
      apply: true,
      operator: 'ilike',
    },
  })
  firstName!: string;
  @ColumnProperty({
    filterable: {
      apply: true,
      operator: 'ilike',
    },
  })
  lastName!: string;
  @ColumnProperty({
    filterable: {
      apply: true,
      inputType: 'number',
    },
  })
  gender!: string;
  age!: number;
  assignedRoles!: string[];
}
