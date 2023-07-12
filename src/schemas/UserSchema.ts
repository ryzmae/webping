import mongoose from "mongoose";

export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}

export const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

export const UserModel = mongoose.model<User>("User", userSchema);

export const findIdByUrl = async (url: string): Promise<string | null> => {
  const userobject = await UserModel.findOne({ url }).select("_id").exec();
  return userobject?._id.toString() || null;
};
