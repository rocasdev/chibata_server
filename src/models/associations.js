import { User } from './user.model.js';
import { Role } from './role.model.js';
import { Organization } from './organization.model.js';
import { Event } from './event.model.js';
import { Category } from './category.model.js';
import { EventCategory } from './event_category.model.js';
import { Notification } from './notification.model.js';
import { OrganizationMember } from './orgnazation_member.model.js';
import { EventRegistration } from './event_registration.model.js';

// Define associations

//Role has many Users
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });


// User has many EventRegistrations
User.hasMany(EventRegistration, { foreignKey: 'user_id' });
EventRegistration.belongsTo(User, { foreignKey: 'user_id' });

// Organization has many OrganizationMembers
Organization.hasMany(OrganizationMember, { foreignKey: 'organization_id' });
OrganizationMember.belongsTo(Organization, { foreignKey: 'organization_id' });

User.hasMany(OrganizationMember, { foreignKey: 'user_id' })
OrganizationMember.belongsTo(User, { foreignKey: 'user_id' })

// Organization has many Events
Organization.hasMany(Event, { foreignKey: 'organization_id' });
Event.belongsTo(Organization, { foreignKey: 'organization_id', as: 'organization' });

// Event has many EventRegistrations
Event.hasMany(EventRegistration, { foreignKey: 'event_id' });
EventRegistration.belongsTo(Event, { foreignKey: 'event_id' });

// Event belongs to many Categories through EventCategory
Event.belongsToMany(Category, { through: EventCategory, foreignKey: 'event_id' });
Category.belongsToMany(Event, { through: EventCategory, foreignKey: 'category_id' });

// User has many Notifications
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Event has one organizer
Event.belongsTo(User, { foreignKey: 'organizer_id', as: 'organizer' }); // Asegúrate de que 'organizer_id' sea el nombre correcto en tu modelo
User.hasMany(Event, { foreignKey: 'organizer_id', as: 'organizedEvents' });