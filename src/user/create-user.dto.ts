import { ApiProperty } from "@nestjs/swagger";

export class createUserDto {
    @ApiProperty()
    username: string;
  
    @ApiProperty()
    password: string;
}