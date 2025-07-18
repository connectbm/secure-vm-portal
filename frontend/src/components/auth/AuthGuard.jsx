import React from 'react'
import { useAuth } from '../../contexts/AuthContext' // Fixed path: ../../ instead of ../
import { Navigate } from 'react-router-dom'

const AuthGuard = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Role validation logic - Allow admin to access both portals
  if (requiredRole) {
    const hasAccess = checkRoleAccess(user, requiredRole)
    
    if (!hasAccess) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <p className="text-sm text-gray-500">
              Your role: <span className="font-medium">{user?.role}</span><br/>
              Required role: <span className="font-medium">{requiredRole}</span>
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    }
  }

  return children
}

// Helper function to check role access
const checkRoleAccess = (user, requiredRole) => {
  if (!user || !user.role) {
    return false
  }

  // Admin can access both admin and employee portals
  if (user.role === 'admin') {
    return true // Admin has access to everything
  }

  // Employee can only access employee portal
  if (user.role === 'employee' && requiredRole === 'employee') {
    return true
  }

  // Specific role match
  if (user.role === requiredRole) {
    return true
  }

  return false
}

export default AuthGuard
