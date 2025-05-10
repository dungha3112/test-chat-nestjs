import { Controller } from '@nestjs/common';
import { Routes } from 'src/utils/constants';

@Controller(Routes.USER)
export class UserController {
  constructor() {}
}
