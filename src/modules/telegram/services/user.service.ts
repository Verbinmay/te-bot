import { log } from 'console';
import { User } from 'src/modules/telegram/entities/user.entity';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from '../dto/user/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(a: CreateUserDto) {
    const user = new User();
    user.telegramId = a.telegramId;
    user.role = a.role;
    user.firstName = a.firstName;
    user.lastName = a.lastName;
    user.userName = a.userName;

    await this.userRepository.create(user);
    return await this.userRepository.save(user);
  }
  async update(user: User) {
    return await this.userRepository.save(user);
  }

  async removeAdmin(telegramId: string): Promise<boolean> {
    const user: User | null = await this.getByTelegramId(telegramId);
    if (!user) return false;
    user.role = 'user';
    const notAdmin = await this.userRepository.save(user);

    return notAdmin.role === 'user';
  }
  async addAdmin(userName: string): Promise<boolean> {
    const user: User | null = await this.userRepository.findOneBy({
      userName: userName,
    });
    if (!user) return false;
    user.role = 'admin';
    const notAdmin = await this.userRepository.save(user);

    return notAdmin.role === 'admin';
  }
  async getByTelegramId(telegramId: string) {
    return await this.userRepository.findOne({
      where: { telegramId: telegramId },
    });
  }
  async getByUserName(userName: string) {
    return await this.userRepository.findOne({
      where: { userName: userName },
    });
  }
  async getAllAdministrators() {
    return await this.userRepository.find({
      where: { role: 'admin' },
    });
  }

  // async hiAdmin(userIdFromDb: string) {
  //   const user = await this.getById(userIdFromDb);
  //   console.log(user);
  //   if (!user) return null;
  //   user.isAdmin = true;
  //   return await this.update(user);
  // }
  // async getAll() {
  //   return this.taskRepository.find();
  // }
  // async getAllWithPagination(num: number) {
  //   return this.taskRepository.find({
  //     where: {
  //       isPublished: true,
  //     },
  //     order: { createdAt: 'ASC' },
  //     skip: (num - 1) * 20,
  //     take: 20,
  //   });
  // }
  // async getCount() {
  //   return this.taskRepository.count();
  // }

  // async getById(id: string) {
  //   return await this.userRepository.findOne({
  //     relations: { answers: true },
  //     where: { id: id },
  //   });
  // }
  // async doneTask(id: number) {
  //   const task: TaskEntity = await this.taskRepository.findOneBy({ id: id });

  //   if (!task) return null;
  //   task.isComplied = !task.isComplied;

  //   await this.taskRepository.save(task);
  //   return this.getAll();
  // }
  // async editTask(id: number, name: string) {
  //   const task: TaskEntity | null = await this.taskRepository.findOneBy({
  //     id: id,
  //   });

  //   if (!task) return null;

  //   task.name = name;

  //   await this.taskRepository.save(task);
  //   return this.getAll();
  // }
  // async create(task: TaskEntity) {
  //   await this.taskRepository.create(task);
  //   await this.taskRepository.save(task);
  //   return this.getAll();
  // }
  // async deleteTask(id: number) {
  //   const deletedInfo = await this.taskRepository.delete({ id: id });

  //   if (deletedInfo.affected === 0) return false;

  //   return this.getAll();
  // }
}
