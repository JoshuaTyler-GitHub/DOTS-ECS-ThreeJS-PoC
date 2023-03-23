// errors
import ComponentNotFoundError from '@engine/errors/ComponentNotFoundError';
import DuplicateComponentError from '@engine/errors/DuplicateComponentError';
import EntityManagerWorldRequiredError from '@engine/errors/EntityManagerWorldRequiredError';
import EntityNotFoundError from '@engine/errors/EntityNotFoundError';

// utils
import PublishSubscribeUtils from '@utils/PublishSubscribeUtils';
import SortingUtils from '@utils/SortingUtils';
import UidUtils from '@utils/UidUtils';
import ValidationUtils from '@utils/ValidationUtils';

class EntityManager {
  constructor({
    entityMap = {},
    entityIds = [],
    queryInstanceId = Number('1'),
    tags = [],
    world = null,
  }) {
    if (!ValidationUtils.exists(world)) {
      throw new EntityManagerWorldRequiredError();
    }
    this.state = {
      entityIds,
      entityMap,
      queryInstanceId,
      tags,
      world,
    };
    this.topicId = PublishSubscribeUtils.createTopic({ name: this.name });
  }

  /**
   * @async
   * @param {Entity} entity
   * @param {Component} component
   * @param {Boolean} isNewEntity
   * @returns {Promise<Entity>}
   * @throws {DuplicateComponentError}
   */
  async addComponent(entity, component, isNewEntity = false) {
    // prevent duplicate components
    const componentIndex = this.getComponentIndex(entity, component);
    if (componentIndex !== Number('-1')) {
      throw new DuplicateComponentError(
        `[EntityManager] addComponent() - cannot create duplicate component "${component.name}" on entity.`,
      );
    }

    // cache the entity
    const oldComponentsKey = String(entity.componentsKey);
    entity.components[component.prototype.name] = component;
    entity.componentsKey = this.getComponentsKey(
      Object.values(entity.components),
    );
    await this.cache(entity);

    // remove the old entity reference
    if (!isNewEntity) {
      await this.destroyByKeyAndId(oldComponentsKey, entity.id);
    }
    return entity;
  }

  /**
   * @async
   * @param {Entity} entity
   * @param {Component[]} components
   * @param {Boolean} isNewEntity
   * @returns {Promise<Entity>}
   * @throws {DuplicateComponentError}
   */
  async addComponents(entity, components, isNewEntity = false) {
    // prevent duplicate components
    await Promise.all(
      Object.values(entity.components).map(async (checkComponent) => {
        const componentIndex = this.getComponentIndex(entity, checkComponent);
        if (componentIndex !== Number('-1')) {
          throw new DuplicateComponentError(
            `[EntityManager] addComponents() - cannot create duplicate component "${checkComponent.name}" on entity.`,
          );
        }
      }),
    );

    // cache the entity
    const oldComponentsKey = String(entity.componentsKey);
    Array.from(components).forEach((component) => {
      entity.components[component.constructor.name] = component;
    });
    entity.componentsKey = this.getComponentsKey(
      Object.values(entity.components),
    );
    await this.cache(entity);

    // remove the old entity reference
    if (!isNewEntity) {
      await this.destroyByKeyAndId(oldComponentsKey, entity.id);
    }
    return entity;
  }

  /**
   * @async
   * @param {Entity} entity
   * @returns {Promise<void>}
   */
  async cache(entity) {
    const { state } = this;
    const { entityMap } = state;
    const { componentsKey } = entity;

    // create the components entity cache if it does not exist
    if (!ValidationUtils.exists(entityMap[componentsKey])) {
      entityMap[componentsKey] = {
        componentMap: {},
        entities: {},
      };
      await Promise.all(
        Object.keys(entity.components).map(async (componentKey) => {
          entityMap[componentsKey].componentMap[componentKey] = Boolean(true);
        }),
      );
    }

    // cache the entity
    entityMap[componentsKey].entities[entity.id] = entity;

    // increment the queryInstanceId
    this.incrementQueryInstance();
  }

  /**
   * @async
   * @param {Entity} entity
   * @returns {Promise<Entity>}
   */
  async clone(entity) {
    const newEntity = await this.create(entity.components);
    newEntity.isEnabled = Boolean(entity.isEnabled);
    return newEntity;
  }

  /**
   * @async
   * @param {Component[]} components
   * @returns {Promise<Entity>}
   */
  async create(components) {
    const entityId = this.generateEntityId();
    const entity = {
      id: String(entityId),
      isEnabled: Boolean(true),
      components: {},
      componentsKey: String(),
    };
    await this.addComponents(entity, components, true);
    return entity;
  }

  /**
   * @async
   * @param {Entity} entity
   * @returns {Promise<void>}
   * @throws {EntityNotFoundError}
   */
  async destroy(entity) {
    return this.destroyByKeyAndId(entity.componentsKey, entity.id);
  }

  /**
   * @async
   * @param {String} key
   * @param {String} id
   * @returns {Promise<void>}
   * @throws {EntityNotFoundError}
   */
  async destroyByKeyAndId(key, id) {
    const { state } = this;
    const { entityMap } = state;
    try {
      delete entityMap[key].entities[id];
    } catch {
      throw new EntityNotFoundError(
        `[EntityManager] destroyByKeyAndId() - no entity was found for componentKey: [${key}] with id: [${id}].`,
      );
    }
    this.incrementQueryInstance();
  }

  /**
   * @returns {String} id
   */
  generateEntityId() {
    const { state } = this;
    const { entityIds } = state;
    const entityId = UidUtils.uuid(entityIds);
    entityIds.push(entityId);
    return entityId;
  }

  /**
   * @param {Entity} entity
   * @param {Component} component
   * @returns {Number}
   */
  getComponentIndex(entity, component) {
    return this.getComponentTypeIndex(entity, component.name);
  }

  /**
   * @param {Component[]} components
   * @returns {String} id
   */
  getComponentsKey(components) {
    const componentNames = Array.from(components).map(
      (component) => component.constructor.name,
    );
    const sortedComponentNames = SortingUtils.sortDescending(componentNames);
    return String(sortedComponentNames.join('-'));
  }

  /**
   * @param {Entity} entity
   * @param {String} componentType
   * @returns {Number}
   */
  getComponentTypeIndex(entity, componentType) {
    let componentIndex = Number('-1');
    Array.from(entity.components).forEach((checkComponent, index) => {
      if (String(componentType) === String(checkComponent.name)) {
        componentIndex = Number(index);
      }
    });
    return componentIndex;
  }

  /**
   * @returns {String} queryInstanceId
   */
  getQueryInstanceId() {
    const { state } = this;
    const { queryInstanceId } = state;
    return String(queryInstanceId);
  }

  /**
   * @returns {void}
   */
  incrementQueryInstance() {
    const { state } = this;
    const { queryInstanceId } = state;
    if (queryInstanceId === Number.MAX_SAFE_INTEGER) {
      this.state.queryInstanceId = Number('1');
    } else {
      this.state.queryInstanceId += Number('1');
    }
  }

  /**
   * @async
   * @param {Component[]} components
   * @param {Boolean} exact
   * @returns {Promise<Entity[]>}
   */
  async query(components, exact = false) {
    const { state } = this;
    const { entityMap } = state;

    // match entities with exact components
    if (exact) {
      const componentsKey = this.getComponentsKey(components);
      if (ValidationUtils.exists(entityMap[componentsKey])) {
        return entityMap[componentsKey].entities;
      } else {
        return [];
      }
    }

    // match entities with components + any additional components
    else {
      const entitiesWithComponents = [];
      await Promise.all(
        Object.keys(entityMap).map(async (key) => {
          const entityHash = entityMap[key];
          const { componentMap, entities } = entityHash;

          let componentMapHasComponents = Boolean(true);
          await Promise.all(Object.values(components).map(async (component) => {
            if (!componentMap[component.constructor.name]) {
              componentMapHasComponents = Boolean(false);
            }
          }));

          if (componentMapHasComponents) {
            await Promise.all(
              Object.values(entities).map(async (entity) => {
                entitiesWithComponents.push(entity);
              }),
            );
          }
        }),
      );
      return entitiesWithComponents;
    }
  }

  /**
   * @async
   * @param {Entity} entity
   * @param {String} componentType
   * @returns {Promise<Entity>}
   * @throws {ComponentNotFoundError}
   */
  async removeComponent(entity, componentType) {
    if (!ValidationUtils.exists(entity.components[componentType])) {
      throw new ComponentNotFoundError(
        `[EntityManager] removeComponent() - component [${componentType}] does not exist on entity [${entity.id}].`,
      );
    }

    const oldComponentsKey = String(entity.componentsKey);
    delete entity.components[componentType];
    entity.componentsKey = this.getComponentsKey(
      Object.values(entity.components),
    );
    await this.cache(entity);
    await this.destroyByKeyAndId(oldComponentsKey, entity.id);
    return entity;
  }

  /**
   * @async
   * @param {Entity} entity
   * @param {String} componentTypes
   * @returns {Promise<Entity>}
   * @throws {ComponentNotFoundError}
   */
  async removeComponents(entity, componentTypes) {
    const oldComponentsKey = String(entity.componentsKey);
    await Promise.all(
      Array.from(componentTypes).map(async (componentType) => {
        if (!ValidationUtils.exists(entity.components[componentType])) {
          throw new ComponentNotFoundError(
            `[EntityManager] removeComponents() - component [${componentType}] does not exist on entity [${entity.id}].`,
          );
        }
        delete entity.components[componentType];
      }),
    );

    entity.componentsKey = this.getComponentsKey(
      Object.values(entity.components),
    );
    await this.cache(entity);
    await this.destroyByKeyAndId(oldComponentsKey, entity.id);
    return entity;
  }
}
export default EntityManager;
