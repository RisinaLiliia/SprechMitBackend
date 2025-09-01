import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const usersSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: { type: String, required: true, minlength: 6 },

    avatarUrl: { type: String, default: null },
    languageLevel: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      default: "A1",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    privacyPolicyAcceptedAt: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

usersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model("User", usersSchema);
