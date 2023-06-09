const { db } = require("../db");

class FriendshipsDAO {
  static table = "friendships";
  static users = "users";

  static async getFriendsWithStatus(id) {
    try {
      const query = `
        SELECT id, userName, firstName, lastName, status, fromId, createdAt FROM ${this.users} u
        JOIN ${this.table} f ON u.id = f.userId1 OR u.id = f.userId2
        WHERE u.id != ? AND (f.userId1 = ? OR f.userId2 = ?);
      `
      return await db.query(query, [id, id, id]);
    } catch (error) {
      console.log("Couldn't get friends", error);
      return { error };
    }
  }

  static async getFriendsNames(id) {
    try {
        const allFriendsIds = await this.getFriendsIds(id);
        const friendNames = await db.query(`SELECT id, userName FROM ${this.users} WHERE 
        id in (${allFriendsIds});`);
        return friendNames;
    } catch (error) {
      console.log("Couldn't get friendNames", error);
      return { error };
    }
  }

  static async getFriendsIds(id) {
    try {
        const smallerIds = await db.query(`SELECT userId1 FROM ${this.table} WHERE userId2=${Number(id)};`);
        const largerIds = await db.query(`SELECT userId2 FROM ${this.table} WHERE userId1=${Number(id)};`);
        const allFriendsIds = [];
        smallerIds.forEach(obj => {
            allFriendsIds.push(obj.userId1)
        });
        largerIds.forEach(obj => {
            allFriendsIds.push(obj.userId2)
        });
        return allFriendsIds;
    } catch (error) {
      console.log("Couldn't get Ids", error);
      return { error };
    }
  }

  static async checkFriendship(id1, id2) {
    const smallId = Math.min(Number(id1),Number(id2));
    const bigId = Math.max(Number(id1),Number(id2));
    try {
      const friendship = await db.query(`SELECT * FROM ${this.table} WHERE userId1=${smallId} AND userId2=${bigId};`);
      if (friendship && friendship.length) {
        return friendship[0];
      } else {
        return false;
      }
    } catch (error) {
      console.log("Couldn't check friendship", error);
      return { error };
    }
  }

  static async getFriendship(id1, id2) {
    const smallId = Math.min(Number(id1), Number(id2));
    const bigId = Math.max(Number(id1), Number(id2));
    try {
      const friendship = await db.query(`SELECT * FROM ${this.table} WHERE userId1 = ? AND userId2 = ?;`, [smallId, bigId]);
      if (friendship && friendship.length) {
        return friendship[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log("Couldn't get friendship", error);
      return { error };
    }
  }

  static async makeFriendRequest(fromID, toID) {
    try {
      const id1 = Math.min(Number(fromID), Number(toID));
      const id2 = Math.max(Number(fromID), Number(toID));
      const isAlreadyExists = await db.query(
        `SELECT * FROM ${this.table} WHERE userId1=${id1} AND userId2=${id2};`
      );
      if (!(isAlreadyExists && isAlreadyExists.length)) {
        await db.query(
          `INSERT INTO ${this.table} (userId1, userId2, fromId) VALUES (${id1},${id2},${fromID});`
        );
        return true;
      }
    } catch (error) {
      console.log("Couldn't send friendship request", error);
      return { error };
    }
  }

  static async confirmFriendship(firstId, secondID) {
    try {
      const id1 = Math.min(Number(firstId), Number(secondID));
      const id2 = Math.max(Number(firstId), Number(secondID));
      await db.query(
        `UPDATE ${this.table} SET status="accepted" WHERE userId1=${id1} AND userId2=${id2};`
      );

      const updated = await db.query(
        `SELECT * FROM ${this.table} WHERE userId1=${id1} AND userId2=${id2} AND status="accepted";`
      );
      if (updated && updated.length) return true;
      else return false;
    } catch (error) {
      console.log("Couldn't confirm friendship", error);
      return { error };
    }
  }

  static async deleteFriendship(firstId, secondId) {
    try {
      const id1 = Math.min(Number(firstId), Number(secondId));
      const id2 = Math.max(Number(firstId), Number(secondId));
      return await db.query(
        `DELETE FROM ${this.table} WHERE userId1 = ? AND userId2 = ?;`,
        [id1, id2]
      );
    } catch (error) {
      console.log("Couldn't delete friendship", error);
      return { error };
    }
  }
}

module.exports = FriendshipsDAO;
