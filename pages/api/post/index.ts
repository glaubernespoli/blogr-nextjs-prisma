import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { title, content } = req.body;

  const session = await getSession({ req });

  try {
    const result = await prisma.post.create({
      data: {
        title: title,
        content: content,
        author: { connect: { email: session?.user?.email } },
      },
    });
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json(error);
  }
}
