import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { exportToExcel, exportToPDF } from "./export-utils";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  students: router({
    list: publicProcedure
      .input((val: unknown) => {
        const obj = val as any;
        return {
          search: obj?.search || '',
          status: obj?.status || '',
          graduationYear: obj?.graduationYear || 0,
          university: obj?.university || '',
          qualification: obj?.qualification || '',
        };
      })
      .query(async ({ input }) => {
        const query = await db.getStudents({
          search: input.search || undefined,
          status: input.status || undefined,
          graduationYear: input.graduationYear || undefined,
          university: input.university || undefined,
          qualification: input.qualification || undefined,
        });
        return query;
      }),
    getById: publicProcedure
      .input((val: unknown) => (val as any).id as number)
      .query(({ input }) => db.getStudentById(input)),
    create: protectedProcedure
      .input((val: unknown) => val as any)
      .mutation(({ input }) => db.createStudent(input)),
    update: protectedProcedure
      .input((val: unknown) => val as any)
      .mutation(({ input }) => db.updateStudent(input.id, input.data)),
    delete: protectedProcedure
      .input((val: unknown) => (val as any).id as number)
      .mutation(({ input }) => db.deleteStudent(input)),
    getStats: publicProcedure.query(() => db.getStudentStats()),
    exportExcel: publicProcedure
      .input((val: unknown) => {
        const obj = val as any;
        return {
          search: obj?.search || '',
          status: obj?.status || '',
          graduationYear: obj?.graduationYear || 0,
          university: obj?.university || '',
          qualification: obj?.qualification || '',
        };
      })
      .query(async ({ input }) => {
        const students = await db.getStudents({
          search: input.search || undefined,
          status: input.status || undefined,
          graduationYear: input.graduationYear || undefined,
          university: input.university || undefined,
          qualification: input.qualification || undefined,
        });
        const buffer = exportToExcel(students as any);
        return buffer.toString('base64');
      }),
    exportPDF: publicProcedure
      .input((val: unknown) => {
        const obj = val as any;
        return {
          search: obj?.search || '',
          status: obj?.status || '',
          graduationYear: obj?.graduationYear || 0,
          university: obj?.university || '',
          qualification: obj?.qualification || '',
        };
      })
      .query(async ({ input }) => {
        const students = await db.getStudents({
          search: input.search || undefined,
          status: input.status || undefined,
          graduationYear: input.graduationYear || undefined,
          university: input.university || undefined,
          qualification: input.qualification || undefined,
        });
        const buffer = await exportToPDF(students as any);
        return buffer.toString('base64');
      }),
  }),
});

export type AppRouter = typeof appRouter;


