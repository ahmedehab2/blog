import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import useSWR from "swr";

import axiosInstance from "../utils/axios-interceptor";
import { useUserStore } from "../store/store";
import { fetcher } from "../utils/fetchers";

export default function PostForm() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  if (!user) {
    navigate("/");
  }

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    data: post,
    error: postError,
    isLoading: isPostLoading,
  } = useSWR(isEditMode ? `/posts/${id}` : null, fetcher);

  useEffect(() => {
    if (post) {
      if (post.userId !== user.id) {
        navigate("/");
        return;
      }

      setForm({
        title: post?.title,
        description: post?.description,
        image: undefined,
        imageUrl: post?.image,
      });
    }
  }, [post, id, navigate, user.id]);

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true);

      const postData = new FormData();
      postData.append("title", form.title);
      postData.append("description", form.description);
      if (form.image) {
        postData.append("image", form.image);
      }

      if (isEditMode) {
        await axiosInstance.patch(`/posts/${id}`, postData);
      } else {
        await axiosInstance.post("/posts", postData);
      }

      navigate("/");
    } catch (error) {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        if (error.status === 422) {
          //valdiation err
          setError([...error.response.data.message]);
        } else {
          setError((prevError) => [...prevError, error.response.data.message]);
        }
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  }

  if (isEditMode && isPostLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <form
      className="form flex flex-col w-full md:w-3/4 mx-auto mt-2 p-4"
      onSubmit={(e) => handleSubmit(e)}
    >
      <h2 className="text-2xl font-bold mb-4">
        {isEditMode ? "Edit Post" : "Add New Post"}
      </h2>
      <ul className="mb-3">
        {error.length > 0
          ? error.map((e) => (
              <li className="text-red-500" key={e}>
                {e}
              </li>
            ))
          : null}
        {postError ? (
          <li className="text-red-500">Failed to load post data.</li>
        ) : null}
      </ul>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={(e) => handleChange(e)}
          required
          maxLength={50}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={(e) => handleChange(e)}
          required
          maxLength={500}
          className="w-full px-3 py-2 border rounded"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Image</label>

        {form.imageUrl && (
          <div className="mb-2">
            <img
              src={form.imageUrl}
              alt="Current post image"
              className="h-40 object-cover mb-2"
            />
            <p className="text-sm text-gray-500">
              {isEditMode ? "Current image (upload a new one to replace)" : ""}
            </p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={(e) => handleChange(e)}
          required={!isEditMode && !form.imageUrl}
          className="file-input file-input-neutral"
        />
        <span className="text-sm text-gray-500 ml-2">
          File size should be less than 1Mb.
        </span>
      </div>

      <button type="submit" className="btn">
        {isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : isEditMode ? (
          "Update Post"
        ) : (
          "Add Post"
        )}
      </button>
    </form>
  );
}
