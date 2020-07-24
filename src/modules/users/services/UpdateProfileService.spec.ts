import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Roge Cristo',
      email: 'roge17@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Roge Rodrigues',
      email: 'roge17r@gmail.com',
    });

    expect(updatedUser.name).toBe('Roge Rodrigues');
    expect(updatedUser.email).toBe('roge17r@gmail.com');
  });

  it('should not be able to update email with already used email', async () => {
    await fakeUsersRepository.create({
      name: 'Roge Cristo',
      email: 'roge17@gmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'teste@teste.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Roge Cristo',
        email: 'roge17@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Roge Cristo',
      email: 'roge17@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Roge Rodrigues',
      email: 'roge17r@gmail.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should be able not to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Roge Cristo',
      email: 'roge17@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Roge Rodrigues',
        email: 'roge17r@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able not to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Roge Cristo',
      email: 'roge17@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Roge Rodrigues',
        email: 'roge17r@gmail.com',
        old_password: 'old-wrong-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'teste@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
