import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { User, UserDocument } from "./user.schema"
import { Model } from "mongoose"
import { randomUUID } from "crypto"
import { default as bcrypt } from "bcryptjs"
import { BadRequestError } from "../helper/errorManager"
import { editUserDto } from "./user.dto"

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
    ) {}

    private saltRounds = 10

	async getFromUsername(username: string): Promise<User | undefined> {
		return this.userModel.findOne({username})
	}
	async getFromId(id: string): Promise<User | undefined> {
		return this.userModel.findOne({id})
	}

    async create(username: string, password: string) {
        const salt = await bcrypt.genSalt(this.saltRounds)
        const hash = await bcrypt.hash(password, salt)

		if (await this.getFromUsername(username)) {			
			throw BadRequestError("Username already exists")
		}

        const newUser: User = {
            id: randomUUID(),
            username,
            role: "free",
            password: hash,
            limit: 200,
        }

        return new this.userModel(newUser).save()
    }

    async edit(id: string, userDto: editUserDto) {
        const user = this.userModel.findOneAndUpdate({ id: id }, userDto, {
            new: true,
        })
        if (!user) {
            throw BadRequestError("Cannot find user")
        }
        return user
    }
}
