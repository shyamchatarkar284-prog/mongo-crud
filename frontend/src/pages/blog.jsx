import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify"
import axios from "axios"
import { useEffect, useState } from 'react';
import { id } from 'zod/v4/locales';

const Blog = () => {

  const [allBlogs, setAllBlogs] = useState([])

  const [selectedBlog, setSelectedBlog] = useState(null)

  const API_URL = import.meta.env.VITE_NODE_ENV === "development"
    ? import.meta.env.VITE_LOCAL_URL
    : import.meta.env.VITE_LIVE_URL

  const schema = z.object({
    title: z.string().min(3),
    desc: z.string().min(3, 'Minimum 3 characters'),
    hero: z.string().min(3, 'Minimum 3 characters').url(),
  });

  const { handleSubmit, register, reset, formState: { errors, touchedFields } } = useForm({
    resolver: zodResolver(schema)
  });

  const handleFormSubmit = (blogdata) => {
    try {
      console.log(blogdata);
      if (setAllBlogs) {
        modifyBlog(selectedBlog._id, blogdata)
        reset({ title: "", desc: "", hero: "" })
        setSelectedBlog(null)
      } else {
        createBlog(blogdata)
        reset()
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClasses = (key) => clsx({
    'form-control my-2': true,
    'is-invalid': errors[key],
    'is-valid': touchedFields[key] && !errors[key],
  });

  const createBlog = async blogdata => {
    try {
      await axios.post(`${API_URL}/create`, blogdata)
      toast.success("blog create success")
      readBlog()
    } catch (error) {
      console.log(error)
      toast.error("something went wrong")
    }
  }

  const readBlog = async () => {
    try {
      const { data } = await axios.get(API_URL)
      console.log(data)
      setAllBlogs(data.result)
    } catch (error) {
      console.log(error)
      toast.error("something went wrong")
    }
  }

  const removeBlog = async id => {
    try {
      await axios.delete(`${API_URL}/remove/${id}`)
      toast.success("blog delete success")
      readBlog()
    } catch (error) {
      console.log(error)
      toast.error("something went wrong")
    }
  }

  const modifyBlog = async (id, blogdata) => {
    try {
      await axios.put(`${API_URL}/modify/${id}`, blogdata)
      toast.success("blog update success")
      readBlog()
    } catch (error) {
      console.log(error)
      toast.error("something went wrong")
    }
  }



  useEffect(() => {
    readBlog()
  }, [])


  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-6 offset-sm-3">
          <div className="card">
            <div className="card-header">BLOG CRUD</div>
            <div className="card-body">
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div>
                  <label htmlFor="title" className="form-label">title</label>
                  <input
                    type="text"
                    {...register('title')}
                    className={handleClasses('title')}
                    id="title"
                    placeholder="Enter Your title"
                  />
                  <div className="invalid-feedback">{errors.title?.message}</div>
                </div>

                <div className="mt-2">
                  <label htmlFor="desc" className="form-label">desc</label>
                  <input
                    type="desc"
                    {...register('desc')}
                    className={handleClasses('desc')}
                    id="desc"
                    placeholder="Enter Your desc"
                  />
                  <div className="invalid-feedback">{errors.desc?.message}</div>
                </div>

                <div className="mt-2">
                  <label htmlFor="hero" className="form-label">hero</label>
                  <input
                    type="hero"
                    {...register('hero')}
                    className={handleClasses('hero')}
                    id="hero"
                    placeholder="Enter Your hero"
                  />
                  <div className="invalid-feedback">{errors.hero?.message}</div>
                </div>

                {
                  selectedBlog
                    ? <div>
                      <button type="submit" className="btn btn-warning w-100 mt-3">
                        update blog
                      </button>

                      <button onClick={() => {
                        reset({ title: "", desc: "", hero: "" })
                        setSelectedBlog(null)
                      }} type="button" className="btn btn-outline-secondary w-100 mt-3">
                        Cancel
                      </button>
                    </div>

                    : <button type="submit" className="btn btn-primary w-100 mt-3">
                      create blog
                    </button>
                }

              </form>

              <p className="text-center mt-3">
                Don't have an account? <Link to="/register">Create Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {
        allBlogs && <table className='table table-bordered table-striped'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Desc</th>
              <th>Hero</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              allBlogs.map(item => <tr>
                <td>{item._id}</td>
                <td>{item.title}</td>
                <td>{item.desc}</td>
                <td>
                  <img src={item.hero} height={50} alt="" />
                </td>
                <td>
                  <button onClick={() => {
                    reset(item)
                    setSelectedBlog(item)
                  }}>Edit</button>
                  <button onClick={() => removeBlog(item._id)}>Remove</button>
                </td>
              </tr>)
            }
          </tbody>
        </table>
      }

    </div>
  );
};

export default Blog;