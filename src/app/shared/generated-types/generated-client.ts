import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const SectionDTO = z
  .object({
    number: z.number().int(),
    name: z.string(),
    state: z.union([z.string(), z.null()]).optional(),
    district: z.union([z.string(), z.null()]).optional()
  })
  .passthrough();
const SectionListDTO = z
  .object({ sections: z.array(SectionDTO) })
  .passthrough();
const ValidationError = z
  .object({
    loc: z.array(z.union([z.string(), z.number()])),
    msg: z.string(),
    type: z.string()
  })
  .passthrough();
const HTTPValidationError = z
  .object({ detail: z.array(ValidationError) })
  .partial()
  .passthrough();
const AuthInfo = z
  .object({
    user_id: z.string(),
    roles: z.array(z.string()).optional().default([])
  })
  .passthrough();
const UserInfo = z
  .object({
    sub: z.string(),
    email: z.union([z.string(), z.null()]).optional(),
    name: z.union([z.string(), z.null()]).optional(),
    preferred_username: z.union([z.string(), z.null()]).optional()
  })
  .passthrough();
const UserInfoDTO = z
  .object({ authInfo: AuthInfo, userInfo: UserInfo })
  .passthrough();

export const schemas = {
  SectionDTO,
  SectionListDTO,
  ValidationError,
  HTTPValidationError,
  AuthInfo,
  UserInfo,
  UserInfoDTO
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/healthz',
    alias: 'healthz_healthz_get',
    requestFormat: 'json',
    response: z.string()
  },
  {
    method: 'get',
    path: '/sections',
    alias: 'get_sections_sections_get',
    requestFormat: 'json',
    response: SectionListDTO
  },
  {
    method: 'post',
    path: '/sections',
    alias: 'create_section_sections_post',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: SectionDTO
      }
    ],
    response: SectionDTO,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError
      }
    ]
  },
  {
    method: 'patch',
    path: '/sections/:number',
    alias: 'update_section_sections__number__patch',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: SectionDTO
      },
      {
        name: 'number',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError
      }
    ]
  },
  {
    method: 'delete',
    path: '/sections/:number',
    alias: 'delete_section_sections__number__delete',
    requestFormat: 'json',
    parameters: [
      {
        name: 'number',
        type: 'Path',
        schema: z.number().int()
      }
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError
      }
    ]
  },
  {
    method: 'get',
    path: '/userinfo',
    alias: 'read_userinfo_userinfo_get',
    requestFormat: 'json',
    response: UserInfoDTO
  }
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
