import log from 'npmlog';
import ApplicationPropertyModel from '../db/application_property';

const LOG_PREFIX = 'CORE_DAO_APPLICATION_PROPERTY';

export async function addApplicationProperty(key, value) {
  log.info(LOG_PREFIX, 'add application property:', key, value);

  const existingApplicationProperty = await ApplicationPropertyModel.findOne({ key });
  if (existingApplicationProperty) {
    log.error(LOG_PREFIX, 'application property with key already exists', key);
    throw new Error(`can't create application property, application property with key already exists: ${key}`);
  }

  const applicationProperty = new ApplicationPropertyModel();
  applicationProperty.key = key;
  applicationProperty.value = value;

  log.verbose(LOG_PREFIX, JSON.stringify(applicationProperty));
  return applicationProperty.save();
}

export async function updateApplicationProperty(key, newKey, value) {
  log.info(LOG_PREFIX, 'update application property:', key, newKey, value);

  const applicationProperty = await ApplicationPropertyModel.findOne({ key });
  if (!applicationProperty) {
    log.error(LOG_PREFIX, 'no application property found with key:', key);
    throw new Error(`can't update application property, no application property found with key: ${key}`);
  }

  if (newKey) {
    const applicationPropertyWithNewKey = await ApplicationPropertyModel.findOne({ key: newKey });
    if (applicationPropertyWithNewKey) {
      log.error(LOG_PREFIX, 'application property with key already exists:', newKey);
      throw new Error(`can't update application property, application property with key already exists: ${newKey}`);
    }
    applicationProperty.key = newKey;
  }

  applicationProperty.value = value;

  log.verbose(LOG_PREFIX, JSON.stringify(applicationProperty));
  return applicationProperty.save();
}

export async function removeApplicationProperty(key) {
  log.info(LOG_PREFIX, 'delete application property:', key);

  const applicationProperty = await ApplicationPropertyModel.findOne({ key });
  if (!applicationProperty) {
    log.error(LOG_PREFIX, 'no application property found with key:', key);
    throw new Error(`can't delete application property, no application property found with key: ${key}`);
  }

  const deleted = await ApplicationPropertyModel.findOneAndDelete({ key });
  log.verbose(LOG_PREFIX, JSON.stringify(deleted));
  return deleted;
}

export async function getApplicationPropertyByKey(key, fallback) {
  log.info(LOG_PREFIX, 'get applicationProperty by key:', key, fallback);

  const applicationProperty = await ApplicationPropertyModel.findOne({ key });
  if (!applicationProperty) {
    if (fallback !== undefined) {
      log.verbose(LOG_PREFIX, fallback);
      return fallback;
    }
    log.error(LOG_PREFIX, 'no application property found with key:', key);
    throw new Error(`can't get application property, no application property found with key: ${key}`);
  }

  log.verbose(LOG_PREFIX, JSON.stringify(applicationProperty));
  return applicationProperty;
}

export async function getApplicationPropertyList() {
  log.info(LOG_PREFIX, 'get application property list');

  const applicationProperties = await ApplicationPropertyModel.find();
  log.verbose(LOG_PREFIX, JSON.stringify(applicationProperties));
  return applicationProperties;
}
