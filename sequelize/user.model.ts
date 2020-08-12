import {
  Column,
  Model,
  Table,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'user', freezeTableName: true, version: false })
export default class User extends Model<User> {
  @Column(DataType.STRING)
  public name!: string;

  @Column(DataType.STRING)
  public cognome!: string;

  @Column(DataType.STRING)
  public email!: string;

}
