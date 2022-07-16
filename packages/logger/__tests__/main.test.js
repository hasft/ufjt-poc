import { logger } from '../src/main';

test('logger', () => {
  console.log = jest.fn();
  logger.info('info');
  expect(console.log.mock.calls[0][0]).toContain('info');
});