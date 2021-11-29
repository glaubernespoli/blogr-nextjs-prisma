import { NextApiRequest, NextApiResponse } from "next";

// DELETE /api/post/:id
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const queryId = req.query.id;
  let id: string;
  if (typeof queryId === "string") {
    id = queryId;
  } else {
    id = queryId[0];
  }

  if (req.method === "DELETE") {
    const post = await prisma.post.delete({
      where: { id: id },
    });

    res.json(post);
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
  }
};
