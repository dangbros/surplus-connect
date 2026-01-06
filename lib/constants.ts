export const ROLES = {
    DONOR: 'DONOR',
    NGO: 'NGO',
    VOLUNTEER: 'VOLUNTEER',
} as const

export type UserRole = keyof typeof ROLES
