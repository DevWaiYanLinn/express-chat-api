import * as bcrypt from "bcrypt";
class Hash {
  algorithm = "bcrypt";

  static async compare(a: string, b: string): Promise<boolean> {
    return await bcrypt.compare(a, b);
  }
}

export default Hash;
