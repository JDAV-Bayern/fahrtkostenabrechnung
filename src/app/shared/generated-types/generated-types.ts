import { z } from 'zod';

export const SectionDTO = z
  .object({
    number: z.number().int(),
    name: z.string(),
    state: z.union([z.string(), z.null()]).optional(),
    district: z.union([z.string(), z.null()]).optional()
  })
  .passthrough();
export const SectionListDTO = z
  .object({ sections: z.array(SectionDTO) })
  .passthrough();
export const ValidationError = z
  .object({
    loc: z.array(z.union([z.string(), z.number()])),
    msg: z.string(),
    type: z.string()
  })
  .passthrough();
export const HTTPValidationError = z
  .object({ detail: z.array(ValidationError) })
  .partial()
  .passthrough();
export const AuthInfo = z
  .object({
    user_id: z.string(),
    roles: z.array(z.string()).optional().default([])
  })
  .passthrough();
export const UserInfo = z
  .object({
    sub: z.string(),
    email: z.union([z.string(), z.null()]).optional(),
    name: z.union([z.string(), z.null()]).optional(),
    preferred_username: z.union([z.string(), z.null()]).optional()
  })
  .passthrough();
export const UserInfoDTO = z
  .object({ authInfo: AuthInfo, userInfo: UserInfo })
  .passthrough();
// prettier-ignore
export type SectionDTOType = z.infer<typeof SectionDTO>;
// prettier-ignore
export type SectionListDTOType = z.infer<typeof SectionListDTO>;
// prettier-ignore
export type ValidationErrorType = z.infer<typeof ValidationError>;
// prettier-ignore
export type HTTPValidationErrorType = z.infer<typeof HTTPValidationError>;
// prettier-ignore
export type AuthInfoType = z.infer<typeof AuthInfo>;
// prettier-ignore
export type UserInfoType = z.infer<typeof UserInfo>;
// prettier-ignore
export type UserInfoDTOType = z.infer<typeof UserInfoDTO>;
