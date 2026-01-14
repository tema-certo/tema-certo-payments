import { UserImplementation } from './repository';
import { UserService } from './services';

const repository = new UserImplementation();
export const userService = new UserService(repository);
