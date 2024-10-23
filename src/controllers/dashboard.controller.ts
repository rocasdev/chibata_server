import { Request, Response } from "express";

import { UserService } from "../services/user.service";
import { EventService } from "../services/event.service";
import { OrganizationService } from "../services/organization.service";

class DashboardController {
  async getDashboardCounts(_req: Request, res: Response): Promise<void> {
    try {
      const userCount = await UserService.countUsers();
      const eventCount = await EventService.countEvents();
      const organizationCount = await OrganizationService.countOrganizations();
      res
        .status(200)
        .json({
          user_counts: userCount,
          event_counts: eventCount,
          organization_counts: organizationCount,
        });
    } catch (err: any) {
      console.error("Controller | Cannot get dashboard counts:", err);
      res.status(500).json({
        message: `Error interno al obtener los conteos: ${err.message}`,
      });
    }
  }
}

export default new DashboardController();
