module.exports = (sequelize, DataTypes) => {
  const AdminModel = sequelize.define('admins', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      required: true,
    },
  }, {
    freezeTableName: true,
    timestamps: true
  });

  return AdminModel;
};