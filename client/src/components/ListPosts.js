import React from "react";
import PropTypes from "prop-types";
import { fetchPosts } from "../app-state/actions/post-actions";
import { connect } from "react-redux";

const ListPosts = ({ posts }) => {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.content}</li>
      ))}
    </ul>
  );
};

ListPosts.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts.posts,
});

export default connect(mapStateToProps, { fetchPosts })(ListPosts);
