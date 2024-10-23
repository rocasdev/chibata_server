import { User } from "../models/user.model";
import { Organization } from "../models/organization.model";
import { OrganizationMember } from "../models/organization_member.model";
import { Category } from "../models/category.model";
import { Event } from "../models/event.model";
import { EventRegistration } from "../models/event_registration.model";
import { Comment } from "../models/comment.model";
import { Notification } from "../models/notification.model";
import { UserCertificate } from "../models/user_certificate.model";
import ObjectID from "bson-objectid";
import { Transaction } from "sequelize";

// Función helper para crear notificaciones
async function createNotification(
  userId: Buffer,
  title: string,
  message: string,
  transaction?: Transaction | null
) {
  await Notification.create(
    {
      notification_id: Buffer.from(ObjectID().toHexString(), "hex"),
      user_id: userId,
      title,
      message,
      is_read: false,
    },
    { transaction }
  );
}

// 1. Usuarios (cbt_users)
User.addHook("afterCreate", async (user: User, options) => {
  const t = options.transaction;
  const admin = await User.findOne({ where: { role_id: 1 }, transaction: t });

  if (!admin) {
    throw new Error("No hay administradores en la base de datos");
  }

  await createNotification(
    admin?.user_id,
    "Nueva cuenta creada!",
    `Una nueva cuenta se ha registrado: nombre: ${user.firstname} ${user.surname} | email: ${user.email} | ID: ${user.user_id.toString('hex')}`,
    t
  );

  await createNotification(
    user.user_id,
    "Bienvenido a Chibata",
    "¡Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.",
    t
  );
});

User.addHook("afterUpdate", async (user: User, options) => {
  const t = options.transaction;
  // Actualización de perfil
  if (
    user.changed("firstname") ||
    user.changed("surname") ||
    user.changed("avatar")
  ) {
    await createNotification(
      user.user_id,
      "Perfil actualizado",
      "Tu perfil ha sido actualizado exitosamente.",
      t
    );
  }

  // Cambio de contraseña
  if (user.changed("pass")) {
    await createNotification(
      user.user_id,
      "Contraseña cambiada",
      "Tu contraseña ha sido cambiada exitosamente. Si no realizaste este cambio, por favor contacta con soporte.",
      t
    );
  }
});

// 4. Miembros de organización (cbt_organization_members)
OrganizationMember.addHook(
  "afterCreate",
  async (member: OrganizationMember, options) => {
    const t = options.transaction;
    const org = await Organization.findByPk(member.organization_id, {
      transaction: t,
    });
    await createNotification(
      member.member_id,
      "Nuevo miembro de organización",
      `Has sido añadido como miembro a la organización "${org?.name}".`,
      t
    );
  }
);

OrganizationMember.addHook(
  "afterUpdate",
  async (member: OrganizationMember, options) => {
    const t = options.transaction;
    if (member.changed("role_in")) {
      const org = await Organization.findByPk(member.organization_id, {
        transaction: t,
      });
      await createNotification(
        member.member_id,
        "Cambio de rol en organización",
        `Tu rol en la organización "${org?.name}" ha cambiado a ${member.role_in}.`,
        t
      );
    }
  }
);

// 5. Categorías (cbt_categories)
Category.addHook("afterCreate", async (category: Category, options) => {
  const t = options.transaction;
  const users = await User.findAll({ transaction: t });
  for (const user of users) {
    await createNotification(
      user.user_id,
      "Nueva categoría disponible",
      `Se ha añadido una nueva categoría: "${category.name}". ¡Explora nuevos eventos en esta categoría!`,
      t
    );
  }
});

// 6. Eventos (cbt_events)
Event.addHook("afterCreate", async (event: Event, options) => {
  const t = options.transaction;
  const users = await User.findAll({ where: { role_id: 1 }, transaction: t });
  for (const user of users) {
    await createNotification(
      user.user_id,
      "Nuevo evento creado",
      `Se ha creado un nuevo evento: "${event.title}". ¡Revísalo y regístrate si estás interesado!`,
      t
    );
  }
});

Event.addHook("afterUpdate", async (event: Event, options) => {
  const t = options.transaction;
  const registeredUsers = await EventRegistration.findAll({
    where: { event_id: event.event_id },
    transaction: t,
  });

  if (event.changed("status")) {
    for (const registration of registeredUsers) {
      await createNotification(
        registration.volunteer_id,
        "Actualización de estado de evento",
        `El estado del evento "${event.title}" ha cambiado a ${event.status}.`,
        t
      );
    }
  }

  if (event.changed("address")) {
    for (const registration of registeredUsers) {
      await createNotification(
        registration.volunteer_id,
        "Cambio de ubicación de evento",
        `La ubicación del evento "${event.title}" ha sido actualizada. Por favor, verifica los nuevos detalles.`,
        t
      );
    }
  }

  // Recordatorio de evento (esto debería ser manejado por un job programado, pero lo incluyo aquí como ejemplo)
  if (event.date_time.getTime() - Date.now() <= 24 * 60 * 60 * 1000) {
    for (const registration of registeredUsers) {
      await createNotification(
        registration.volunteer_id,
        "Recordatorio de evento",
        `El evento "${event.title}" comenzará pronto. ¡No olvides asistir!`,
        t
      );
    }
  }
});

// 7. Registro de eventos (cbt_event_registrations)
EventRegistration.addHook(
  "afterCreate",
  async (registration: EventRegistration, options) => {
    const t = options.transaction;
    const event = await Event.findByPk(registration.event_id, {
      transaction: t,
    });
    await createNotification(
      registration.volunteer_id,
      "Confirmación de registro",
      `Te has registrado exitosamente para el evento "${event?.title}".`,
      t
    );
  }
);

EventRegistration.addHook(
  "afterUpdate",
  async (registration: EventRegistration, options) => {
    const t = options.transaction;
    if (registration.changed("attendance_status")) {
      const event = await Event.findByPk(registration.event_id, {
        transaction: t,
      });
      await createNotification(
        registration.volunteer_id,
        "Cambio de estado de asistencia",
        `Tu estado de asistencia para el evento "${event?.title}" ha cambiado a ${registration.attendance_status}.`,
        t
      );
    }
  }
);

// 8. Comentarios (cbt_comments)
Comment.addHook("afterCreate", async (comment: Comment, options) => {
  const t = options.transaction;
  const event = await Event.findByPk(comment.event_id, { transaction: t });
  const owner = await User.findByPk(event?.organizer_id, { transaction: t });
  if (owner) {
    await createNotification(
      owner.user_id,
      "Nuevo comentario en evento",
      `Se ha dejado un nuevo comentario en el evento "${event?.title}".`,
      t
    );
  }
});

// 10. Certificados (cbt_certificates y cbt_user_certificates)
UserCertificate.addHook(
  "afterCreate",
  async (user_certificate: UserCertificate, options) => {
    const t = options.transaction;
    await createNotification(
      user_certificate.user_id,
      "Nuevo certificado disponible",
      `Se ha generado un nuevo certificado por tu participación en un evento. ¡Ya puedes descargarlo!`,
      t
    );
  }
);
