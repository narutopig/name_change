import fetch from "node-fetch";

export interface IGetToken {
    email: string;
    password: string;
}

export async function getToken(options: IGetToken): Promise<string> {
    const { email, password } = options;
    const { accessToken } = await fetch(
        "https://authserver.mojang.com/authenticate",
        {
            method: "POST",
            body: JSON.stringify({
                agent: {
                    name: "Minecraft", // identifying which game is connecting
                    version: 1,
                },
                username: email,
                password: password,
                requestUser: "true", // request a response back containing user information
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
        .then((res) => res.json())
        .catch((err) => {
            throw new Error(err);
        });

    return accessToken;
}

export async function changeName(
    newName: string,
    accessToken: string
): Promise<number> {
    let status: number = 0;
    await fetch(
        "https://api.minecraftservices.com/minecraft/profile/name/" + newName,
        {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        }
    ).then((res) => (status = res.status));
    return status;
}
