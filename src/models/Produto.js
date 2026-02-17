import { Model, DataTypes } from "sequelize";

class Produto extends Model {
    static initModel(sequelize) {
        return Produto.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            
            codigo: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            descricao: {
                type: DataTypes.STRING,
                allowNull: false
            },
            unidade: {
                type: DataTypes.STRING(6), 
                allowNull: false
            },
            valorUnitario: {
                type: DataTypes.DECIMAL(15, 4), 
                allowNull: false,
                defaultValue: 0
            },

            ncm: {
                type: DataTypes.STRING(10),
                allowNull: true 
            },

            omieProdutoId: {
                type: DataTypes.BIGINT,
                allowNull: true,
                unique: true,
            },
            ativo: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        }, {
            sequelize,
            tableName: "products",
            timestamps: true,
            underscored: true, // snake_case
        })
    }
}

export default Produto;