import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, currentUser, handleDelete, handleLike }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const toggleVisibility = () => setVisible(!visible)

  /*
  const handleLike = async () => {
    try {
      const updatedBlog = {
        user: blog.user.id || blog.user._id, // send user id
        likes: likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      }

      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setLikes(returnedBlog.likes)
    } catch (error) {
      console.error(error)
    }
  }

   */

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>
            {visible ? 'hide' : 'view'}
          </button>
        </div>

        {visible && (
            <div>
              <div>{blog.url}</div>
              <div>
                likes {likes} <button onClick={handleLike}>like</button>
              </div>
              {currentUser.username === blog.user?.username && (
                  <button onClick={() => handleDelete(blog)}>remove</button>
              )}
              <div>{blog.user && blog.user.name}</div>
            </div>
        )}
      </div>
  )
}

export default Blog