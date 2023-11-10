import { ApiProperty } from "@nestjs/swagger"

export class createUserDto {
    @ApiProperty()
    username: string

    @ApiProperty()
    password: string
}

export class editUserDto {
    username?: string
    password?: string
    role?: "free" | "premium" | "admin"
    limit?: number
}
