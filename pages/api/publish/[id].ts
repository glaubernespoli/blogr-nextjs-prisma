import { NextApiRequest, NextApiResponse } from "next";

// PUT /api/publish/:id
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const queryId = req.query.id;
  let id: string;
  if (typeof queryId === "string") {
    id = queryId;
  } else {
    id = queryId[0];
  }

  const post = await prisma.post.update({
    where: { id: id },
    data: { published: true },
  });

  res.json(post);
};
