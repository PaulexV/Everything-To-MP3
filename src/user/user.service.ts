import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Model } from "mongoose";
import { randomUUID } from "crypto";
import { default as bcrypt } from "bcryptjs"
import { BadRequestError } from "../helper/errorManager"


@Injectable()
export class UserService {
	constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
    ) {}

	private saltRounds = 10

	async findOne(username: string): Promise<User | undefined> {
		return (await this.userModel.find({username}))[0]
	}

	async alreadyExists(username: string): Promise<boolean> {
		return (await this.findOne(username)) !== undefined
	}

	async create(username: string, password: string) {
		const salt = await bcrypt.genSalt(this.saltRounds)
		const hash = await bcrypt.hash(password, salt)

		if (this.alreadyExists(username)) {
			throw BadRequestError("Username already exists")
		}

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
