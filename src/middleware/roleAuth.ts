import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/enums';
import AppError from '../utils/AppError';
import { User } from '../entities/User';

/**
 * Middleware to check if user has required role(s)
 * @param roles - Array of allowed roles
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
          403
        )
      );
    }

    next();
  };
};

/**
 * Middleware to check if user is SUPERADMIN
 */
export const requireSuperAdmin = requireRole(UserRole.SUPERADMIN);

/**
 * Middleware to check if user is ADMIN or SUPERADMIN
 */
export const requireAdmin = requireRole(UserRole.ADMIN, UserRole.SUPERADMIN);

/**
 * Check if user can manage other users
 * SUPERADMIN can manage anyone
 * ADMIN can only manage regular users (not other admins)
 */
export const canManageUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const currentUser = req.user;

  if (!currentUser) {
    return next(new AppError('Authentication required', 401));
  }

  // SUPERADMIN can manage anyone
  if (currentUser.role === UserRole.SUPERADMIN) {
    return next();
  }

  // ADMIN can only manage regular users
  if (currentUser.role === UserRole.ADMIN) {
    try {
      const targetUser = await User.findById(userId);

      if (!targetUser) {
        return next(new AppError('User not found', 404));
      }

      // Prevent ADMIN from managing other admins or superadmins
      if (
        targetUser.role === UserRole.ADMIN ||
        targetUser.role === UserRole.SUPERADMIN
      ) {
        return next(
          new AppError('You cannot manage admin or superadmin accounts', 403)
        );
      }

      return next();
    } catch (error) {
      return next(new AppError('Error checking user permissions', 500));
    }
  }

  // If not ADMIN or SUPERADMIN, deny access
  return next(new AppError('Access denied', 403));
};
