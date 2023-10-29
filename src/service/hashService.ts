import * as bcrypt from "bcrypt";
class Hash {
  algorithm = "bcrypt";

  static compare(a: string, b: string): Promise<boolean> {
    return bcrypt.compare(a, b);
  }
}

export default Hash;
