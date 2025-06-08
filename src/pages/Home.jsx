import useSWR from "swr";
import { deletPost, fetcher } from "../utils/fetchers";
import { useUserStore } from "../store/store";
import { Link } from "react-router";

export default function Home() {
  const { data, error, isLoading, mutate } = useSWR(
    `${import.meta.env.VITE_BACKEND_URL}/posts`,
    fetcher
  );
  const user = useUserStore((state) => state.user);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 font-bold">Error loading posts</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  async function handleDeletePost(id) {
    try {
      await mutate(deletPost(id), {
        optimisticData: data.filter((post) => post._id !== id),
        populateCache: false,
        revalidate: false,
        rollbackOnError: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {!data || data.length === 0 ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-bold">No posts available</div>
        </div>
      ) : (
        <div className="flex flex-col items-center md:w-2/3 lg:w-1/2 mx-auto relative top-30">
          {data.map((post) => (
            <article
              key={post._id}
              className="card w-full bg-base-100 shadow-xl mb-4"
            >
              <figure>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-100 object-cover hover:scale-110 transition"
                />
              </figure>
              <div className="card-body">
                <div className="card-title justify-between">
                  <h2>{post.title}</h2>
                  <span className="text-sm text-gray-500">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <p>{post.description}</p>
                {user && user.id === post.userId ? (
                  <div className="card-actions justify-end mt-2">
                    <Link to={`/edit/${post._id}`} className="btn rounded-xl">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </Link>
                    <button
                      className="btn rounded-xl"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
      {user && (
        <Link
          to="new"
          className="fixed bottom-4 right-4 lg:bottom-10 lg:right-10 btn btn-primary rounded-full shadow-lg size-12"
        >
          +
        </Link>
      )}
    </>
  );
}
