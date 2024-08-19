import { User } from './user.model.js';
import { Role } from './role.model.js';
import { Organization } from './organization.model.js';
import { Event } from './event.model.js';
import { Comment } from './comment.model.js';
import { Category } from './category.model.js';
import { EventCategory } from './event_category.model.js';
import { Award } from './award.model.js';
import { Notification } from './notification.model.js';
import { OrganizationMember } from './orgnazation_member.model.js';
import { EventRegistration } from './event_registration.model.js';
import { Localization } from './localization.model.js';

// Define associations

//Role has many Users
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// User has many Comments
User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

// User has many EventRegistrations
User.hasMany(EventRegistration, { foreignKey: 'user_id' });
EventRegistration.belongsTo(User, { foreignKey: 'user_id' });

// User has many Awards
User.hasMany(Award, { foreignKey: 'recipient_id' });
Award.belongsTo(User, { foreignKey: 'recipient_id' });

// Organization has many OrganizationMembers
Organization.hasMany(OrganizationMember, { foreignKey: 'organization_id' });
OrganizationMember.belongsTo(Organization, { foreignKey: 'organization_id' });

// Organization has many Events
Organization.hasMany(Event, { foreignKey: 'organization_id' });
Event.belongsTo(Organization, { foreignKey: 'organization_id' });

// Organization has many Awards
Organization.hasMany(Award, { foreignKey: 'issuing_organization_id' });
Award.belongsTo(Organization, { foreignKey: 'issuing_organization_id' });

// Event has many Comments
Event.hasMany(Comment, { foreignKey: 'event_id' });
Comment.belongsTo(Event, { foreignKey: 'event_id' });

// Event has many EventRegistrations
Event.hasMany(EventRegistration, { foreignKey: 'event_id' });
EventRegistration.belongsTo(Event, { foreignKey: 'event_id' });

// Event belongs to many Categories through EventCategory
Event.belongsToMany(Category, { through: EventCategory, foreignKey: 'event_id' });
Category.belongsToMany(Event, { through: EventCategory, foreignKey: 'category_id' });

// Event has one Localization
Event.belongsTo(Localization, { foreignKey: 'localization_id' });
Localization.hasMany(Event, { foreignKey: 'localization_id' });

// User has many Notifications
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Event has many Notifications
Event.hasMany(Notification, { foreignKey: 'event_id' });
Notification.belongsTo(Event, { foreignKey: 'event_id' });
