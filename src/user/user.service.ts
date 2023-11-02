import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Model } from "mongoose";
import { randomUUID } from "crypto";
import { default as bcrypt } from "bcryptjs"


@Injectable()
export class UserService {
	constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
    ) {}

	private saltRounds = 10

	async findOne(username: string): Promise<User | undefined> {
		return (await this.userModel.find({username}))[0];
	}

	async create(username: string, password: string): Promise<User> {
		const salt = await bcrypt.genSalt(this.saltRounds)
		const hash = await bcrypt.hash(password, salt)

		const newUser: User = {
			id: randomUUID(),
			username,
			role: "free",
			password: hash,
			limit: 200,
		}

		return (new this.userModel(newUser)).save()
	}
}
