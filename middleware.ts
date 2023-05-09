import { getToken } from 'next-auth/jwt';
import { NextMiddleware, NextRequest, NextResponse } from 'next/server';

const isAuthenticated = async (req: NextRequest): Promise<boolean> => {
  const session = await getToken({ req, secret: process.env.SECRET });
  return !!session;
};

const isTeacher = async (req: NextRequest): Promise<boolean> => {
  const session = await getToken({
    req,
    secret: process.env.SECRET,
  });
  return session?.user?.role === 'TEACHER';
};

// async function isUserCreator(
//   req: NextRequest,
//   itemId: string,
//   type: string
// ): Promise<boolean | NextResponse> {
//   const session = await getToken({ req, secret: process.env.SECRET });
//   const userId = session?.user?.id;

//   if (!userId) {
//     req.nextUrl.pathname = '/auth/signin';
//     return NextResponse.redirect(req.nextUrl);
//   }

//   let item;

//   if (type === 'project') {
//     item = await getProjectById(itemId);
//   }
//   item = await prisma.classroom.findFirst({
//     where: { id: itemId },
//   });

//   return item ? item.createdBy === userId : false;
// }

const middleware: NextMiddleware = async (req) => {
  const url = req.nextUrl;

  if (url.pathname === '/auth/signin' || url.pathname === '/auth/signup') {
    const moreHeaders = new Headers(req.headers);
    // Use this header to actually enforce CSP, otherwise it is running in Report Only mode on all pages.
    moreHeaders.set('x-csp-enforce', 'true');
    return NextResponse.next({
      request: {
        headers: moreHeaders,
      },
    });
  }

  if (url.pathname === '/tasks') {
    if (!(await isTeacher(req))) {
      req.nextUrl.pathname = '/';
      return NextResponse.redirect(req.nextUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/teacher/:path*',
    '/auth/signin',
    '/auth/signup',
    '/tasks',
    '/projects/:path*',
    '/classroom/:path*',
  ],
};

export default middleware;
