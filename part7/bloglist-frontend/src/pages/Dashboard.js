import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import {connect} from 'react-redux';

import { initBlogs, createBlog, updateBlog, deleteBlog } from '../store/actions/blogActions'
import {setAuthData, logout} from "../store/actions/authActions";

import BlogsList from '../components/BlogsList'
import Heading from '../components/Heading'
import UserDetails from '../components/UserDetails'
import AddBlogForm from '../components/AddBlogForm'
import Message from '../components/Message'

const Dashboard = (props) => {

  const handleLogOut = () => {
    props.logout()
  }

  const handleBlogAdded = async newBlog => {
    props.createBlog(newBlog)
  }

  const handleLikeClick = newBlog => {
    props.updateBlog(newBlog)
  }

  const handleBlogDelete = id => {
    props.deleteBlog(id);
  }

  const sortBlogs = unsortedBlogs => {
    return unsortedBlogs.sort((a, b) => {
      if (a.likes < b.likes) {
        return 1
      } else {
        return -1
      }
    })
  }

  useEffect(() => {
    props.initBlogs();
  }, [])

  if(!props.auth.user) return <Redirect to="/login" />

  return (
    <div className="App">
        <Heading text="blogs" />
        {props.notification && <Message notification={props.notification} />}
        <UserDetails user={props.auth.user} onLogOut={handleLogOut} />
        <AddBlogForm onBlogAdded={handleBlogAdded} />
        <BlogsList
            blogs={sortBlogs(props.blogs)}
            onLikeClick={handleLikeClick}
            onBlogDelete={handleBlogDelete}
            user={props.auth.user}
          />
    </div>
  )
}

const mapStateToProps = state => {
    return {
        blogs: state.blogs,
        notification: state.notification,
        auth: state.auth
    }
};

const mapDispatchToProps = dispatch => {
    return {
        initBlogs: () => dispatch(initBlogs()),
        createBlog: blog => dispatch(createBlog(blog)),
        deleteBlog: id => dispatch(deleteBlog(id)),
        updateBlog: blog => dispatch(updateBlog(blog)),
        login: credentials => dispatch(login(credentials)),
        setAuthData: data => dispatch(setAuthData(data)),
        logout: () => dispatch(logout())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard)