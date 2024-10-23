import {
  Comment,
  CommentAttributes,
  CommentCreationAttributes,
} from "../models/comment.model";
import { sequelize } from "../db/db";
import { Sequelize } from "sequelize";
import ObjectID from "bson-objectid";

class CommentService {
  constructor() {
    console.log("CommentService instance created");
  }

  static async createComment(commentData: CommentCreationAttributes) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(ObjectID().toHexString(), "hex");
      const comment = Comment.build({...commentData, comment_id: oid});
      const newComment = await comment.save({ transaction: t });
      await t.commit();
      return newComment;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot create comment:", err);
      throw new Error(`Error creating comment: ${err.message}`);
    }
  }

  static async findAllComments() {
    try {
      const comments = await Comment.findAll({
        attributes: {
          include: [
            [Sequelize.fn("HEX", Sequelize.col("comment_id")), "comment_id"],
            [Sequelize.fn("HEX", Sequelize.col("user_id")), "user_id"],
            [Sequelize.fn("HEX", Sequelize.col("event_id")), "event_id"],
          ],
        },
      });
      return comments;
    } catch (err: any) {
      console.error("Cannot find all comments:", err);
      throw new Error(`Error fetching all comments: ${err.message}`);
    }
  }

  static async findCommentById(id: string) {
    try {
      const oid = Buffer.from(id, "hex");
      const comment = await Comment.findByPk(oid, {
        attributes: {
          include: [
            [Sequelize.fn("HEX", Sequelize.col("comment_id")), "comment_id"],
            [Sequelize.fn("HEX", Sequelize.col("user_id")), "user_id"],
            [Sequelize.fn("HEX", Sequelize.col("event_id")), "event_id"],
          ],
        },
      });
      if (!comment) {
        throw new Error(`Comment with id ${id} not found`);
      }
      return comment;
    } catch (err: any) {
      console.error("Cannot find comment by id:", err);
      throw new Error(`Error fetching comment by ID: ${err.message}`);
    }
  }

  static async updateComment(
    id: string,
    commentData: Partial<CommentAttributes>
  ) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(id, "hex");
      const comment = await Comment.findByPk(oid, { transaction: t });
      if (!comment) {
        throw new Error(`Comment with id ${id} not found`);
      }
      await comment.update(commentData, { transaction: t });
      await t.commit();
      return comment;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot update comment:", err);
      throw new Error(`Error updating comment: ${err.message}`);
    }
  }

  static async deleteComment(id: string) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(id, "hex");
      const comment = await Comment.findByPk(oid, { transaction: t });
      if (!comment) {
        throw new Error(`Comment with id ${id} not found`);
      }
      await comment.destroy({ transaction: t });
      await t.commit();
      return true;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot delete comment:", err);
      throw new Error(`Error deleting comment: ${err.message}`);
    }
  }

  static async findCommentsByEventId(eventId: string) {
    try {
      const eid = Buffer.from(eventId, "hex");
      const comments = await Comment.findAll({
        where: { event_id: eid },
        attributes: {
          include: [
            [Sequelize.fn("HEX", Sequelize.col("comment_id")), "comment_id"],
            [Sequelize.fn("HEX", Sequelize.col("user_id")), "user_id"],
            [Sequelize.fn("HEX", Sequelize.col("event_id")), "event_id"],
          ],
        },
        order: [["created_at", "DESC"]],
      });
      return comments;
    } catch (err: any) {
      console.error("Cannot find comments by event id:", err);
      throw new Error(`Error fetching comments by event ID: ${err.message}`);
    }
  }

  static async findCommentsByUserId(userId: string) {
    try {
      const uid = Buffer.from(userId, "hex");
      const comments = await Comment.findAll({
        where: { user_id: uid },
        attributes: {
          include: [
            [Sequelize.fn("HEX", Sequelize.col("comment_id")), "comment_id"],
            [Sequelize.fn("HEX", Sequelize.col("user_id")), "user_id"],
            [Sequelize.fn("HEX", Sequelize.col("event_id")), "event_id"],
          ],
        },
        order: [["created_at", "DESC"]],
      });
      return comments;
    } catch (err: any) {
      console.error("Cannot find comments by user id:", err);
      throw new Error(`Error fetching comments by user ID: ${err.message}`);
    }
  }

  static async getAverageRatingForEvent(eventId: string): Promise<number> {
    try {
      const eid = Buffer.from(eventId, "hex");
      const result = await Comment.findOne({
        where: { event_id: eid },
        attributes: [
          [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
        ],
        raw: true,
      });

      if (result && "averageRating" in result) {
        const avgRating = result.averageRating as number;
        return Number.isNaN(avgRating) ? 0 : Number(avgRating.toFixed(2));
      }
      return 0;
    } catch (err: any) {
      console.error("Cannot get average rating for event:", err);
      throw new Error(`Error getting average rating for event: ${err.message}`);
    }
  }
}

export { CommentService };
