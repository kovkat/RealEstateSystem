// server/models/Property.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const Property = sequelize.define('Property', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    address: { type: DataTypes.STRING(255) },
    city: { type: DataTypes.STRING(100) },
    rooms: { type: DataTypes.INTEGER },
    area: { type: DataTypes.NUMERIC(8, 2) },
    type: { type: DataTypes.STRING(50) },
    source: { type: DataTypes.STRING(100) },
    link: { type: DataTypes.STRING(500), unique: true },
    price: { type: DataTypes.INTEGER },
}, {
    tableName: 'properties',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

const PropertyImage = sequelize.define('PropertyImage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    propertyId: { type: DataTypes.INTEGER, allowNull: false },
    url: { type: DataTypes.STRING(500), allowNull: false },
}, {
    tableName: 'property_images',
    timestamps: false,
});

// Зв’язок: одна нерухомість - багато зображень
Property.hasMany(PropertyImage, { foreignKey: 'propertyId', as: 'images' });
PropertyImage.belongsTo(Property, { foreignKey: 'propertyId' });

export { Property, PropertyImage };