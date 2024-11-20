import { Role } from "./role.model";
import { User } from "./user.model";
import { Organization } from "./organization.model";
import { Category } from "./category.model";
import { Event } from "./event.model";
import { Comment } from "./comment.model";
import { Certificate } from "./certificate.model";
import { Notification } from "./notification.model";
import { OrganizationMember } from "./organization_member.model";
import { EventRegistration } from "./event_registration.model";

// Role has many Users
Role.hasMany(User, {
  foreignKey: "role_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.belongsTo(Role, { foreignKey: "role_id" });

// User has many Event Registrations
User.hasMany(EventRegistration, {
  foreignKey: "volunteer_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
EventRegistration.belongsTo(User, { foreignKey: "volunteer_id" });

// Event has many Event Registrations
Event.hasMany(EventRegistration, {
  foreignKey: "event_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
EventRegistration.belongsTo(Event, { foreignKey: "event_id" });

// Organization has many Members
Organization.belongsToMany(User, {
  through: OrganizationMember,
  foreignKey: "organization_id",
});
User.belongsToMany(Organization, {
  through: OrganizationMember,
  foreignKey: "member_id",
});

// Organization has many Events
Organization.hasMany(Event, {
  foreignKey: "organization_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Event.belongsTo(Organization, { foreignKey: "organization_id" });

// Event has Organizer (User)
Event.belongsTo(User, { foreignKey: "organizer_id" });
User.hasMany(Event, { foreignKey: "organizer_id" });

// Event belongs to one Category
Category.hasMany(Event, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Event.belongsTo(Category, { foreignKey: "category_id" });

// Event has many Comments
Event.hasMany(Comment, {
  foreignKey: "event_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Comment.belongsTo(Event, { foreignKey: "event_id" });

// User has many Comments
User.hasMany(Comment, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Comment.belongsTo(User, { foreignKey: "user_id" });

// Event has one Certificate
Event.hasOne(Certificate, {
  foreignKey: "event_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Certificate.belongsTo(Event, { foreignKey: "event_id" });

// User has many User Certificates
User.hasMany(Certificate, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Certificate.belongsTo(User, { foreignKey: "user_id" });

Organization.hasMany(Certificate, {
  foreignKey: "organization_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Certificate.belongsTo(Organization, { foreignKey: "organization_id" });

// User has many Notifications
User.hasMany(Notification, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Notification.belongsTo(User, { foreignKey: "user_id" });
