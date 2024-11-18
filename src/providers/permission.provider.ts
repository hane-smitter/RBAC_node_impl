import { AppDataSource } from "../database";
import { Permission } from "../entities/Permission";

export class PermissionProvider {
  static #permissionRepo = AppDataSource.getRepository(Permission);
  // We create a cache since we do not expect it to change frequently
  static #cache: { permissions?: Permission[] } = {};
  static #instance: any = null;

  // Make constructor private
  constructor() {
    PermissionProvider.#instance = this;
    if (PermissionProvider.#instance) {
      throw new Error("Cannot create instance of PermissionProvider");
    }
  }

  static async retrievePermissions() {
    if (this.#cache.permissions) {
      console.log("Fetching cached Permissions...");
      return this.#cache.permissions;
    }

    console.log("Making DB call to fetch Permissions...");
    const permissions = await this.#permissionRepo.find();
    this.#cache.permissions = permissions;

    return permissions;
  }

  static clearCache() {
    console.log("Permis Cache CLEARED!!");
    this.#cache = {};
  }
}
