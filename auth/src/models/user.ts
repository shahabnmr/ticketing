import mongoose from "mongoose";
import { Password } from "../services/password";

// ye interface misazim ke be typescript betonim moarefi koni properti haye user ro
// dar typescript bayad noy ha moshakhas bashe khoob(email,password)
interface UserAttrs {
  email: string;
  password: string;
}

// ye inferface dige moarefi mikonim baraye ezafe kardam function build be User model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// interface dige baraye inke vaghti etelaat user ro az mongo migirim ye seri etelaat dige ham be ma mide maslan createdAt va ....
// har chi ke mikhaim az mongo begirim ro inja midim
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id; // baraye inke dar javab _id nayad va be jash id biad ke ba baghie db ha name id yeki bashe
        delete ret._id;
        delete ret.password; // inkaro kardim ke vaghti user zakhire shod dar javab password ro be ma barnagardone
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
// ye function tarif kardim dakhl User model va ba estefade az hamin function user mitonim add konim
// ba in kar be typescript type haro moarefi konim
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
