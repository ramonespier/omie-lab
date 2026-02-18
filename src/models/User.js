import { Model, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
    validPassword(password) {
        return bcrypt.compareSync(password, this.password)
    }

    static generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    }

    static initModel(sequelize) {
        return User.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false
            },

            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'users',
            timestamps: true,
            underscored: true,

            hooks: {
                beforeCreate: async (user) => {
                    if (user.password) {
                        user.password = User.generateHash(user.password)
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.changed('password')) {
                        user.password = User.generateHash(user.password)
                    }
                }
            }
        })
    }
}

export default User;