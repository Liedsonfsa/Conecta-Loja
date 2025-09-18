import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const creteUser = async (data: {
    name: string,
    email: string,
    password: string,
    contact: string
}) => {
    return await prisma.usuario.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            contact: data.contact
        }
    });
};