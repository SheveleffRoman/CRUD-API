import { User } from "../interfaces";

class LocalDatabase {
  userList: User[] = [];

  getUsers(): User[] {
    return [...this.userList];
  }

  getUser(userId: string): User | undefined {
    return this.userList.find((user) => user.id === userId);
  }

  addUser(newUser: User): void {
    this.userList = [...this.userList, { ...newUser }];
  }

  updateUser(updatedUser: User): void {
    const updatedList = this.userList.map((user) =>
      user.id === updatedUser.id ? { ...updatedUser } : { ...user }
    );

    this.userList = updatedList;
  }

  deleteUser(userId: string): User | null {
    const userIndex = this.userList.findIndex((user) => user.id === userId);

    if (userIndex >= 0) {
      const deletedUser = this.userList.splice(userIndex, 1)[0];
      return deletedUser;
    }

    return null;
  }
}

const db = new LocalDatabase();

export default db;
