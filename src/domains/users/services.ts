import { UserWithPermissions } from '~/domains/users/model';
import { UserRepository } from '~/domains/users/repository';

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async findById(id: number): Promise<UserWithPermissions | undefined> {
        return this.userRepository.findById(id);
    }
}
