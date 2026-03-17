/**
 * Data persistence: localStorage and JSON export
 */

import { ZodError, type ZodObject } from "zod";

const AUTOSAVE_MAX_AGE_HOURS = 24


export class PersistenceManager<T> {
  /**
   * Data you want to persist
   */
  items: T | null;

  /**
   * Zod Schema used for validation
   */
  schema: ZodObject | undefined;

  /**
   * Timer ID for the autosave interval
   */
  autosaveTimer: null | NodeJS.Timeout = null;

  /**
   * Key used to store main saved data in localStorage
   */
  storage_key: string = 'ground-control-data';

  /**
   * Key used to store autosave data separately in localStorage
   */
  autosave_key: string = 'ground-control-data-autosave';

  /**
   * Autosave interval in milliseconds (30000ms = 30 seconds)
   */
  autosave_interval: number = 30000;

  /**
   *
   * ### constructor PersistenceManager
   * @brief Construct a instance of persistenceManager
   * @param items Data saved in localStorage - required
   * @param storageKey  Key used to store the data in localStorage - optional
   *  @param autoSaveInterval Delay in between two autosave process - optional
   *
   */
  constructor(
    items: T,
    storageKey?: string,
    schema?: ZodObject,
    autoSaveInterval?: number,
  ) {
    this.items = items;
    this.schema = schema;
    if (storageKey) {
      this.storage_key = storageKey;
      this.autosave_key = `${storageKey}-autosave`;
    }
    if (autoSaveInterval) this.autosave_interval = autoSaveInterval;
  }

  /**
   * Save the `newItems` parameter in the localStorage.
   * if not given, save the current content of `items` stored in the persistenceManager instance
   *
   * @example
   * myPersistenceManager.save({new:"data"})
   **/
  save(newItems?: T) {
    const data = {
      items: newItems || this.items,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(this.storage_key, JSON.stringify(data));
  }

  /**
   * ----
   * ### function get
   * @brief Return the current data held in localStorage aswell as the timestamp when it was saved.
   *
   * @example
   * // Don't forget to check result of the function
   * const items = videoOptionPM.get()?.items
   * if(items) theNextAction()
   *
   **/
  get() {
    const saved = localStorage.getItem(this.storage_key);
    if (!saved) {
      return null;
    }

    let data;
    try {
      data = JSON.parse(saved) as { items: T; timestamp: string };
      if (this.schema) {
        this.schema.parse(data.items);
      }
    } catch (e) {
      if (e instanceof ZodError) {
        console.warn('Validation Error : ', ...e.issues);
      }
      else{
        console.warn(
          'The data retrieved from localStorage could not be parsed',
          {cause: e}
        );
      }
      return null
    }
    if (!data || !('items' in data) || !('timestamp' in data)){
      console.warn("The data retrieved from localStorage were not in the expected format")
      return null
    }

    return data;
  }

  clear() {
    this.items = null;
    localStorage.removeItem(this.storage_key);
    localStorage.removeItem(this.autosave_key);
  }

  startAutosave() {
    this.autosaveTimer = setInterval(() => {
      const data = {
        items: this.items,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(this.autosave_key, JSON.stringify(data));
    }, this.autosave_interval);
  }

  stopAutosave() {
    if (this.autosaveTimer) {
      clearInterval(this.autosaveTimer);
      this.autosaveTimer = null;
    }
  }

  checkAutosave() {
    const autosave = localStorage.getItem(this.autosave_key);
    if (!autosave) {
      return null;
    }

    const data = this.get();
    if (!data) return null;
    const saveTime = new Date(data.timestamp);
    const hoursDiff = (Date.now() - saveTime.getTime()) / (1000 * 60 * 60);

    if (hoursDiff >= AUTOSAVE_MAX_AGE_HOURS || data.items === null) {
      return null;
    }

    return {
      timestamp: saveTime,
      restore: () => (this.items = data.items),
    };
  }
}
