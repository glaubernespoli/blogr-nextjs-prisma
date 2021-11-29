import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import prisma from "../../lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let id: string;
  if (typeof params?.id === "string") {
    id = params?.id;
  } else {
    id = params?.id[0];
  }
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: post,
  };
};

const publishPost = async (id: string, router: NextRouter): Promise<void> => {
  await fetch(`http://localhost:3000/api/publish/${id}`, {
    method: "PUT",
  });
  await router.push("/");
};

const deletePost = async (id: string, router: NextRouter): Promise<void> => {
  await fetch(`http://localhost:3000/api/post/${id}`, {
    method: "DELETE",
  });
  await router.push("/");
};

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  const postBelongsToUser = session?.user?.email === props.author?.email;

  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown>{props.content}</ReactMarkdown>
        {!props.published && status === "authenticated" && postBelongsToUser && (
          <button onClick={() => publishPost(props.id, router)}>Publish</button>
        )}
        {status === "authenticated" && postBelongsToUser && (
          <button onClick={() => deletePost(props.id, router)}>Delete</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;
