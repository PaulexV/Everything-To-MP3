import { HttpException, HttpStatus, Injectable } from "@nestjs/common"

export const BadRequestError = (
    payload = "An Error Occured",
): HttpException => {
    return new HttpException(
        {
            status: HttpStatus.BAD_REQUEST,
            error: payload,
        },
        HttpStatus.BAD_REQUEST,
    )
}
