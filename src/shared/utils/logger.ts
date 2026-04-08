import log from 'loglevel';

const logger = log.getLogger('arvo-auth');

if (process.env.NODE_ENV === 'production') {
  logger.setLevel('warn');
} else {
  logger.setLevel('debug');
}

export { logger };
