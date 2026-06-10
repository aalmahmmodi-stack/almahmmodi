import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: () => {},
    } as TrpcContext['res'],
  };
}

describe('Students Router', () => {
  it('should list students with search', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.students.list({
      search: '',
      status: '',
      graduationYear: 0,
      university: '',
      qualification: '',
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should filter students by status', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.students.list({
      search: '',
      status: 'مستوفى',
      graduationYear: 0,
      university: '',
      qualification: '',
    });

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      result.forEach((student: any) => {
        expect(student.status).toBe('مستوفى');
      });
    }
  });

  it('should get student statistics', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.students.getStats();

    expect(stats).toBeDefined();
    expect(stats.total).toBeGreaterThan(0);
    expect(typeof stats.byStatus).toBe('object');
  });
});
