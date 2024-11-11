import { AppDataSource } from "../database";
import { Permissions } from "../entities/Permissions";

export class PermissionProvider {
  static #permissionRepo = AppDataSource.getRepository(Permissions);
  // We create a cache since we do not expect it to change frequently
  static #cache: { permissions?: Permissions[] } = {};
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
    this.#cache = {};
  }
}
