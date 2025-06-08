import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    property_id: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.DECIMAL(2, 1), allowNull: false },
    user: { type: DataTypes.STRING(255), allowNull: false },
    useremail: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.TEXT },
}, { tableName: 'reviews', timestamps: true });

const ReviewImage = sequelize.define('ReviewImage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    review_id: { type: DataTypes.INTEGER, allowNull: false },
    image_url: { type: DataTypes.STRING(500), allowNull: false },
}, { tableName: 'review_images', timestamps: false });

Review.hasMany(ReviewImage, { foreignKey: 'review_id', as: 'images' });
ReviewImage.belongsTo(Review, { foreignKey: 'review_id' });

export { Review, ReviewImage };